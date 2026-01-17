# PHP Backend for GoDaddy cPanel

This is a PHP implementation of the Midway Mobile Storage backend API, designed to work with GoDaddy's shared hosting and cPanel.

## Features

- ✅ RESTful API endpoints matching the Node.js backend
- ✅ JWT authentication
- ✅ Rate limiting (session-based)
- ✅ Input sanitization and validation
- ✅ CORS support
- ✅ MySQL database integration
- ✅ Secure file handling

## Directory Structure

```
php-backend/
├── api/
│   ├── .htaccess           # URL rewriting rules
│   ├── auth/
│   │   └── login.php       # Authentication endpoint
│   ├── health.php          # Health check
│   ├── quotes.php          # Quote requests
│   ├── messages.php        # Contact messages
│   ├── applications.php    # Job applications
│   ├── orders.php          # PanelSeal orders
│   └── inventory.php       # Inventory management
├── config.php              # Configuration settings
├── database.php            # Database connection handler
├── utils.php               # Utility functions
└── README.md              # This file
```

## Installation on GoDaddy

### 1. Database Setup

1. Log into cPanel
2. Go to **MySQL® Databases**
3. Create a new database (e.g., `username_midway`)
4. Create a database user with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note your database credentials

### 2. Import Database Schema

1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Click **Import** tab
4. Upload `backend/schema.sql` from the Node.js backend directory
5. Execute the SQL to create tables

### 3. Upload PHP Backend Files

1. Go to **File Manager** in cPanel
2. Navigate to `public_html/api/` (create the `api` directory if needed)
3. Upload all files from `php-backend/` maintaining the directory structure:
   ```
   public_html/
   └── api/
       ├── .htaccess
       ├── auth/
       │   └── login.php
       ├── health.php
       ├── quotes.php
       ├── messages.php
       ├── applications.php
       ├── orders.php
       ├── inventory.php
       ├── config.php
       ├── database.php
       └── utils.php
   ```

### 4. Configure Database Connection

1. Edit `config.php` with your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_cpanel_username_dbuser');
   define('DB_PASS', 'your_database_password');
   define('DB_NAME', 'your_cpanel_username_midway');
   ```

2. Update CORS allowed origins:
   ```php
   define('ALLOWED_ORIGINS', [
       'https://yourdomain.com',
       'https://www.yourdomain.com'
   ]);
   ```

3. Generate a secure JWT secret:
   ```php
   define('JWT_SECRET', 'your-random-secret-key-here');
   ```

### 5. Set File Permissions

Using cPanel File Manager, set permissions:
- Directories: `755`
- PHP files: `644`
- `.htaccess`: `644`

### 6. Test the API

Visit: `https://yourdomain.com/api/health`

You should see:
```json
{"status":"ok","time":1234567890}
```

## API Endpoints

All endpoints are accessed via: `https://yourdomain.com/api/`

### Public Endpoints (No Authentication)

- `GET /api/health` - Health check
- `GET /api/csrf-token` - Get CSRF token for form submissions (rate limited)
- `POST /api/quotes` - Submit quote request (requires CSRF token)
- `POST /api/messages` - Submit contact message (requires CSRF token)
- `POST /api/applications` - Submit job application (requires CSRF token)
- `POST /api/orders` - Submit PanelSeal order (requires CSRF token)

### Protected Endpoints (Requires Authentication)

#### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/change-password` - Change password for authenticated user

#### Quotes
- `GET /api/quotes` - List all quotes
- `PUT /api/quotes` - Update quote status
- `DELETE /api/quotes/{id}` - Delete quote

#### Messages
- `GET /api/messages` - List all messages
- `PUT /api/messages` - Update message status
- `DELETE /api/messages/{id}` - Delete message

#### Applications
- `GET /api/applications` - List all applications
- `DELETE /api/applications/{id}` - Delete application

