#!/bin/bash

# Add missing DNS records to Cloudflare

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CF_API_TOKEN="4CM44SNpAESKzZqhmeD3ewJWk8ZYvhkUn94jzFaN"
CF_ZONE_ID="c84c76b0ed7935041c4f3531787ce67b"

echo -e "${GREEN}Adding missing DNS records to Cloudflare${NC}"
echo ""

# Function to add record
add_record() {
    local type="$1"
    local name="$2"
    local content="$3"
    local priority="${4:-}"
    local proxied="${5:-false}"
    
    echo -n "Adding $type record: $name -> ${content:0:50}... "
    
    json_payload="{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"proxied\":$proxied"
    
    if [[ -n "$priority" ]]; then
        json_payload="$json_payload,\"priority\":$priority"
    fi
    
    json_payload="$json_payload}"
    
    response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "$json_payload")
    
    success=$(echo "$response" | jq -r '.success')
    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}✓${NC}"
    else
        error=$(echo "$response" | jq -r '.errors[0].message' 2>/dev/null || echo "Unknown error")
        if [[ "$error" == *"already exists"* ]]; then
            echo -e "${YELLOW}Already exists${NC}"
        else
            echo -e "${RED}Failed: $error${NC}"
        fi
    fi
}

echo -e "${YELLOW}1. Adding Mailgun Email Records${NC}"
echo "─────────────────────────────────────"

# MX records for txt subdomain
add_record "MX" "txt.emailtotextnotify.com" "mxa.mailgun.org" "10" "false"
add_record "MX" "txt.emailtotextnotify.com" "mxb.mailgun.org" "10" "false"

# SPF record for txt subdomain
add_record "TXT" "txt.emailtotextnotify.com" "v=spf1 include:mailgun.org ~all" "" "false"

# DKIM record for Mailgun
add_record "TXT" "krs._domainkey.txt.emailtotextnotify.com" "k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzfg2yKzMf2iTzBzPSknTjXfZbrdjdi9Gx/f9WLrtpNyzi9mlFyc46rVFcFpiYnAaLBknv28M5nedc19VftVSmqpMnXAw2VC/sNdYd61JEuGuFkl14AcnbNxNTo/9j2OmSAvozvV6fxR2Hra79XM21pTMF0Gr6dsKCjBbMDlAbSwFwqcMoFsRm0h6XVdkeY5FEVa6Du+vJza4cOIJUb/bcDBGqCG986z4XkYEYrlnEpw2wxgVfGI3dmqTwQe47P4up8J5tKxAfNclnJGKjdaz5alZ+cYvaRJfLfsA2rJ8QGlX4hzbKKbR1o9mFpziRFCTrsQ83LKCODObjEpnZdCO+wIDAQAB" "" "false"

# Tracking CNAME for Mailgun
add_record "CNAME" "email.txt.emailtotextnotify.com" "mailgun.org" "" "false"

echo ""
echo -e "${YELLOW}2. Adding Clerk Authentication Records${NC}"
echo "─────────────────────────────────────"

# Clerk CNAMEs
add_record "CNAME" "accounts.emailtotextnotify.com" "accounts.clerk.services" "" "false"
add_record "CNAME" "clerk.emailtotextnotify.com" "frontend-api.clerk.services" "" "false"
add_record "CNAME" "clkmail.emailtotextnotify.com" "mail.yw73q6btte6o.clerk.services" "" "false"

# Clerk DKIM records
add_record "CNAME" "clk._domainkey.emailtotextnotify.com" "dkim1.yw73q6btte6o.clerk.services" "" "false"
add_record "CNAME" "clk2._domainkey.emailtotextnotify.com" "dkim2.yw73q6btte6o.clerk.services" "" "false"

echo ""
echo -e "${YELLOW}3. Adding Additional Records${NC}"
echo "─────────────────────────────────────"

# Root domain MX (if needed)
add_record "MX" "emailtotextnotify.com" "SMTP.GOOGLE.COM" "1" "false"

# Google verification TXT
add_record "TXT" "emailtotextnotify.com" "google-site-verification=1AoquZC5gFoG72r1SDtnP6S5S4t2OcRz-EYrrVw3GNo" "" "false"

echo ""
echo -e "${GREEN}DNS record migration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify records in Cloudflare dashboard:"
echo "   https://dash.cloudflare.com/$CF_ZONE_ID/emailtotextnotify.com/dns"
echo ""
echo "2. Update nameservers at your registrar to:"
echo "   • anuj.ns.cloudflare.com"
echo "   • desiree.ns.cloudflare.com"
echo ""
echo "3. Configure Cloudflare settings with ./configure-cloudflare.sh"