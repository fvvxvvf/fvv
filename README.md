# FV Drones Website - VPS Deployment Guide

## 🚀 Complete Setup Instructions for Hostalia VPS

This guide will help you deploy the FV Drones website on your Hostalia VPS server and make it accessible via your domain.

---

## 📋 Prerequisites

- **VPS Server**: Hostalia VPS with Ubuntu 20.04+ or CentOS 8+
- **Domain**: Registered domain through Hostalia
- **SSH Access**: Root or sudo access to your VPS
- **Basic Knowledge**: Command line familiarity

---

## 🛠️ Step 1: Initial Server Setup

### Connect to Your VPS
```bash
ssh root@your-server-ip
# or
ssh username@your-server-ip
```

### Update System Packages
```bash
# For Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# For CentOS/RHEL
sudo yum update -y
```

### Install Essential Tools
```bash
# Ubuntu/Debian
sudo apt install -y curl wget git unzip software-properties-common

# CentOS/RHEL
sudo yum install -y curl wget git unzip epel-release
```

---

## 🟢 Step 2: Install Node.js

### Install Node.js 18.x (LTS)
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Alternative: Using NVM (Node Version Manager)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload bash profile
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

---

## 🌐 Step 3: Install and Configure Nginx

### Install Nginx
```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Configure Firewall
```bash
# Ubuntu (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

---

## 📁 Step 4: Deploy Your Website

### Create Project Directory
```bash
sudo mkdir -p /var/www/fvdrones
sudo chown -R $USER:$USER /var/www/fvdrones
cd /var/www/fvdrones
```

### Clone or Upload Your Project
```bash
# Option 1: If using Git
git clone https://github.com/yourusername/fvdrones-website.git .

# Option 2: Upload files via SCP from your local machine
# scp -r /path/to/your/project/* username@your-server-ip:/var/www/fvdrones/
```

### Install Dependencies and Build
```bash
# Install project dependencies
npm install

# Build the production version
npm run build

# Verify build folder exists
ls -la dist/
```

---

## ⚙️ Step 5: Configure Nginx for Your Domain

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/fvdrones
```

### Add Configuration Content
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/fvdrones/dist;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security - hide nginx version
    server_tokens off;

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Enable the Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/fvdrones /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 6: Setup SSL Certificate (HTTPS)

### Install Certbot
```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# 1. Enter your email address
# 2. Agree to terms of service
# 3. Choose whether to share email with EFF
# 4. Select redirect option (recommended: 2)
```

### Setup Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e

# Add this line to run twice daily:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🌍 Step 7: Configure Domain DNS

### In Your Hostalia Control Panel:

1. **Access DNS Management**
   - Log into your Hostalia account
   - Navigate to Domain Management
   - Select your domain
   - Go to DNS Zone Editor

2. **Add/Update DNS Records**
   ```
   Type: A
   Name: @
   Value: YOUR_VPS_IP_ADDRESS
   TTL: 3600

   Type: A  
   Name: www
   Value: YOUR_VPS_IP_ADDRESS
   TTL: 3600
   ```

3. **Wait for Propagation**
   - DNS changes can take 24-48 hours to fully propagate
   - Check status: `dig yourdomain.com` or use online DNS checkers

---

## 🔧 Step 8: Process Management (Optional but Recommended)

### Install PM2 for Process Management
```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem file
nano ecosystem.config.js
```

### PM2 Configuration (if you need a Node.js server)
```javascript
module.exports = {
  apps: [{
    name: 'fvdrones-website',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### Start with PM2 (if needed)
```bash
# Install serve package
npm install -g serve

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

---

## 📊 Step 9: Monitoring and Maintenance

### Setup Log Monitoring
```bash
# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Setup log rotation (usually pre-configured)
sudo nano /etc/logrotate.d/nginx
```

### Performance Monitoring
```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

### Regular Maintenance Tasks
```bash
# Update system packages (monthly)
sudo apt update && sudo apt upgrade -y

# Clean package cache
sudo apt autoremove -y
sudo apt autoclean

# Monitor SSL certificate expiry
sudo certbot certificates
```

---

## 🚨 Step 10: Troubleshooting

### Common Issues and Solutions

#### Website Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check if port 80/443 are open
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check SSL configuration
openssl s_client -connect yourdomain.com:443
```

#### DNS Issues
```bash
# Check DNS resolution
nslookup yourdomain.com
dig yourdomain.com

# Check from different locations
# Use online tools like whatsmydns.net
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/fvdrones
sudo chmod -R 755 /var/www/fvdrones
```

---

## 📝 Step 11: Final Checklist

- [ ] ✅ VPS server updated and secured
- [ ] ✅ Node.js and npm installed
- [ ] ✅ Nginx installed and configured
- [ ] ✅ Website files uploaded and built
- [ ] ✅ Domain DNS configured
- [ ] ✅ SSL certificate installed
- [ ] ✅ Firewall configured
- [ ] ✅ Website accessible via HTTPS
- [ ] ✅ Auto-renewal setup for SSL
- [ ] ✅ Monitoring tools configured

---

## 🆘 Support and Maintenance

### Regular Updates
```bash
# Update website (when you make changes)
cd /var/www/fvdrones
git pull origin main  # if using git
npm run build
sudo systemctl reload nginx
```

### Backup Strategy
```bash
# Create backup script
sudo nano /usr/local/bin/backup-website.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/fvdrones_$DATE.tar.gz /var/www/fvdrones
find /backup -name "fvdrones_*.tar.gz" -mtime +7 -delete

# Make executable
sudo chmod +x /usr/local/bin/backup-website.sh

# Add to crontab for daily backups
sudo crontab -e
0 2 * * * /usr/local/bin/backup-website.sh
```

---

## 📞 Emergency Contacts

- **Hostalia Support**: Check your Hostalia control panel for support contacts
- **Server Issues**: Monitor logs and system resources
- **Domain Issues**: Contact Hostalia domain support

---

## 🎉 Congratulations!

Your FV Drones website should now be live and accessible at:
- **HTTP**: `http://yourdomain.com` (redirects to HTTPS)
- **HTTPS**: `https://yourdomain.com` ✅

The website features:
- ✨ Animated drone GIFs with hover effects
- 🔒 SSL encryption
- 📱 Mobile responsive design
- ⚡ Optimized performance
- 🛡️ Security headers
- 🔄 Automatic SSL renewal

---

**Need Help?** 
- Check the troubleshooting section above
- Review server logs for specific error messages
- Contact Hostalia support for server-related issues
- Ensure all DNS changes have propagated (can take up to 48 hours)