# Cloudflare DNS Migration Guide

## Overview

This guide documents the migration of DNS services from AWS Route53 to Cloudflare for emailtotextnotify.com.

## Benefits of Migration

### Cost Savings
- **Route53**: $4/month ($48/year)
- **Cloudflare**: $0/month (Free tier)
- **Annual Savings**: $48

### Performance Improvements
- Global CDN with 300+ data centers
- Automatic image and asset optimization
- HTTP/3 and Brotli compression
- Smart routing and caching
- Expected 20-40% faster page loads

### Security Enhancements
- Free DDoS protection
- Web Application Firewall (WAF)
- Bot protection and rate limiting
- SSL certificate management

### Developer Experience
- Better UI/UX than Route53
- Simpler API
- Real-time analytics
- Page Rules for redirects and caching

## Pre-Migration Checklist

### 1. Cloudflare Account Setup
- [ ] Create Cloudflare account at https://cloudflare.com
- [ ] Add emailtotextnotify.com to your account
- [ ] Skip automatic DNS import (we'll use our script)
- [ ] Note your assigned nameservers (e.g., `xxx.ns.cloudflare.com`)

### 2. Get Cloudflare Credentials
- [ ] Go to https://dash.cloudflare.com/profile/api-tokens
- [ ] Create API token with `Zone:DNS:Edit` permission
- [ ] Copy your Zone ID from domain overview page
- [ ] Save credentials securely

### 3. Backup Current Configuration
- [ ] Export Route53 records (done by script)
- [ ] Document current nameservers
- [ ] Test current functionality

## Migration Process

### Step 1: Prepare Environment

```bash
# Navigate to migration scripts
cd scripts/dns-migration

# Set Cloudflare credentials
export CF_API_TOKEN="your-api-token-here"
export CF_ZONE_ID="your-zone-id-here"

# Make scripts executable
chmod +x *.sh
```

### Step 2: Run Migration Script

```bash
# Execute the migration
./migrate-to-cloudflare.sh
```

The script will:
1. Export all Route53 records
2. Convert to Cloudflare format
3. Create records via Cloudflare API
4. Configure optimal settings
5. Set up page rules

### Step 3: Verify in Cloudflare Dashboard

1. Log into Cloudflare dashboard
2. Navigate to your domain
3. Check DNS records tab
4. Verify all records imported:
   - A record for root domain
   - CNAME for www
   - MX records for txt subdomain (Mailgun)
   - TXT records (SPF, DKIM)
   - Clerk authentication CNAMEs

### Step 4: Update Nameservers

1. Log into your domain registrar
2. Find DNS/Nameserver settings
3. Replace Route53 nameservers with Cloudflare:
   - Remove: `ns-xxx.awsdns-xx.xxx`
   - Add: Cloudflare nameservers from dashboard

### Step 5: Wait for Propagation

DNS propagation typically takes:
- Most locations: 2-4 hours
- Global completion: 24-48 hours

### Step 6: Validate Migration

```bash
# Run validation script
./validate-migration.sh
```

## DNS Records Overview

### Main Domain Records
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | @ | 216.198.79.1 | Yes |
| CNAME | www | Vercel DNS | Yes |

### Email Records (Mailgun)
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| MX | txt | mxa.mailgun.org (priority 10) | No |
| MX | txt | mxb.mailgun.org (priority 10) | No |
| TXT | txt | v=spf1 include:mailgun.org ~all | No |
| TXT | krs._domainkey.txt | DKIM public key | No |
| CNAME | email.txt | mailgun.org | No |

### Authentication Records (Clerk)
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| CNAME | accounts | accounts.clerk.services | No |
| CNAME | clerk | frontend-api.clerk.services | No |
| CNAME | clkmail | mail.xxx.clerk.services | No |
| CNAME | clk._domainkey | dkim1.xxx.clerk.services | No |
| CNAME | clk2._domainkey | dkim2.xxx.clerk.services | No |

## Cloudflare Configuration

### SSL/TLS Settings
- Mode: Full (strict)
- Minimum TLS: 1.2
- Automatic HTTPS Rewrites: On
- Always Use HTTPS: On

### Performance Settings
- Auto Minify: JS, CSS, HTML
- Brotli: On
- HTTP/3: On
- Early Hints: On
- Rocket Loader: Off (for Next.js compatibility)

### Page Rules (Free tier: 3 rules)
1. Force HTTPS: `http://*emailtotextnotify.com/*`
2. Bypass cache for API: `*emailtotextnotify.com/api/*`
3. Cache static assets: `*emailtotextnotify.com/*.js`

## Testing Checklist

### DNS Resolution
- [ ] `dig A emailtotextnotify.com` returns correct IP
- [ ] `dig CNAME www.emailtotextnotify.com` returns Vercel
- [ ] `dig MX txt.emailtotextnotify.com` returns Mailgun

### Website Functionality
- [ ] Main site loads over HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] www subdomain works
- [ ] No mixed content warnings

### Email System
- [ ] Send test email to `[phone]@txt.emailtotextnotify.com`
- [ ] Verify SMS received
- [ ] Check Mailgun logs

### Authentication
- [ ] Clerk login works
- [ ] Sign up flow works
- [ ] Email verification works

### Performance
- [ ] Page load time improved
- [ ] Assets compressed (check headers)
- [ ] CDN working (check CF headers)

## Rollback Process

If issues arise, you can rollback to Route53:

```bash
# Run rollback script
./rollback-to-route53.sh

# Follow instructions to update nameservers back to Route53
```

## Monitoring

### Cloudflare Dashboard
- Analytics: Traffic, performance, threats
- DNS Analytics: Query patterns
- Security Events: Blocked threats
- Performance: Core Web Vitals

### External Monitoring
- Use uptimerobot.com or similar for uptime
- Monitor DNS propagation at whatsmydns.net
- Check SSL at sslshopper.com

## Cost Comparison

### Route53 (Previous)
- Hosted Zone: $0.50/month
- DNS Queries: ~$3.50/month
- Total: $48/year

### Cloudflare (New)
- DNS Hosting: $0
- CDN: $0
- SSL: $0
- Analytics: $0
- Total: $0/year

## Troubleshooting

### DNS Not Resolving
- Check nameserver propagation
- Verify records in Cloudflare dashboard
- Clear local DNS cache

### SSL Certificate Issues
- Wait for Cloudflare to provision certificate (up to 24 hours)
- Ensure SSL mode is set to "Full"
- Check origin server has valid certificate

### Email Not Working
- Verify MX records are NOT proxied
- Check SPF and DKIM records
- Test with Mailgun logs

### Performance Issues
- Check if domain is proxied (orange cloud)
- Verify caching rules
- Check for conflicting page rules

## Support Resources

### Cloudflare
- Documentation: https://developers.cloudflare.com
- Community: https://community.cloudflare.com
- Status: https://www.cloudflarestatus.com

### DNS Tools
- DNS Checker: https://dnschecker.org
- MX Toolbox: https://mxtoolbox.com
- DNS Propagation: https://www.whatsmydns.net

## Timeline

- **Hour 0**: Run migration script
- **Hour 0-1**: Update nameservers at registrar
- **Hour 2-4**: Initial propagation (some regions)
- **Hour 24-48**: Full global propagation
- **Day 3**: Verify everything working
- **Day 7**: Decommission Route53 zone (optional)

## Notes

- Keep Route53 zone active for at least 48 hours after migration
- Cloudflare Free tier is sufficient for most MVP needs
- Can upgrade to Pro ($20/month) for more features if needed
- DNS records are backed up in `route53-export.json`