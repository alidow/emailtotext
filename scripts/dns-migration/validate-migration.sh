#!/bin/bash

# DNS Migration Validation Script
# Validates that all DNS records are properly configured after migration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="emailtotextnotify.com"
EXPECTED_A_RECORD="216.198.79.1"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}DNS Migration Validation Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Track validation results
ERRORS=0
WARNINGS=0

# Function to check DNS record
check_dns() {
    local record_type="$1"
    local domain="$2"
    local expected="$3"
    local description="$4"
    
    echo -n "Checking $description... "
    
    result=$(dig +short "$record_type" "$domain" 2>/dev/null | head -n 1)
    
    if [[ -z "$result" ]]; then
        echo -e "${RED}✗ No record found${NC}"
        ((ERRORS++))
        return 1
    fi
    
    if [[ -n "$expected" ]]; then
        if [[ "$result" == *"$expected"* ]]; then
            echo -e "${GREEN}✓ Found: $result${NC}"
        else
            echo -e "${YELLOW}⚠ Found: $result (expected: $expected)${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${GREEN}✓ Found: $result${NC}"
    fi
}

# Function to test HTTP/HTTPS
test_http() {
    local url="$1"
    local description="$2"
    
    echo -n "Testing $description... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" -I "$url" --max-time 10 2>/dev/null)
    
    if [[ "$response_code" == "200" ]] || [[ "$response_code" == "301" ]] || [[ "$response_code" == "302" ]] || [[ "$response_code" == "307" ]] || [[ "$response_code" == "308" ]]; then
        echo -e "${GREEN}✓ HTTP $response_code${NC}"
    else
        echo -e "${RED}✗ HTTP $response_code${NC}"
        ((ERRORS++))
    fi
}

echo -e "${YELLOW}1. Nameserver Configuration${NC}"
echo "─────────────────────────────────────"

# Check nameservers
NS_RECORDS=$(dig NS "$DOMAIN" +short | sort)
if echo "$NS_RECORDS" | grep -q "cloudflare.com"; then
    echo -e "${GREEN}✓ Using Cloudflare nameservers${NC}"
    echo "$NS_RECORDS" | while read -r ns; do
        echo "  • $ns"
    done
elif echo "$NS_RECORDS" | grep -q "awsdns"; then
    echo -e "${YELLOW}⚠ Still using Route53 nameservers${NC}"
    echo "$NS_RECORDS" | while read -r ns; do
        echo "  • $ns"
    done
    echo -e "${YELLOW}  Note: Nameserver propagation can take 24-48 hours${NC}"
    ((WARNINGS++))
else
    echo -e "${RED}✗ Unknown nameservers${NC}"
    echo "$NS_RECORDS"
    ((ERRORS++))
fi

echo ""
echo -e "${YELLOW}2. Core DNS Records${NC}"
echo "─────────────────────────────────────"

# Check A record for main domain
check_dns "A" "$DOMAIN" "$EXPECTED_A_RECORD" "A record for $DOMAIN"

# Check CNAME for www
check_dns "CNAME" "www.$DOMAIN" "" "CNAME for www.$DOMAIN"

echo ""
echo -e "${YELLOW}3. Email Configuration (Mailgun)${NC}"
echo "─────────────────────────────────────"

# Check MX records
echo -n "Checking MX records for txt.$DOMAIN... "
MX_RECORDS=$(dig MX "txt.$DOMAIN" +short 2>/dev/null)
if echo "$MX_RECORDS" | grep -q "mailgun.org"; then
    echo -e "${GREEN}✓ Mailgun MX records found${NC}"
    echo "$MX_RECORDS" | while read -r mx; do
        echo "  • $mx"
    done
else
    echo -e "${RED}✗ Mailgun MX records not found${NC}"
    ((ERRORS++))
fi

# Check SPF record
echo -n "Checking SPF record for txt.$DOMAIN... "
SPF_RECORD=$(dig TXT "txt.$DOMAIN" +short 2>/dev/null | grep "v=spf1")
if echo "$SPF_RECORD" | grep -q "mailgun.org"; then
    echo -e "${GREEN}✓ SPF record found${NC}"
else
    echo -e "${RED}✗ SPF record not found${NC}"
    ((ERRORS++))
fi

# Check DKIM record
echo -n "Checking DKIM record... "
DKIM_RECORD=$(dig TXT "krs._domainkey.txt.$DOMAIN" +short 2>/dev/null)
if [[ -n "$DKIM_RECORD" ]]; then
    echo -e "${GREEN}✓ DKIM record found${NC}"
