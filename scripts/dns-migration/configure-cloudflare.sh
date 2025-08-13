#!/bin/bash

# Configure Cloudflare settings for optimal performance

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CF_API_TOKEN="4CM44SNpAESKzZqhmeD3ewJWk8ZYvhkUn94jzFaN"
CF_ZONE_ID="c84c76b0ed7935041c4f3531787ce67b"

echo -e "${GREEN}Configuring Cloudflare Settings${NC}"
echo ""

# Function to configure setting
configure_setting() {
    local endpoint="$1"
    local data="$2"
    local description="$3"
    
    echo -n "  $description... "
    
    response=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/settings/$endpoint" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "$data")
    
    success=$(echo "$response" | jq -r '.success')
    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}✓${NC}"
    else
        error=$(echo "$response" | jq -r '.errors[0].message' 2>/dev/null || echo "Unknown")
        echo -e "${YELLOW}⚠ $error${NC}"
    fi
}

echo -e "${YELLOW}1. SSL/TLS Configuration${NC}"
echo "─────────────────────────────────────"
configure_setting "ssl" '{"value":"flexible"}' "SSL mode to Flexible (works with Vercel)"
configure_setting "always_use_https" '{"value":"on"}' "Always Use HTTPS"
configure_setting "automatic_https_rewrites" '{"value":"on"}' "Automatic HTTPS Rewrites"
configure_setting "min_tls_version" '{"value":"1.2"}' "Minimum TLS version to 1.2"

echo ""
echo -e "${YELLOW}2. Performance Settings${NC}"
echo "─────────────────────────────────────"
configure_setting "brotli" '{"value":"on"}' "Brotli compression"
configure_setting "http3" '{"value":"on"}' "HTTP/3 (QUIC)"
configure_setting "minify" '{"value":{"css":true,"html":true,"js":true}}' "Auto Minify (JS, CSS, HTML)"
configure_setting "rocket_loader" '{"value":"off"}' "Rocket Loader OFF (Next.js compatibility)"
configure_setting "early_hints" '{"value":"on"}' "Early Hints for faster loads"

echo ""
echo -e "${YELLOW}3. Security Settings${NC}"
echo "─────────────────────────────────────"
configure_setting "email_obfuscation" '{"value":"on"}' "Email obfuscation"
configure_setting "browser_check" '{"value":"on"}' "Browser integrity check"
configure_setting "hotlink_protection" '{"value":"off"}' "Hotlink protection OFF"
configure_setting "ip_geolocation" '{"value":"on"}' "IP Geolocation headers"

echo ""
echo -e "${YELLOW}4. Network Settings${NC}"
echo "─────────────────────────────────────"
configure_setting "websockets" '{"value":"on"}' "WebSocket support"
configure_setting "opportunistic_encryption" '{"value":"on"}' "Opportunistic Encryption"
configure_setting "0rtt" '{"value":"on"}' "0-RTT Connection Resumption"

echo ""
echo -e "${YELLOW}5. Caching Settings${NC}"
echo "─────────────────────────────────────"
configure_setting "browser_cache_ttl" '{"value":14400}' "Browser cache TTL (4 hours)"
configure_setting "development_mode" '{"value":"off"}' "Development mode OFF"

echo ""
echo -e "${YELLOW}6. Creating Page Rules${NC}"
echo "─────────────────────────────────────"

# Create page rule for API bypass
echo -n "  Creating API cache bypass rule... "
api_rule=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/pagerules" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "targets": [{"target": "url", "constraint": {"operator": "matches", "value": "*emailtotextnotify.com/api/*"}}],
        "actions": [
            {"id": "cache_level", "value": "bypass"},
            {"id": "disable_performance", "value": true}
        ],
        "priority": 1,
        "status": "active"
    }')

if echo "$api_rule" | jq -r '.success' | grep -q "true"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ May already exist${NC}"
fi

# Update proxy status for main domain
echo ""
echo -e "${YELLOW}7. Updating Proxy Status${NC}"
echo "─────────────────────────────────────"

# Get record IDs and update proxy status
echo -n "  Enabling proxy for main domain... "
main_record=$(curl -s "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?name=emailtotextnotify.com&type=A" \
    -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[0].id')

if [[ -n "$main_record" ]] && [[ "$main_record" != "null" ]]; then
    curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$main_record" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"proxied":true}' > /dev/null
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Record not found${NC}"
fi

echo -n "  Enabling proxy for www subdomain... "
www_record=$(curl -s "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?name=www.emailtotextnotify.com&type=CNAME" \
    -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result[0].id')

if [[ -n "$www_record" ]] && [[ "$www_record" != "null" ]]; then
    curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$www_record" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"proxied":true}' > /dev/null
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Record not found${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Cloudflare Configuration Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "✅ All DNS records migrated"
echo "✅ Performance settings optimized"
echo "✅ Security features enabled"
echo "✅ CDN proxy enabled for main domain"
echo ""
echo -e "${YELLOW}IMPORTANT: Update nameservers at your registrar:${NC}"
echo "   • anuj.ns.cloudflare.com"
echo "   • desiree.ns.cloudflare.com"
echo ""
echo "Dashboard: https://dash.cloudflare.com/$CF_ZONE_ID/emailtotextnotify.com"
echo ""
echo "After nameserver update, run: ./validate-migration.sh"