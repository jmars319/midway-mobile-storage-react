# Security Documentation

## Security Measures Implemented

### Authentication & Authorization
- **JWT Tokens**: HS256 algorithm with signature verification
- **Token Expiration**: 2-hour sessions (configurable via `JWT_EXPIRATION`)
- **Algorithm Validation**: Enforces HS256 to prevent algorithm confusion attacks
- **Protected Endpoints**: All admin endpoints require valid Bearer token

### Input Validation & Sanitization
- **SQL Injection Protection**: All queries use prepared statements with parameter binding
- **XSS Protection**: `sanitizeInput()` strips tags and encodes HTML entities
- **Email Validation**: Uses PHP's `FILTER_VALIDATE_EMAIL`
- **Length Validation**: Enforced maximum lengths for all text inputs
- **Type Validation**: Quantity and numeric fields validated as integers

### Rate Limiting
- **IP-Based Limiting**: 10 requests per 5 minutes per IP address
- **Session-Based Tracking**: Prevents bypass via cookie deletion
- **Per-Endpoint Keys**: Separate limits for different form types
- **Automatic Reset**: Windows expire after configured time

### Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Browser XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Limits referrer leakage
- `Permissions-Policy` - Disables geolocation, microphone, camera

### CORS Configuration
- **Whitelist-Only**: Only configured origins allowed
- **Credentials Support**: `Access-Control-Allow-Credentials: true`
- **Method Restriction**: Only necessary HTTP methods allowed
- **Pre-flight Handling**: OPTIONS requests handled correctly

### File Security
- **Path Traversal Protection**: `basename()` and `realpath()` validation
- **Upload Directory Isolation**: Files served only from designated uploads folder
- **MIME Type Validation**: Content-Type headers set based on file extension

### Session Security
- **HttpOnly Cookies**: Prevents JavaScript access to session cookies
- **Secure Cookies**: HTTPS-only when available
- **Session Regeneration**: Recommended after authentication (implement manually)

## Known Security Considerations

### Environment-Specific Configuration Required

**CRITICAL**: Before deploying to production, set these environment variables:

```bash
# .env file (DO NOT commit to git)
JWT_SECRET=your-random-64-character-hex-string-here
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASS=your-secure-database-password
DB_NAME=your-database-name
```

Generate a secure JWT secret:
```bash
php -r "echo bin2hex(random_bytes(32)) . PHP_EOL;"
```

### Debug Mode

**WARNING**: Set `DEBUG_MODE = false` in production!

Debug mode enables:
- Fallback admin credentials (admin/admin123)
- Detailed error messages
- Database connection details in responses

### Admin Account Setup

1. Delete or secure `php-backend/create-admin.php` after initial setup
2. Create admin users in the `admin_users` table:
```sql
INSERT INTO admin_users (username, password, email) 
VALUES ('admin', PASSWORD_HASH, 'admin@example.com');
```

Generate password hash:
```php
php -r "echo password_hash('your-password', PASSWORD_BCRYPT) . PHP_EOL;"
```

### Database Security

Current implementation uses hardcoded credentials in `config.php`. For production:

```php
define('DB_HOST', getenv('DB_HOST') ?: die('DB_HOST required'));
define('DB_USER', getenv('DB_USER') ?: die('DB_USER required'));
define('DB_PASS', getenv('DB_PASS') ?: die('DB_PASS required'));
define('DB_NAME', getenv('DB_NAME') ?: die('DB_NAME required'));
```

### Additional Recommendations

1. **HTTPS**: Always use HTTPS in production
2. **Database Backups**: Implement regular automated backups
3. **Access Logs**: Monitor `error_log` for suspicious activity
4. **Token Revocation**: Consider implementing a token blacklist for logout
5. **Password Policy**: Enforce strong passwords for admin users
6. **2FA**: Consider adding two-factor authentication for admin panel
7. **CSP Headers**: Add Content-Security-Policy for additional XSS protection
8. **Dependency Updates**: Keep PHP and all dependencies up to date

## Security Audit Results

Last audit: November 21, 2025

### Fixed Issues
- ✅ Rate limiting bypass vulnerability
- ✅ Missing security headers
- ✅ JWT algorithm validation
- ✅ Path traversal protection
- ✅ Reduced token expiration (12h → 2h)
- ✅ Debug-only admin fallback
- ✅ Environment variable support for JWT secret

### Remaining Recommendations
- ⚠️ Implement CSRF protection for state-changing operations
- ⚠️ Add token revocation/blacklist mechanism
- ⚠️ Move database credentials to environment variables
- ⚠️ Add password strength requirements
- ⚠️ Implement audit logging for admin actions
- ⚠️ Add database indexes for performance
- ⚠️ Set up automated security scans

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourdomain.com instead of using the public issue tracker.

## License

This security documentation is provided as-is for the Midway Mobile Storage application.
