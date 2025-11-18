# GoDaddy cPanel Deployment Checklist

## Pre-Deployment

- [ ] Test all API endpoints locally
- [ ] Generate secure JWT secret key
- [ ] Create strong admin password
- [ ] Update CORS allowed origins with production domain
- [ ] Review and update rate limiting settings if needed

## Database Setup

- [ ] Login to GoDaddy cPanel
- [ ] Create MySQL database (MySQL® Databases)
- [ ] Create database user with strong password
- [ ] Grant ALL PRIVILEGES to user
- [ ] Note database name, username, password
- [ ] Import schema.sql via phpMyAdmin

## File Upload

- [ ] Access File Manager in cPanel
- [ ] Create `/public_html/api/` directory
- [ ] Upload all PHP backend files maintaining structure
- [ ] Upload `.htaccess` file to `/api/` directory
- [ ] Verify all files uploaded successfully

## Configuration

- [ ] Edit `config.php` with database credentials
- [ ] Update `DB_HOST` (usually 'localhost')
- [ ] Update `DB_USER` (cpanel_username_dbuser)
- [ ] Update `DB_PASS` (your database password)
- [ ] Update `DB_NAME` (cpanel_username_dbname)
- [ ] Update `ALLOWED_ORIGINS` with production URLs
- [ ] Generate and set secure `JWT_SECRET`
- [ ] Set `DEBUG_MODE` to `false` for production

## File Permissions

- [ ] Set directories to 755
- [ ] Set PHP files to 644
- [ ] Set `.htaccess` to 644
- [ ] Verify config.php is readable by PHP but not publicly accessible

## Testing

- [ ] Test health endpoint: `https://yourdomain.com/api/health`
- [ ] Test login: POST to `/api/auth/login`
- [ ] Test public form submission: POST to `/api/quotes`
- [ ] Test authenticated request: GET `/api/quotes` with token
- [ ] Verify CORS headers in browser console
- [ ] Check rate limiting works (submit form 11 times)

## Frontend Configuration

- [ ] Update frontend `config.js` with production API URL (all modules now import from config)
- [ ] Build production frontend: `npm run build`
- [ ] Upload frontend build to `/public_html/`
- [ ] Test all forms on live site
- [ ] Test admin panel login and functionality
- [ ] Verify all API requests go to correct backend

## Security

- [ ] Change default admin credentials immediately
- [ ] Verify config.php cannot be accessed via browser
- [ ] Check that error messages don't expose sensitive info
- [ ] Test that unauthorized requests return 401
- [ ] Verify SQL injection protection (try malicious input)
- [ ] Test XSS protection (try script injection)

## SSL/HTTPS

- [ ] Ensure SSL certificate is active on domain
- [ ] Force HTTPS redirect in cPanel or .htaccess
- [ ] Update all API URLs to use https://
- [ ] Test mixed content warnings

## Monitoring

- [ ] Set up email alerts for critical errors (optional)
- [ ] Check PHP error logs regularly
- [ ] Monitor database size and performance
- [ ] Test backup and restore procedures

## Post-Deployment

- [ ] Document all credentials securely
- [ ] Share API documentation with team
- [ ] Schedule regular backups
- [ ] Plan for updates and maintenance

## Rollback Plan

- [ ] Keep Node.js backend running as backup
- [ ] Document steps to revert to Node.js backend
- [ ] Keep backup of database before migration
- [ ] Test rollback procedure

## Contact Information

**GoDaddy Support:** 
- Phone: Available in cPanel
- Chat: Available in cPanel
- Hours: 24/7

**Common Issues:**
- mod_rewrite not enabled: Contact GoDaddy support
- PHP version: Update via cPanel > MultiPHP Manager
- Database connection: Verify credentials and user privileges
