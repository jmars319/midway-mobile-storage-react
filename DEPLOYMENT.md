# Midway Mobile Storage - Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Environment Configuration

#### Backend (.env)
```bash
# Production values
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=midway_storage
JWT_SECRET=9cfb38675743e7a35c57f0ed6c779a37b18be64ed9cae41fb40af7c69548deb0
PORT=5001
FRONTEND_URL=https://midwaymobilestorage.com
```

#### Frontend (.env)
```bash
VITE_API_BASE=https://api.midwaymobilestorage.com/api
```

### 2. Database Setup

Run the schema to create tables:
```bash
mysql -u your-user -p midway_storage < backend/schema.sql
```

### 3. SSL/HTTPS Configuration

#### Option A: nginx Reverse Proxy
```nginx
server {
    listen 443 ssl http2;
    server_name api.midwaymobilestorage.com;
    
    ssl_certificate /etc/letsencrypt/live/api.midwaymobilestorage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.midwaymobilestorage.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name midwaymobilestorage.com www.midwaymobilestorage.com;
    
    ssl_certificate /etc/letsencrypt/live/midwaymobilestorage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/midwaymobilestorage.com/privkey.pem;
    
    root /var/www/midway-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Option B: Let's Encrypt with Certbot
```bash
sudo certbot --nginx -d midwaymobilestorage.com -d www.midwaymobilestorage.com
sudo certbot --nginx -d api.midwaymobilestorage.com
```

### 4. Build Frontend for Production

```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to your web server.

### 5. Start Backend with PM2

```bash
cd backend
npm install -g pm2
pm2 start server.js --name midway-backend
pm2 startup  # Enable auto-restart on server reboot
pm2 save
```

### 6. Security Hardening

#### Replace Demo Admin Account
Currently using hardcoded credentials (admin/admin123). Before production:

1. Create a proper users table in MySQL:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. Add a real admin user:
```bash
# Generate password hash (Node.js)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_SECURE_PASSWORD', 10).then(hash => console.log(hash));"
```

3. Insert into database:
```sql
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', 'YOUR_GENERATED_HASH', 'admin');
```

4. Update `/api/auth/login` endpoint in `server.js` to query the database instead of using `DEMO_ADMIN_HASH`.

### 7. Monitoring & Logging

#### Option A: PM2 Logs
```bash
pm2 logs midway-backend
pm2 monit
```

#### Option B: External Service
- Sentry for error tracking: https://sentry.io
- LogRocket for session replay: https://logrocket.com
- Datadog for full monitoring: https://datadoghq.com

### 8. Backup Strategy

#### Database Backups
```bash
# Daily backup cron job
0 2 * * * mysqldump -u user -p'password' midway_storage > /backups/midway_$(date +\%Y\%m\%d).sql
```

#### Uploaded Files Backup
```bash
# Daily rsync of uploads directory
0 3 * * * rsync -av /path/to/backend/uploads/ /backups/uploads/
```

### 9. Final Security Checks

- [ ] JWT_SECRET is strong and random (64+ chars)
- [ ] Database credentials are secure
- [ ] `.env` files are NOT in git (check `.gitignore`)
- [ ] HTTPS is enforced (no HTTP access)
- [ ] CORS is configured for your domain only
- [ ] Rate limiting is enabled on login
- [ ] File upload limits are in place (10MB, images only)
- [ ] Admin credentials are NOT hardcoded
- [ ] Error messages don't expose sensitive info

### 10. Performance Optimization

#### Enable gzip compression in nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

#### Enable caching for static assets:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 11. Testing Production

Before going live:
1. Test all forms (quote, contact, careers)
2. Test admin login with new credentials
3. Test file uploads
4. Verify SSL certificate (https://www.ssllabs.com/ssltest/)
5. Test on mobile devices
6. Run Lighthouse audit (Chrome DevTools)

### 12. Go Live

1. Update DNS records to point to your server
2. Wait for DNS propagation (15 minutes - 48 hours)
3. Monitor logs for errors
4. Test all functionality again

---

## 📊 Current Application Status

✅ **Security:**
- Strong JWT secrets
- Rate limiting on login (5 attempts/15 min)
- CORS configured
- Helmet.js security headers
- File upload restrictions (10MB, images only)
- Path traversal protection
- Email validation
- Request size limits

✅ **Code Quality:**
- Error boundaries for React
- Graceful shutdown handlers
- Centralized configuration
- Production-ready logging (DEV only)
- Proper form labels and accessibility

✅ **SEO:**
- Dynamic meta tags
- Sitemap.xml
- Robots.txt
- Schema.org structured data
- Canonical URLs

⚠️ **Still TODO for Production:**
- Replace hardcoded admin credentials with database users
- Set up SSL/HTTPS
- Configure production environment variables
- Set up monitoring and alerting
- Implement backup strategy

---

## 🆘 Support & Troubleshooting

### Common Issues

**Backend won't start:**
- Check `.env` file exists and has correct values
- Verify MySQL is running and accessible
- Check port 5001 is not in use: `lsof -i :5001`

**Database connection fails:**
- Verify MySQL credentials in `.env`
- Check database exists: `mysql -u user -p -e "SHOW DATABASES;"`
- Ensure MySQL allows connections from your app server

**Frontend can't reach backend:**
- Verify `VITE_API_BASE` in frontend `.env`
- Check CORS configuration in backend
- Verify backend is running: `curl http://localhost:5001/api/health`

**File uploads fail:**
- Check `backend/uploads/` directory exists and is writable
- Verify file size is under 10MB
- Ensure file is an allowed image type (JPEG, PNG, GIF, WebP)

---

## 📝 Maintenance

### Regular Tasks
- **Weekly:** Review error logs
- **Monthly:** Update npm packages: `npm audit fix`
- **Quarterly:** Review and rotate JWT secret
- **As needed:** Database optimization: `OPTIMIZE TABLE quotes, messages, applications, inventory;`

---

For questions or issues, refer to the codebase documentation or contact the development team.
