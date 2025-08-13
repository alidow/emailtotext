#!/bin/bash

# Cloudflare DNS Migration Script
# Migrates DNS records from Route53 to Cloudflare

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

# Cloudflare credentials (set these before running)
CF_API_TOKEN="${CF_API_TOKEN:-}"
CF_ZONE_ID="${CF_ZONE_ID:-}"
CF_EMAIL="${CF_EMAIL:-}"  # Only needed if using Global API Key

# Check if credentials are set
if [[ -z "$CF_API_TOKEN" ]] || [[ -z "$CF_ZONE_ID" ]]; then
    echo -e "${RED}Error: Cloudflare credentials not set${NC}"
    echo "Please set the following environment variables:"
    echo "  export CF_API_TOKEN='your-api-token'"
    echo "  export CF_ZONE_ID='your-zone-id'"
    exit 1
fi

echo -e "${GREEN}Starting DNS migration from Route53 to Cloudflare${NC}"
echo "Domain: $DOMAIN"
echo ""

# Export Route53 records
echo -e "${YELLOW}Step 1: Exporting Route53 DNS records...${NC}"
aws route53 list-resource-record-sets \
    --hosted-zone-id "$ROUTE53_ZONE_ID" \
    --profile "$AWS_PROFILE" \
    --output json > route53-export.json

if [[ ! -f route53-export.json ]]; then
    echo -e "${RED}Failed to export Route53 records${NC}"
    exit 1
fi

RECORD_COUNT=$(jq '.ResourceRecordSets | length' route53-export.json)
echo "Found $RECORD_COUNT records in Route53"

# Parse and convert records to Cloudflare format
echo -e "${YELLOW}Step 2: Converting records to Cloudflare format...${NC}"
cat > cloudflare-records.json << 'EOF'
[]
EOF

# Function to add record to Cloudflare
add_cloudflare_record() {
    local type="$1"
    local name="$2"
    local content="$3"
    local ttl="${4:-60}"
    local priority="${5:-}"
    local proxied="${6:-false}"
    
    # Clean up the name
    if [[ "$name" == "$DOMAIN." ]]; then
        name="@"
    else
        name="${name%.$DOMAIN.}"
        name="${name%.}"
    fi
    
    # Prepare the JSON payload
    local json_payload="{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":$ttl,\"proxied\":$proxied"
    
    if [[ -n "$priority" ]]; then
        json_payload="$json_payload,\"priority\":$priority"
    fi
    
    json_payload="$json_payload}"
    
    echo "  Adding $type record: $name -> $content"
    
    # Make API call to Cloudflare
    response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "$json_payload")
    
    success=$(echo "$response" | jq -r '.success')
    if [[ "$success" != "true" ]]; then
        echo -e "${RED}    Failed to add record${NC}"
        echo "$response" | jq -r '.errors[]?.message' 2>/dev/null || echo "$response"
        return 1
    else
        echo -e "${GREEN}    ✓ Added successfully${NC}"
    fi
}

echo -e "${YELLOW}Step 3: Creating DNS records in Cloudflare...${NC}"

