#!/bin/bash

# Route53 Rollback Script
# Restores DNS back to Route53 if Cloudflare migration needs to be reverted

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="emailtotextnotify.com"
ROUTE53_ZONE_ID="Z08307971JA1ZNQQ8Z8M"
AWS_PROFILE="terraform-test"

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Route53 DNS Rollback Script${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "This script will help you rollback to Route53 if needed."
echo ""

# Check if backup exists
if [[ ! -f "route53-export.json" ]]; then
    echo -e "${RED}Error: No backup file (route53-export.json) found${NC}"
    echo "Cannot rollback without backup. Trying to fetch current Route53 state..."
    
    # Try to export current state
    aws route53 list-resource-record-sets \
        --hosted-zone-id "$ROUTE53_ZONE_ID" \
        --profile "$AWS_PROFILE" \
        --output json > route53-current-state.json
    
    if [[ -f "route53-current-state.json" ]]; then
        echo -e "${GREEN}Current Route53 state exported to route53-current-state.json${NC}"
    fi
    exit 1
fi

echo -e "${GREEN}Step 1: Verifying Route53 Zone${NC}"
# Get Route53 nameservers
ROUTE53_NS=$(aws route53 get-hosted-zone \
    --id "$ROUTE53_ZONE_ID" \
    --profile "$AWS_PROFILE" \
    --output json | jq -r '.DelegationSet.NameServers[]')

echo "Route53 Nameservers:"
echo "$ROUTE53_NS" | while read -r ns; do
    echo "  - $ns"
done

echo ""
echo -e "${GREEN}Step 2: Current DNS Status${NC}"
echo "Checking current nameservers for $DOMAIN..."

CURRENT_NS=$(dig NS "$DOMAIN" +short | sort)
echo "Current nameservers:"
echo "$CURRENT_NS" | while read -r ns; do
    echo "  - $ns"
done

# Check if already on Route53
if echo "$CURRENT_NS" | grep -q "awsdns"; then
    echo -e "${YELLOW}Warning: Domain appears to already be using Route53 nameservers${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Rollback cancelled"
        exit 0
    fi
fi

echo ""
echo -e "${GREEN}Step 3: Rollback Steps${NC}"
echo ""
echo "To rollback to Route53, you need to:"
echo ""
echo "1. Log into your domain registrar (where you bought the domain)"
echo ""
echo "2. Change the nameservers from Cloudflare back to Route53:"
echo -e "${YELLOW}Route53 Nameservers:${NC}"
echo "$ROUTE53_NS" | while read -r ns; do
    echo "   • $ns"
done
echo ""
echo "3. Wait for DNS propagation (24-48 hours)"
echo ""

echo -e "${YELLOW}Step 4: Verify Current Route53 Records${NC}"
echo "Current records in Route53 zone:"
echo ""

# Display summary of records
jq -r '.ResourceRecordSets[] | "\(.Type)\t\(.Name)"' route53-export.json | \
    grep -v "^NS\|^SOA" | \
    sort | uniq | \
    while IFS=$'\t' read -r type name; do
        echo "  $type record: $name"
    done

echo ""
echo -e "${GREEN}Step 5: Post-Rollback Testing${NC}"
echo ""
echo "After changing nameservers, test with:"
echo ""
echo "  # Check nameserver propagation"
echo "  dig NS $DOMAIN +short"
echo ""
echo "  # Test website"
echo "  curl -I https://$DOMAIN"
echo ""
echo "  # Test email MX records"
echo "  dig MX txt.$DOMAIN +short"
echo ""

# Create a validation script for rollback
cat > validate-rollback.sh << 'SCRIPT_EOF'
#!/bin/bash

DOMAIN="emailtotextnotify.com"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Validating Route53 rollback for $DOMAIN..."
echo ""

# Check nameservers
echo "Checking nameservers..."
NS=$(dig NS "$DOMAIN" +short)
if echo "$NS" | grep -q "awsdns"; then
    echo -e "${GREEN}✓ Using Route53 nameservers${NC}"
else
    echo -e "${RED}✗ Not using Route53 nameservers yet${NC}"
    echo "$NS"
fi

# Check A record
echo "Checking A record..."
A_RECORD=$(dig A "$DOMAIN" +short)
if [[ "$A_RECORD" == "216.198.79.1" ]]; then
    echo -e "${GREEN}✓ A record correct: $A_RECORD${NC}"
else
    echo -e "${RED}✗ A record mismatch: $A_RECORD${NC}"
fi

# Check MX records
echo "Checking MX records for txt.$DOMAIN..."
MX_RECORDS=$(dig MX "txt.$DOMAIN" +short)
if echo "$MX_RECORDS" | grep -q "mailgun.org"; then
    echo -e "${GREEN}✓ Mailgun MX records found${NC}"
else
    echo -e "${RED}✗ Mailgun MX records not found${NC}"
fi

# Check website
echo "Checking website..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "https://$DOMAIN")
if [[ "$HTTP_CODE" == "200" ]] || [[ "$HTTP_CODE" == "301" ]] || [[ "$HTTP_CODE" == "302" ]]; then
    echo -e "${GREEN}✓ Website responding: HTTP $HTTP_CODE${NC}"
else
    echo -e "${YELLOW}⚠ Website HTTP code: $HTTP_CODE${NC}"
fi

echo ""
echo "Rollback validation complete!"
SCRIPT_EOF

chmod +x validate-rollback.sh

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Rollback Instructions Complete${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Files created:"
echo "  • validate-rollback.sh - Run this after changing nameservers"
echo ""
echo -e "${YELLOW}Important Notes:${NC}"
echo "• Keep Cloudflare account active during transition"
echo "• DNS changes take 24-48 hours to fully propagate"
echo "• Test thoroughly after rollback completes"
echo "• Your Route53 zone is still active and costs ~$0.50/month"