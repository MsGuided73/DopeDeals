# 🔒 Security Setup Guide for Self-Hosted Website

## 🚨 **CRITICAL FIRST STEPS**

### 1. **SSL/TLS Certificate (HTTPS)**
```bash
# Using Let's Encrypt (Free)
sudo apt update
sudo apt install certbot nginx
sudo certbot --nginx -d yourdomain.com

# Or using Cloudflare (Recommended for ease)
# Set up Cloudflare DNS and enable "Always Use HTTPS"
```

### 2. **Firewall Configuration**
```bash
# Install UFW
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Check status
sudo ufw status
```

### 3. **Server Hardening**
```bash
# Disable root login
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Use fail2ban for SSH protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Keep system updated
sudo apt update && sudo apt upgrade -y
```

---

## 🛡️ **Application Security (Already Configured)**

### ✅ **Security Headers (Enhanced)**
Your `next.config.js` now includes:
- **HSTS**: Forces HTTPS connections
- **CSP**: Prevents XSS attacks
- **COEP/COOP**: Cross-origin isolation
- **Permissions Policy**: Restricts browser features

### ✅ **Authentication & Authorization**
- Supabase Auth with JWT tokens
- Admin role verification
- Protected routes middleware
- Age verification for product pages

### ✅ **Input Validation**
- Zod schemas for API validation
- TypeScript for type safety
- SQL injection prevention via Supabase ORM

---

## 🔐 **Additional Security Measures**

### 4. **Rate Limiting**
```bash
# Install nginx rate limiting
sudo apt install nginx

# Add to nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

server {
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        # ... rest of config
    }

    # Auth rate limiting
    location /auth {
        limit_req zone=auth burst=5 nodelay;
        # ... rest of config
    }
}
```

### 5. **Environment Variables Security**
```bash
# Never commit secrets to git
# Use .env.production for production
# Rotate keys regularly

# Check for exposed secrets
grep -r "SUPABASE_SERVICE_ROLE_KEY\|SUPABASE_ANON_KEY" /var/www/
```

### 6. **Database Security**
```sql
-- Enable RLS (Row Level Security) in Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);
```

### 7. **Monitoring & Logging**
```bash
# Install monitoring
sudo apt install prometheus node-exporter

# Log analysis
sudo apt install logwatch
sudo logwatch --detail High --mailto admin@yourdomain.com --range yesterday

# Intrusion detection
sudo apt install rkhunter chkrootkit
sudo rkhunter --check
```

### 8. **Backup Strategy**
```bash
# Automated backups
sudo apt install duplicity

# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres yourdb > /backups/db_$DATE.sql

# File system backup
duplicity /var/www/html file:///backups/website
```

---

## 🚦 **Security Checklist**

### **Network Security**
- [ ] SSL/TLS certificate installed
- [ ] Firewall configured (UFW)
- [ ] SSH hardened (no root login)
- [ ] Fail2ban installed
- [ ] Rate limiting configured

### **Application Security**
- [x] Security headers configured
- [x] Authentication implemented
- [x] Input validation active
- [ ] Rate limiting added
- [ ] CSRF protection verified

### **Data Security**
- [ ] Environment variables secured
- [ ] Database RLS enabled
- [ ] Encryption at rest configured
- [ ] Backup strategy implemented

### **Monitoring**
- [ ] Log monitoring setup
- [ ] Intrusion detection active
- [ ] Automated alerts configured
- [ ] Regular security audits

---

## 🔍 **Security Testing**

### **Automated Testing**
```bash
# Install security testing tools
npm install -g retire eslint-plugin-security

# Run security audit
npm audit --audit-level=high

# Check for vulnerabilities
snyk test
```

### **Manual Security Checks**
```bash
# Test SSL configuration
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check security headers
curl -I https://yourdomain.com

# Test for common vulnerabilities
nikto -h https://yourdomain.com
```

---

## 🚨 **Emergency Response**

### **If Compromised**
1. **Isolate**: Disconnect from network
2. **Assess**: Check logs for breach indicators
3. **Contain**: Change all passwords/keys
4. **Recover**: Restore from clean backup
5. **Monitor**: Watch for re-infection

### **Contact Information**
- **Emergency**: Rotate all API keys immediately
- **Support**: Check Supabase security dashboard
- **Logs**: Review nginx/access logs for suspicious activity

---

## 📚 **Additional Resources**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [nginx Security](https://nginx.org/en/docs/security_advisories.html)

---

## ⚡ **Quick Security Commands**

```bash
# Check running services
sudo netstat -tlnp

# Monitor logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/auth.log

# Check file permissions
find /var/www -type f -perm 777
find /var/www -type d -perm 777

# Update SSL certificates
sudo certbot renew
```

**Remember**: Security is an ongoing process. Regular updates, monitoring, and audits are essential for maintaining a secure website.