else
    echo -e "${YELLOW}⚠ DKIM record not found (check record name)${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${YELLOW}4. Authentication (Clerk)${NC}"
echo "─────────────────────────────────────"

# Check Clerk CNAMEs
check_dns "CNAME" "accounts.$DOMAIN" "accounts.clerk.services" "Clerk accounts CNAME"
check_dns "CNAME" "clerk.$DOMAIN" "frontend-api.clerk.services" "Clerk API CNAME"
check_dns "CNAME" "clkmail.$DOMAIN" "" "Clerk mail CNAME"

# Check Clerk DKIM
echo -n "Checking Clerk DKIM records... "
CLERK_DKIM1=$(dig CNAME "clk._domainkey.$DOMAIN" +short 2>/dev/null)
CLERK_DKIM2=$(dig CNAME "clk2._domainkey.$DOMAIN" +short 2>/dev/null)
if [[ -n "$CLERK_DKIM1" ]] && [[ -n "$CLERK_DKIM2" ]]; then
    echo -e "${GREEN}✓ Both DKIM records found${NC}"
else
    echo -e "${YELLOW}⚠ Some DKIM records missing${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${YELLOW}5. Website Connectivity${NC}"
echo "─────────────────────────────────────"

# Test HTTP to HTTPS redirect
test_http "http://$DOMAIN" "HTTP to HTTPS redirect"
test_http "https://$DOMAIN" "HTTPS main domain"
test_http "https://www.$DOMAIN" "HTTPS www subdomain"

echo ""
echo -e "${YELLOW}6. Cloudflare Features${NC}"
echo "─────────────────────────────────────"

# Check if proxied through Cloudflare
echo -n "Checking Cloudflare proxy... "
A_RECORD=$(dig A "$DOMAIN" +short 2>/dev/null)
if [[ "$A_RECORD" =~ ^104\.|^172\.|^173\.|^103\.|^141\.|^188\. ]]; then
    echo -e "${GREEN}✓ Domain is proxied through Cloudflare${NC}"
else
    echo -e "${YELLOW}⚠ Domain may not be proxied (IP: $A_RECORD)${NC}"
    ((WARNINGS++))
fi

# Check SSL certificate
echo -n "Checking SSL certificate... "
SSL_ISSUER=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null | grep -o "O = .*" | cut -d'"' -f1)
if echo "$SSL_ISSUER" | grep -q "Cloudflare"; then
    echo -e "${GREEN}✓ Using Cloudflare SSL certificate${NC}"
elif echo "$SSL_ISSUER" | grep -q "Let's Encrypt"; then
    echo -e "${GREEN}✓ Using Let's Encrypt certificate${NC}"
else
    echo -e "${YELLOW}⚠ SSL issuer: $SSL_ISSUER${NC}"
    ((WARNINGS++))
fi

# Check HTTP headers for Cloudflare
echo -n "Checking Cloudflare headers... "
CF_HEADERS=$(curl -sI "https://$DOMAIN" --max-time 10 2>/dev/null | grep -i "cf-\|cloudflare")
if [[ -n "$CF_HEADERS" ]]; then
    echo -e "${GREEN}✓ Cloudflare headers detected${NC}"
else
    echo -e "${YELLOW}⚠ No Cloudflare headers found${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${YELLOW}7. Performance Tests${NC}"
echo "─────────────────────────────────────"

# Test response time
echo -n "Testing response time... "
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "https://$DOMAIN" --max-time 10 2>/dev/null)
if (( $(echo "$RESPONSE_TIME < 2" | bc -l) )); then
    echo -e "${GREEN}✓ Response time: ${RESPONSE_TIME}s${NC}"
else
    echo -e "${YELLOW}⚠ Response time: ${RESPONSE_TIME}s (slower than expected)${NC}"
    ((WARNINGS++))
fi

# Check compression
echo -n "Checking compression... "
ENCODING=$(curl -sI -H "Accept-Encoding: gzip,br" "https://$DOMAIN" --max-time 10 2>/dev/null | grep -i "content-encoding")
if echo "$ENCODING" | grep -q "br\|gzip"; then
    echo -e "${GREEN}✓ Compression enabled: $ENCODING${NC}"
else
    echo -e "${YELLOW}⚠ No compression detected${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

if [[ $ERRORS -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}✓ All checks passed! Migration successful.${NC}"
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}⚠ Migration complete with $WARNINGS warning(s)${NC}"
    echo "  These are typically normal during DNS propagation."
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo "  Please review the issues above."
    exit 1
fi