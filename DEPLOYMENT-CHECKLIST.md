# Deployment Checklist - Midway Mobile Storage

**Last Updated:** November 13, 2025  
**Frontend Host:** GoDaddy  
**Backend Host:** Railway

This checklist will guide you through deploying your website step-by-step. Follow each section in order and check off items as you complete them.

---

## Table of Contents
1. [Pre-Deployment Preparation](#1-pre-deployment-preparation)
2. [Database Setup](#2-database-setup)
3. [Backend Deployment (Railway)](#3-backend-deployment-railway)
4. [Frontend Build & Deployment (GoDaddy)](#4-frontend-build--deployment-godaddy)
5. [Post-Deployment Testing](#5-post-deployment-testing)
6. [Final Security Checks](#6-final-security-checks)
7. [Ongoing Maintenance](#7-ongoing-maintenance)

---

## 1. Pre-Deployment Preparation

### 1.1 Code Review & Testing
- [ ] Run the development server locally and test all features
- [ ] Test quote submission form
- [ ] Test contact form
- [ ] Test career application form
- [ ] Test PanelSeal order form
- [ ] Test admin login with credentials: `admin` / `password123`
- [ ] Verify all images load correctly
- [ ] Test on mobile devices (responsive design)

### 1.2 Gather Required Information
- [ ] Your GoDaddy account login credentials
- [ ] Your custom domain name (e.g., `midwaystorage.com`)
- [ ] A Railway account (sign up at https://railway.app if needed)
- [ ] A MySQL database provider account (Railway offers MySQL, or use PlanetScale/AWS RDS)

### 1.3 Create Production Environment Variables Document
Create a secure document (NOT in your code repository) with these values. You'll need them later:

```
PRODUCTION CREDENTIALS (KEEP SECURE!)
====================================

Database:
- DB_HOST: [will get from Railway]
- DB_USER: [will get from Railway]
- DB_PASSWORD: [will get from Railway]
- DB_NAME: midway_storage
- DB_PORT: 3306

Backend:
- JWT_SECRET: [keep the one from backend/.env]
- FRONTEND_URL: https://yourdomain.com
- PORT: 5001

Frontend:
- VITE_API_BASE: https://your-railway-backend.up.railway.app/api
```

---

## 2. Database Setup

### 2.1 Choose Database Option

**Option A: Railway MySQL (Recommended for beginners)**
- [ ] Log into Railway (https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Provision MySQL" from the templates
- [ ] Wait for MySQL service to deploy (2-3 minutes)
- [ ] Click on the MySQL service
- [ ] Go to "Variables" tab
- [ ] Copy these values to your secure document:
  - `MYSQL_HOST`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE`
  - `MYSQL_PORT`

**Option B: PlanetScale (Free tier available)**
- [ ] Sign up at https://planetscale.com
- [ ] Create a new database named `midway_storage`
- [ ] Create a new password
- [ ] Copy connection credentials to your secure document

### 2.2 Initialize Database Schema
- [ ] Download a MySQL client (TablePlus, MySQL Workbench, or use Railway's built-in Data tab)
- [ ] Connect to your database using the credentials from step 2.1
- [ ] Run the following SQL to create tables:

```sql
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(255) UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  service VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  position VARCHAR(255),
  resume VARCHAR(500),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100),
  size VARCHAR(100),
  status VARCHAR(50),
  location VARCHAR(255),
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  product VARCHAR(255),
  quantity VARCHAR(50),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] Verify all 6 tables were created successfully
- [ ] Test database connection by running: `SELECT * FROM site_settings;`

---

## 3. Backend Deployment (Railway)

### 3.1 Prepare Backend Code
- [ ] Open your terminal/command prompt
- [ ] Navigate to your project: `cd /path/to/midway-mobile-storage-react`
- [ ] Make sure all changes are committed to git:
  ```bash
  git add .
  git commit -m "Prepare for production deployment"
  git push origin main
  ```

### 3.2 Deploy Backend to Railway

#### Create Railway Project
- [ ] Go to https://railway.app
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Connect your GitHub account if not already connected
- [ ] Select the `midway-mobile-storage-react` repository
- [ ] Railway will detect the project - you may need to specify the root directory

#### Configure Backend Service
- [ ] After deployment starts, click on the service
- [ ] Go to "Settings" tab
- [ ] Set **Root Directory** to `backend`
- [ ] Set **Start Command** to `node server.js`
- [ ] Set **Watch Paths** to `backend/**`

#### Add Environment Variables
- [ ] Go to "Variables" tab
- [ ] Click "Add Variable" and add each of these:

```
NODE_ENV=production
PORT=5001
DB_HOST=[your MySQL host from step 2.1]
DB_USER=[your MySQL user from step 2.1]
DB_PASSWORD=[your MySQL password from step 2.1]
DB_NAME=midway_storage
DB_PORT=3306
JWT_SECRET=[copy from backend/.env - keep it secret!]
FRONTEND_URL=https://yourdomain.com
```

**Important:** Replace `yourdomain.com` with your actual GoDaddy domain!

#### Enable Public Networking
- [ ] Go to "Settings" tab
- [ ] Scroll to "Networking"
- [ ] Click "Generate Domain" 
- [ ] Copy the generated URL (e.g., `your-app-name.up.railway.app`)
- [ ] Save this URL - this is your `RAILWAY_BACKEND_URL`
- [ ] Test the backend by visiting: `https://your-app-name.up.railway.app/api/public/settings`
- [ ] You should see JSON response (may be empty, that's OK)

### 3.3 Verify Backend Deployment
- [ ] Check "Deployments" tab - status should be "Active" with green checkmark
- [ ] Check "Logs" tab - should see: `Midway backend listening on port 5001`
- [ ] No error messages in logs
- [ ] Test API endpoint: `https://your-railway-url.up.railway.app/api/public/settings`

---

## 4. Frontend Build & Deployment (GoDaddy)

### 4.1 Configure Frontend for Production
- [ ] Open `frontend/.env` file in your text editor
- [ ] Update the API URL to point to your Railway backend:
  ```
  VITE_API_BASE=https://your-railway-url.up.railway.app/api
  ```
- [ ] **Important:** Replace `your-railway-url.up.railway.app` with the actual Railway domain from step 3.2
- [ ] Save the file

### 4.2 Build Frontend
- [ ] Open terminal/command prompt
- [ ] Navigate to frontend directory:
  ```bash
  cd frontend
  ```
- [ ] Install dependencies (if not already):
  ```bash
  npm install
  ```
- [ ] Build the production version:
  ```bash
  npm run build
  ```
- [ ] Wait for build to complete (1-2 minutes)
- [ ] Verify `frontend/dist` folder was created
- [ ] Check that `dist` folder contains: `index.html`, `assets` folder

### 4.3 Upload to GoDaddy

#### Access GoDaddy File Manager
- [ ] Log into your GoDaddy account
- [ ] Go to "My Products"
- [ ] Find your Web Hosting plan
- [ ] Click "Manage" next to your hosting plan
- [ ] In cPanel, find and click "File Manager"

#### Upload Files
- [ ] In File Manager, navigate to `public_html` folder (or your domain's root folder)
- [ ] **IMPORTANT:** Delete or backup any existing files in this folder
- [ ] Click "Upload" button
- [ ] Select ALL files from your `frontend/dist` folder:
  - `index.html`
  - `assets` folder (entire folder)
  - Any other files in `dist`
- [ ] Wait for upload to complete
- [ ] Verify all files are uploaded

#### Configure .htaccess for React Router (CRITICAL!)
GoDaddy needs special configuration for single-page apps:

- [ ] In File Manager, create a new file named `.htaccess` in `public_html`
- [ ] Add this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable HTTPS redirect (if you have SSL)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

- [ ] Save the `.htaccess` file
- [ ] Verify `.htaccess` is visible in File Manager (enable "Show Hidden Files" if needed)

### 4.4 Configure Domain SSL Certificate (HTTPS)
- [ ] In GoDaddy control panel, go to "SSL Certificates"
- [ ] If you don't have SSL, purchase one OR use GoDaddy's free SSL
- [ ] Install SSL certificate on your domain
- [ ] Wait 10-15 minutes for SSL to activate
- [ ] After activation, uncomment the HTTPS redirect lines in `.htaccess` (remove the `#`)
- [ ] Force HTTPS for all traffic

---

## 5. Post-Deployment Testing

### 5.1 Basic Functionality Tests
- [ ] Visit your domain: `https://yourdomain.com`
- [ ] Page loads without errors
- [ ] Logo and hero image display correctly
- [ ] Navigation menu works
- [ ] All sections visible (Services, About, Products, etc.)

### 5.2 Form Submission Tests
- [ ] **Quote Form:** Submit a test quote
  - [ ] Fill out form completely
  - [ ] Click "Submit Quote"
  - [ ] Should see success message
  - [ ] Check Railway backend logs to verify data received
  
- [ ] **Contact Form:** Submit test message
  - [ ] Click "Contact Us" button
  - [ ] Fill out form
  - [ ] Submit
  - [ ] Verify success message

- [ ] **Career Application:** Submit test application
  - [ ] Scroll to Careers section
  - [ ] Fill out application
  - [ ] Submit
  - [ ] Verify success message

- [ ] **PanelSeal Order:** Submit test order
  - [ ] Navigate to Products section
  - [ ] Click "Order PanelSeal"
  - [ ] Fill out form
  - [ ] Submit
  - [ ] Verify success message

### 5.3 Admin Panel Tests
- [ ] Navigate to: `https://yourdomain.com/#admin` OR scroll to footer and click "Admin Login"
- [ ] Login with: `admin` / `password123`
- [ ] Dashboard loads with statistics
- [ ] Check "Quotes" module - your test quote should appear
- [ ] Check "Messages" module - your test message should appear
- [ ] Check "Applications" module - your test application should appear
- [ ] Check "Orders" module - your test order should appear
- [ ] Try uploading an image in "Settings" module
- [ ] Logout works correctly

### 5.4 Mobile Responsiveness
- [ ] Test on actual mobile device OR use browser dev tools
- [ ] Open `https://yourdomain.com` on phone
- [ ] Mobile menu works (hamburger icon)
- [ ] Forms are usable on mobile
- [ ] All sections display properly
- [ ] Images scale correctly

### 5.5 Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)

### 5.6 Performance Check
- [ ] Run Google PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Enter your domain
- [ ] Verify score is above 70 (aim for 90+)
- [ ] Fix any critical issues identified

---

## 6. Final Security Checks

### 6.1 Environment Variables
- [ ] Confirm `backend/.env` is NOT uploaded to GitHub
- [ ] Confirm `.env` files are in `.gitignore`
- [ ] Railway environment variables are set correctly
- [ ] `FRONTEND_URL` in Railway matches your actual domain

### 6.2 Database Security
- [ ] Database is not publicly accessible without credentials
- [ ] Strong password is set for database user
- [ ] Only Railway backend can access the database
- [ ] Regular backups are configured (see section 7.3)

### 6.3 API Security
- [ ] Test CORS by trying to access API from different domain (should fail)
- [ ] Verify rate limiting on login endpoint:
  - [ ] Try logging in 6 times with wrong password
  - [ ] Should be blocked after 5 attempts
- [ ] Admin endpoints require authentication:
  - [ ] Try accessing `https://your-railway-url.up.railway.app/api/quotes` without token
  - [ ] Should return 401 Unauthorized

### 6.4 SSL/HTTPS
- [ ] All pages load via HTTPS (padlock icon in browser)
- [ ] HTTP automatically redirects to HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate is valid (click padlock, check certificate)

### 6.5 Change Default Admin Password
**CRITICAL - DO THIS NOW:**
- [ ] Log into admin panel
- [ ] Currently, password is `password123` (anyone can guess this!)
- [ ] **TO DO:** You need to implement a password change feature OR update the hash in `backend/server.js`
  
**Temporary Solution (until you build password change feature):**
1. Generate a new password hash:
   ```bash
   cd backend
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_NEW_SECURE_PASSWORD', 10, (e,h) => console.log(h))"
   ```
2. Copy the output hash
3. In Railway, update the environment variable or edit `backend/server.js` line 354
4. Replace the hash with your new hash
5. Redeploy backend
6. Test login with new password

---

## 7. Ongoing Maintenance

### 7.1 Monitor Application Health
- [ ] **Railway Dashboard:** Check daily for errors
  - Go to Railway → Your Project → Logs
  - Look for error messages
  
- [ ] **Check Website:** Visit `https://yourdomain.com` daily
  - Verify site loads
  - Test one form submission per week

- [ ] **Email Alerts:** Set up Railway notifications
  - Go to Project Settings
  - Enable "Email Notifications"
  - Get alerts when deployment fails

### 7.2 Regular Updates
- [ ] **Monthly:** Check for security updates
  ```bash
  cd backend
  npm audit
  npm update
  
  cd ../frontend
  npm audit
  npm update
  ```

- [ ] **After Updates:** Rebuild and redeploy
  - Backend: Railway auto-deploys on git push
  - Frontend: Run `npm run build` and re-upload to GoDaddy

### 7.3 Backup Strategy

#### Database Backups
- [ ] **Railway MySQL:** Enable automatic backups in Railway dashboard
- [ ] **Manual Backup (Weekly):**
  1. Connect to database with MySQL Workbench
  2. Go to Server → Data Export
  3. Select all tables
  4. Export to local file
  5. Save backup to secure location (Google Drive, Dropbox)

#### File Backups
- [ ] **Code:** Keep git repository up to date (backup on GitHub)
- [ ] **Media Files:** Download `backend/uploads` folder monthly
- [ ] **GoDaddy Files:** Use File Manager to download entire `public_html` folder monthly

### 7.4 Log Review
- [ ] **Weekly:** Check Railway logs for errors
  - Look for 500 errors
  - Look for failed database queries
  - Look for suspicious activity (multiple failed logins)

- [ ] **Monthly:** Review all submissions
  - Check for spam in quotes/messages
  - Review application submissions
  - Archive old data if needed

### 7.5 Performance Monitoring
- [ ] **Monthly:** Run PageSpeed Insights
- [ ] **Quarterly:** Review Railway usage metrics
  - Check if you're approaching plan limits
  - Consider upgrading if needed

---

## 8. Troubleshooting Common Issues

### Issue: "Unable to connect to backend"
- [ ] Check Railway deployment status (should be green)
- [ ] Verify Railway URL in `frontend/.env` is correct
- [ ] Check Railway logs for errors
- [ ] Verify CORS settings allow your domain

### Issue: "Database connection failed"
- [ ] Check Railway variables for database credentials
- [ ] Test database connection with MySQL client
- [ ] Verify database is running on Railway
- [ ] Check if database has hit connection limits

### Issue: "404 error when refreshing page"
- [ ] Verify `.htaccess` file exists in `public_html`
- [ ] Verify `.htaccess` has correct rewrite rules
- [ ] Check GoDaddy has `mod_rewrite` enabled

### Issue: "Images not loading"
- [ ] Check browser console for errors
- [ ] Verify image files are uploaded to GoDaddy
- [ ] Check file paths are correct
- [ ] Verify Railway backend can serve images from `/uploads`

### Issue: "Admin login not working"
- [ ] Verify Railway backend is running
- [ ] Check rate limiting (wait 15 minutes if blocked)
- [ ] Verify credentials: `admin` / `password123`
- [ ] Check Railway logs for authentication errors

### Issue: "Forms not submitting"
- [ ] Open browser console (F12)
- [ ] Look for CORS errors
- [ ] Verify `FRONTEND_URL` in Railway matches your domain EXACTLY
- [ ] Check Railway logs to see if request reached backend

---

## 9. Emergency Contacts & Resources

### Support Resources
- **GoDaddy Support:** 1-480-505-8877 or live chat in control panel
- **Railway Support:** https://railway.app/help or Discord community
- **This Project's Documentation:** See `DEPLOYMENT.md` for technical details

### Useful Links
- **GoDaddy Control Panel:** https://www.godaddy.com/
- **Railway Dashboard:** https://railway.app/dashboard
- **Your Backend URL:** `https://your-railway-url.up.railway.app`
- **Your Website:** `https://yourdomain.com`

### Developer Resources (if you need help)
- **React Documentation:** https://react.dev
- **Express.js Documentation:** https://expressjs.com
- **MySQL Documentation:** https://dev.mysql.com/doc/

---

## 10. Pre-Launch Final Checklist

**Before announcing your website publicly, verify:**

- [ ] ✅ All forms work and data saves to database
- [ ] ✅ Admin panel accessible and functional
- [ ] ✅ SSL certificate installed and HTTPS working
- [ ] ✅ Admin password changed from default
- [ ] ✅ Database backups configured
- [ ] ✅ Contact information updated (email, phone, address)
- [ ] ✅ Privacy policy and terms of service reviewed
- [ ] ✅ Google Analytics or similar tracking installed (optional)
- [ ] ✅ Site tested on mobile devices
- [ ] ✅ Site tested in multiple browsers
- [ ] ✅ All placeholder content replaced with real content
- [ ] ✅ Logo and images are high quality
- [ ] ✅ Railway billing set up (if using paid plan)
- [ ] ✅ Domain name points to GoDaddy hosting
- [ ] ✅ Email forwarding set up (if using domain email)

---

## Congratulations! 🎉

Your website is now live! Here's what you've accomplished:

✅ Deployed a secure React frontend on GoDaddy  
✅ Deployed a Node.js backend on Railway  
✅ Connected to a production MySQL database  
✅ Configured SSL/HTTPS for security  
✅ Set up an admin panel for managing content  
✅ Implemented form submissions and data collection  

**Next Steps:**
1. Share your website with friends and family for feedback
2. Set up Google My Business listing
3. Consider SEO optimization
4. Add Google Analytics to track visitors
5. Create a Facebook/Instagram page and link to your site

**Remember:** Check your Railway logs and GoDaddy File Manager regularly. Keep this checklist handy for future reference!

---

*Need help? Review the DEPLOYMENT.md file for more technical details, or contact a developer for assistance.*