# Process each record from Route53
while IFS= read -r record; do
    type=$(echo "$record" | jq -r '.Type')
    name=$(echo "$record" | jq -r '.Name')
    ttl=$(echo "$record" | jq -r '.TTL // 60')
    
    # Skip NS and SOA records (Cloudflare manages these)
    if [[ "$type" == "NS" ]] || [[ "$type" == "SOA" ]]; then
        echo "  Skipping $type record (managed by Cloudflare)"
        continue
    fi
    
    # Process based on record type
    case "$type" in
        A)
            value=$(echo "$record" | jq -r '.ResourceRecords[0].Value')
            # Proxy through Cloudflare for root and www
            if [[ "$name" == "$DOMAIN." ]] || [[ "$name" == "www.$DOMAIN." ]]; then
                add_cloudflare_record "A" "$name" "$value" "$ttl" "" "true"
            else
                add_cloudflare_record "A" "$name" "$value" "$ttl" "" "false"
            fi
            ;;
        
        CNAME)
            value=$(echo "$record" | jq -r '.ResourceRecords[0].Value')
            value="${value%.}"  # Remove trailing dot
            # Don't proxy Clerk, Mailgun, or Vercel CNAMEs
            add_cloudflare_record "CNAME" "$name" "$value" "$ttl" "" "false"
            ;;
        
        MX)
            # Process each MX record
            echo "$record" | jq -c '.ResourceRecords[]' | while read -r mx; do
                value=$(echo "$mx" | jq -r '.Value')
                # Extract priority and server
                priority=$(echo "$value" | cut -d' ' -f1)
                server=$(echo "$value" | cut -d' ' -f2)
                server="${server%.}"  # Remove trailing dot
                add_cloudflare_record "MX" "$name" "$server" "$ttl" "$priority" "false"
            done
            ;;
        
        TXT)
            # Process each TXT record
            echo "$record" | jq -c '.ResourceRecords[]' | while read -r txt; do
                value=$(echo "$txt" | jq -r '.Value')
                # Remove outer quotes if present
                value="${value#\"}"
                value="${value%\"}"
                add_cloudflare_record "TXT" "$name" "$value" "$ttl" "" "false"
            done
            ;;
        
        *)
            echo "  Warning: Unsupported record type $type"
            ;;
    esac
    
done < <(jq -c '.ResourceRecordSets[]' route53-export.json)

echo ""
echo -e "${YELLOW}Step 4: Configuring Cloudflare settings...${NC}"

# Configure recommended Cloudflare settings
configure_cf_setting() {
    local endpoint="$1"
    local data="$2"
    local description="$3"
    
    echo "  Configuring: $description"
    response=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/settings/$endpoint" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "$data")
    
    success=$(echo "$response" | jq -r '.success')
    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}    ✓ Configured${NC}"
    else
        echo -e "${YELLOW}    ⚠ Could not configure (may require higher plan)${NC}"
    fi
}

# Configure SSL/TLS
configure_cf_setting "ssl" '{"value":"full"}' "SSL/TLS mode to Full"

# Enable Always Use HTTPS
configure_cf_setting "always_use_https" '{"value":"on"}' "Always Use HTTPS"

# Enable Automatic HTTPS Rewrites
configure_cf_setting "automatic_https_rewrites" '{"value":"on"}' "Automatic HTTPS Rewrites"

# Enable Brotli compression
configure_cf_setting "brotli" '{"value":"on"}' "Brotli compression"

# Enable HTTP/3
configure_cf_setting "http3" '{"value":"on"}' "HTTP/3 (QUIC)"

# Auto Minify
configure_cf_setting "minify" '{"value":{"css":true,"html":true,"js":true}}' "Auto Minify (JS, CSS, HTML)"

echo ""
echo -e "${YELLOW}Step 5: Creating Page Rules...${NC}"

# Create page rule for forcing HTTPS
create_page_rule() {
    local targets="$1"
    local actions="$2"
    local description="$3"
    
    echo "  Creating rule: $description"
    response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/pagerules" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{\"targets\":$targets,\"actions\":$actions,\"priority\":1,\"status\":\"active\"}")
    
    success=$(echo "$response" | jq -r '.success')
    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}    ✓ Created${NC}"
    else
        echo -e "${YELLOW}    ⚠ Could not create (may already exist or limit reached)${NC}"
    fi
}

# Force HTTPS for all traffic
create_page_rule \
    '[{"target":"url","constraint":{"operator":"matches","value":"http://*emailtotextnotify.com/*"}}]' \
    '[{"id":"always_use_https","value":"on"}]' \
    "Force HTTPS redirect"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Migration Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "1. Verify all records in Cloudflare dashboard:"
echo "   https://dash.cloudflare.com/"
echo ""
echo "2. Update nameservers at your domain registrar to:"
echo "   (Check Cloudflare dashboard for your assigned nameservers)"
echo ""
echo "3. Wait for DNS propagation (24-48 hours)"
echo ""
echo "4. Run the validation script after propagation:"
echo "   ./validate-migration.sh"
echo ""
echo -e "${YELLOW}Important:${NC} Keep Route53 zone active for 48 hours to ensure smooth transition"