#### Orders
- `GET /api/orders` - List all orders
- `DELETE /api/orders/{id}` - Delete order
- `GET /api/inventory` - List all inventory (returns: id, type, condition, status, quantity, createdAt)
- `POST /api/inventory` - Create inventory item (requires: type, condition, status, quantity)
- `PUT /api/inventory/{id}` - Update inventory item (accepts: type, condition, status, quantity)
- `DELETE /api/inventory/{id}` - Delete inventory item

## Frontend Configuration

Use the Vite environment variable instead of hard-coding API_BASE:

```bash
VITE_API_BASE=https://yourdomain.com/api
```

For local dev, scripts/dev-frontend-start.sh will default VITE_API_BASE if it is not set.

## Default Login Credentials

⚠️ **Fallback Credentials (if admin_users table is empty):**
- **Username:** `admin`
- **Password:** `admin123`

**Important:** The `admin_users` table is created by `schema.sql`. To create a secure admin user:

1. Use the provided `create_admin.php` script:
   ```bash
   php create_admin.php
   ```
   
2. Or manually insert via phpMyAdmin:
   ```sql
   -- Generate password hash using PHP
   -- password_hash('your_password', PASSWORD_BCRYPT)
   
   INSERT INTO admin_users (username, password, email) 
   VALUES ('admin', '$2y$10$YOUR_BCRYPT_HASH_HERE', 'admin@yourdomain.com');
   ```

⚠️ **Change default credentials immediately after deployment!**

## Security Features

- **CSRF Protection:** All public POST endpoints require valid CSRF tokens
- **Rate Limiting:** 10 requests per 5 minutes per IP for public forms
- **Input Sanitization:** All user input is sanitized to prevent XSS
- **SQL Injection Protection:** All queries use prepared statements
- **JWT Authentication:** Secure token-based authentication (HS256, 2-hour expiration)
- **Password Security:** Bcrypt hashing with cost factor 12, minimum 8 characters
- **Password Change:** Secure password change requiring current password verification
- **CORS:** Configured to only allow requests from your domain
- **Security Headers:** 5 protective headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- **Secure Sessions:** HttpOnly, SameSite=Lax cookies for session management

## Password Management

### Changing Password (Admin Panel)

Admins can change their password through the "Account Security" module in the admin panel:

1. Navigate to **Account Security** (🔐) in the sidebar
2. Enter current password
3. Enter new password (minimum 8 characters)
4. Confirm new password
5. Click "Change Password"

**Password Requirements:**
- Minimum 8 characters
- Must be different from current password
- Recommended: Use uppercase, lowercase, numbers, and symbols for stronger security

**API Endpoint:**
```
POST /api/auth/change-password
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "currentPassword": "current_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response (Success):**
```json
{
  "ok": true,
  "message": "Password changed successfully"
}
```

**Response (Error):**
```json
{
  "error": "Current password is incorrect"
}
```

## Troubleshooting

### 500 Internal Server Error
- Check PHP error logs in cPanel
- Verify file permissions
- Ensure `.htaccess` syntax is correct
- Check if `mod_rewrite` is enabled (ask GoDaddy support)

### Database Connection Failed
- Verify database credentials in `config.php`
- Ensure database user has proper privileges
- Check if database exists

### CORS Errors
- Verify your domain is in `ALLOWED_ORIGINS` in `config.php`
- Check that frontend is using HTTPS if backend is on HTTPS

### 404 on API Endpoints
- Verify `.htaccess` file is in the `/api/` directory
- Check if URL rewriting is enabled on your hosting plan
- Contact GoDaddy support if needed

## PHP Requirements

- PHP 7.4 or higher
- PDO MySQL extension
- mod_rewrite enabled (for URL rewriting)
- Sessions enabled

GoDaddy shared hosting typically includes all these by default.

## Support

For issues specific to GoDaddy hosting, contact their support team. For application-specific questions, refer to the main project documentation.
