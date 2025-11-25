# Deployment Guide

**Complete step-by-step guide to deploy Midway Mobile Storage to GoDaddy cPanel with Cloudflare SSL**

**IMPORTANT NOTES ABOUT THIS GUIDE:**
- When you see text in `backticks` like `localhost` - type it EXACTLY as shown WITHOUT the backticks
- When you see `YOUR_VALUE_HERE` - replace the ENTIRE thing including underscores with your actual value
- Example: `DB_USER` might say `midway_user` - you type: midway_user (no backticks, no DB_USER)
- Commands in gray boxes are meant to be copied and pasted into terminal or code editor
- ⚠️ means pay special attention - this step is critical
- ✅ means verification step - confirms the previous step worked

---

## Prerequisites

**What you need before starting:**
- Active GoDaddy hosting account with cPanel access
- Domain (midwaymobilestorage.com) pointed to GoDaddy hosting
- Cloudflare account (free tier is fine)
- MySQL database access (included with GoDaddy hosting)
- Your local project files ready

---

## Part 1: Prepare Files on Your Computer (LOCAL)

### Step 1.1: Generate JWT Secret

**WHERE**: On your Mac/computer, open Terminal app

**WHAT**: Generate a random secret key for authentication

```bash
openssl rand -hex 32
```

**EXAMPLE OUTPUT** (yours will be different):
```
3f8a2c9e1b4d7f6a8c0e2b5d9f1a3c8e7b0d4f6a9c1e3b5d8f0a2c4e6b8d0f2a4
```

**ACTION**: Copy this entire string. You'll paste it in Step 1.3

⚠️ **DO NOT USE THE EXAMPLE ABOVE** - use YOUR generated string

---

### Step 1.2: Build Frontend for Production

**WHERE**: On your Mac/computer, in Terminal

**WHAT**: Create optimized production files

1. Navigate to frontend folder:
```bash
cd /Users/jason_marshall/Documents/Website\ Projects/Current/midway-mobile-storage-react/frontend
```

2. Update API configuration:
   - Open file: `frontend/src/config.js` in VS Code or text editor
   - Find this line:
   ```javascript
   export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
   ```
   - Change it to (delete the old line, type this new line):
   ```javascript
   export const API_BASE = 'https://midwaymobilestorage.com/api'
   ```
   - **Note**: Type the URL exactly - no backticks, no quotes around https
   - Save the file (Cmd+S on Mac)

3. Build production files:
```bash
npm run build
```

⏳ **WAIT** for build to complete (10-30 seconds)

✅ **YOU SHOULD SEE**: Message saying "build completed" or similar
✅ **YOU SHOULD SEE**: New folder created: `frontend/dist/`

❌ **IF YOU SEE** errors about "module not found":
```bash
npm install
npm run build
```

---

### Step 1.3: Update Backend Configuration

**WHERE**: On your computer, in VS Code or text editor

**WHAT**: Set production database and security settings

**⚠️ CRITICAL**: You'll need database credentials from Step 2 first. **STOP HERE** and complete Step 2.1-2.5 to get your database name, username, and password. Then come back here.

1. Open file: `php-backend/config.php`

2. Find these lines and update them (around lines 8-11):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'midway');
define('DB_PASS', 'midway2025');
define('DB_NAME', 'midway_storage');
```

Change to (using YOUR values from Step 2):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'YOUR_ACTUAL_CPANEL_DB_USERNAME');
define('DB_PASS', 'YOUR_ACTUAL_DATABASE_PASSWORD');
define('DB_NAME', 'YOUR_ACTUAL_CPANEL_DB_NAME');
```

**EXAMPLE** (yours will be different):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'midwaymo_dbuser');
define('DB_PASS', 'Xk9$mP2nQ7!zR');
define('DB_NAME', 'midwaymo_storage');
```

⚠️ **DO NOT** type the words YOUR_ACTUAL - replace the entire phrase with your real value
⚠️ **DO NOT** include backticks or quotes beyond what's already there

3. Find this line (around line 14):
```php
define('JWT_SECRET', getenv('JWT_SECRET') ?: '9cfb38675743e7a35c57f0ed6c779a37b18be64ed9cae41fb40af7c69548deb0');
```

Change to (paste YOUR generated secret from Step 1.1):
```php
define('JWT_SECRET', 'YOUR_64_CHARACTER_HEX_STRING_FROM_STEP_1_1');
```

4. Find this section (around lines 20-25):
```php
define('ALLOWED_ORIGINS', [
    'https://midwaymobilestorage.com',
    'https://www.midwaymobilestorage.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'  // Vite dev server
]);
```

Change to (remove localhost lines):
```php
define('ALLOWED_ORIGINS', [
    'https://midwaymobilestorage.com',
    'https://www.midwaymobilestorage.com'
]);
```

5. Verify DEBUG_MODE is false (around line 38):
```php
define('DEBUG_MODE', false);
```
✅ **SHOULD ALREADY SAY false** - if it says true, change to false

6. Save the file (Cmd+S)

---

### Step 1.4: Export Development Database

**WHERE**: On your Mac/computer, in Terminal

**WHAT**: Save all your current data (quotes, settings, admin account, etc.)

```bash
cd /Users/jason_marshall/Documents/Website\ Projects/Current/midway-mobile-storage-react/php-backend
mysqldump -u midway -p midway_storage > production-export.sql
```

**WHEN PROMPTED**: Type password: midway2025 and press Enter

⏳ **WAIT** 2-5 seconds

✅ **YOU SHOULD SEE**: File `production-export.sql` created in `php-backend/` folder
✅ **CHECK**: File size should be at least 10 KB (right-click file → Get Info)

❌ **IF COMMAND FAILS** with "command not found":
- You need to install MySQL on your Mac first
- Or skip this step and use fresh database (see Alternative in Step 3)

---

## Part 2: Setup Database (CPANEL)

### Step 2.1: Login to cPanel

**WHERE**: Web browser

1. Go to: `https://midwaymobilestorage.com/cpanel`
   - Or use GoDaddy's "cPanel Admin" button in hosting dashboard
2. Enter your cPanel username and password
3. Click "Log in"

✅ **YOU SHOULD SEE**: cPanel dashboard with lots of icons

---

### Step 2.2: Open MySQL Database Wizard

**WHERE**: In cPanel (web browser)

1. In the search box at top, type: MySQL
2. Click on: "MySQL® Database Wizard"

✅ **YOU SHOULD SEE**: Page titled "MySQL® Database Wizard - Step 1"

---

### Step 2.3: Create Database

**WHERE**: Still in MySQL Database Wizard page

1. Under "New Database:", type: midway_storage
   - ⚠️ Type ONLY: midway_storage (no spaces, no quotes)
   - System will add prefix automatically (example: midwaymo_midway_storage)

2. Click button: "Next Step"

✅ **YOU SHOULD SEE**: Message like "Added the database midwaymo_midway_storage"
✅ **YOU SHOULD SEE**: Step 2 of wizard (Create Database Users)

**📝 WRITE DOWN**: Your full database name will be shown (example: midwaymo_midway_storage)
- This is YOUR_ACTUAL_CPANEL_DB_NAME for Step 1.3

---

### Step 2.4: Create Database User

**WHERE**: Still on Step 2 of MySQL Database Wizard

1. Under "Username:", type: midway_user
   - ⚠️ Type ONLY: midway_user (no spaces, no quotes)
   - System will add prefix automatically (example: midwaymo_midway_user)

2. Under "Password:", click "Password Generator" button
   - ✅ **YOU SHOULD SEE**: Popup with generated password
   - Click "Copy Password" button
   - 📝 **PASTE** password into a note/document - YOU NEED THIS
   - Click "Use Password" button
   - ⚠️ **DO NOT CLOSE THIS PAGE** until you've saved the password

3. Click button: "Create User"

✅ **YOU SHOULD SEE**: Message like "Added user midwaymo_midway_user"
✅ **YOU SHOULD SEE**: Step 3 of wizard (Add User to Database)

**📝 WRITE DOWN** these three values (you need them for Step 1.3):
- DB_NAME: midwaymo_midway_storage (or whatever yours shows)
- DB_USER: midwaymo_midway_user (or whatever yours shows)
- DB_PASS: (the password you just copied)

---

### Step 2.5: Grant Privileges

**WHERE**: Still on Step 3 of MySQL Database Wizard

1. Check the box: "ALL PRIVILEGES"
   - It's the first checkbox at the top

2. Click button: "Next Step"

✅ **YOU SHOULD SEE**: Green success message
✅ **YOU SHOULD SEE**: Message like "User midwaymo_midway_user was added to database midwaymo_midway_storage"

3. Click: "Return to Home" or just close this tab

⚠️ **NOW GO BACK** to Step 1.3 if you haven't done it yet - update config.php with these values

---

## Part 3: Import Database (CPANEL)

### Step 3.1: Open phpMyAdmin

**WHERE**: In cPanel (web browser)

1. In cPanel search box, type: phpMyAdmin
2. Click: "phpMyAdmin"
3. ✅ **YOU SHOULD SEE**: New tab opens with phpMyAdmin interface

---

### Step 3.2: Select Your Database

**WHERE**: In phpMyAdmin tab

1. **LOOK AT**: Left sidebar - you'll see a list of databases
2. **CLICK ON**: Your database name (example: midwaymo_midway_storage)
   - The name should match what you wrote down in Step 2.3

✅ **YOU SHOULD SEE**: Main area shows "No tables found in database" (this is normal)

---

### Step 3.3: Import Database File

**WHERE**: Still in phpMyAdmin

1. **CLICK**: "Import" tab at the top

2. **CLICK**: "Choose File" button (or "Browse..." button)

3. **NAVIGATE TO**: Your computer → Documents → Website Projects → Current → midway-mobile-storage-react → php-backend

4. **SELECT**: File named: production-export.sql

5. **CLICK**: "Open" button

6. **LEAVE** all other settings unchanged (don't touch any dropdowns or checkboxes)

7. **SCROLL** to bottom of page

8. **CLICK**: "Import" button (or "Go" button - same thing)

⏳ **WAIT** 10-60 seconds - DO NOT CLOSE PAGE

✅ **YOU SHOULD SEE**: Green message "Import has been successfully finished"
✅ **YOU SHOULD SEE**: Details like "7 queries executed"

❌ **IF YOU SEE** red error about file size:
```bash
# On YOUR COMPUTER terminal, compress the file:
cd /Users/jason_marshall/Documents/Website\ Projects/Current/midway-mobile-storage-react/php-backend
gzip production-export.sql
```
- This creates: production-export.sql.gz
- In phpMyAdmin, choose the .gz file instead (phpMyAdmin supports .gz)

---

### Step 3.4: Verify Import Success

**WHERE**: Still in phpMyAdmin

1. **CLICK**: Your database name in left sidebar again

2. **YOU SHOULD NOW SEE**: 7 tables listed in left sidebar:
   - admin_users
   - inventory  
   - job_applications
   - messages
   - panelseal_orders
   - quotes
   - site_settings

3. **CLICK**: "admin_users" table

4. **CLICK**: "Browse" tab at top

5. **YOU SHOULD SEE**: At least one row with username "admin"

✅ **SUCCESS**: Your database is ready with all your data

❌ **IF NO TABLES APPEAR**:
- Import failed - check for red error messages
- May need to increase upload size limit (see Troubleshooting)

---

### Step 3.5: Alternative - Fresh Database (OPTIONAL)

**ONLY DO THIS IF YOU WANT EMPTY TABLES WITHOUT YOUR DATA**

If you prefer to start fresh without importing existing data:

1. In phpMyAdmin, click "Import" tab
2. Choose file: `php-backend/schema.sql` instead of production-export.sql
3. Click "Import" button
4. After import, click "admin_users" table
5. Click "Insert" tab
6. Fill in:
   - username: admin
   - password_hash: `$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5d5J7aN0lbKe6`
     (this is bcrypt hash for password: admin123)
7. Click "Go" button

⚠️ You'll need to re-enter all business info in admin panel after deployment

---

## Part 4: Upload Files (CPANEL)

### Step 4.1: Open File Manager

**WHERE**: In cPanel (web browser)

1. In cPanel search box, type: File Manager
2. Click: "File Manager"
3. ✅ **YOU SHOULD SEE**: File browser interface opens

---

### Step 4.2: Navigate to Web Root

**WHERE**: In File Manager

1. **LOOK AT**: Left sidebar folder tree
2. **DOUBLE-CLICK**: Folder named "public_html"
   - This is your website root folder - everything goes here

✅ **YOU SHOULD SEE**: "public_html" in the breadcrumb path at top

---

### Step 4.3: Clear Existing Files (OPTIONAL)

**WHERE**: Still in File Manager → public_html

⚠️ **ONLY DO THIS IF** there are old website files you want to remove

1. **SELECT ALL** files/folders in public_html (except .htaccess if it exists)
   - Click first item, then Shift+Click last item
   - Or use checkbox in table header to select all

2. **CLICK**: "Delete" button in toolbar
3. **CONFIRM**: Click "Delete File(s)" in popup

---

### Step 4.4: Upload Frontend Files

**WHERE**: Still in File Manager → public_html

1. **CLICK**: "Upload" button in top toolbar

2. **YOU SHOULD SEE**: Upload page opens

3. **ON YOUR COMPUTER**: Open Finder
   - Navigate to: Documents → Website Projects → Current → midway-mobile-storage-react → frontend → dist
   - ✅ **YOU SHOULD SEE**: Files like index.html, assets folder, favicons folder

4. **DRAG AND DROP** (or click "Select File"):
   - Drag ALL files from your dist/ folder
   - OR click "Select File", navigate to dist/, select all, click "Open"

5. **FILES TO UPLOAD** (check you have all of these):
   - index.html
   - assets/ (folder with JavaScript and CSS files)
   - robots.txt
   - sitemap.xml
   - favicons/ (folder with icon files)

⏳ **WAIT** for upload to complete - progress bar shows at bottom

✅ **YOU SHOULD SEE**: All files listed in public_html

6. **CLICK**: "Go Back to..." link to return to File Manager

---

### Step 4.5: Create API Folder

**WHERE**: In File Manager → public_html

1. **CLICK**: "+ Folder" button in toolbar (or "New Folder")

2. **TYPE**: api (lowercase, no spaces)

3. **CLICK**: "Create New Folder" button

4. **DOUBLE-CLICK**: The new "api" folder to enter it

✅ **YOU SHOULD SEE**: "public_html/api" in breadcrumb at top
✅ **YOU SHOULD SEE**: Empty folder (no files yet)

---

### Step 4.6: Upload Backend Root Files

**WHERE**: In File Manager → public_html/api

1. **CLICK**: "Upload" button

2. **ON YOUR COMPUTER**: Navigate to:
   - Documents → Website Projects → Current → midway-mobile-storage-react → php-backend

3. **SELECT AND UPLOAD** these files (one at a time or all together):
   - config.php (the one you edited in Step 1.3 - IMPORTANT!)
   - database.php
   - utils.php
   - schema.sql (optional - just for reference)

⚠️ **MAKE SURE** you upload the EDITED config.php with your database credentials

✅ **YOU SHOULD SEE**: These 3-4 files now in public_html/api/

4. **CLICK**: "Go Back to..." to return to File Manager

---

### Step 4.7: Create API Endpoints Folder

**WHERE**: In File Manager → public_html/api

1. **MAKE SURE** you're in: public_html/api (check breadcrumb)

2. **CLICK**: "+ Folder" button

3. **TYPE**: api (lowercase - yes, same name as parent folder)

4. **CLICK**: "Create New Folder"

5. **DOUBLE-CLICK**: The new "api" folder

✅ **YOU SHOULD SEE**: "public_html/api/api" in breadcrumb

⚠️ **YES, THIS IS CORRECT** - you have "api/api/" - this is intentional

---

### Step 4.8: Upload API Endpoint Files

**WHERE**: In File Manager → public_html/api/api

1. **CLICK**: "Upload" button

2. **ON YOUR COMPUTER**: Navigate to:
   - Documents → Website Projects → Current → midway-mobile-storage-react → php-backend → api

3. **SELECT AND UPLOAD** these files (the main .php files):
   - router.php
   - health.php
   - csrf-token.php
   - change-password.php
   - applications.php
   - inventory.php
   - media.php
   - messages.php
   - orders.php
   - quotes.php
   - settings.php

⏳ **WAIT** for all files to upload

✅ **YOU SHOULD SEE**: About 11 .php files in public_html/api/api/

4. **CLICK**: "Go Back to..." to return to File Manager

---

### Step 4.9: Upload API Subfolders

**WHERE**: In File Manager → public_html/api/api

Still need to upload the subfolders (auth/, admin/, media/, public/)

**FOR EACH SUBFOLDER**, repeat these steps:

**A. Create auth/ folder:**
1. **MAKE SURE** you're in: public_html/api/api
2. **CLICK**: "+ Folder" button
3. **TYPE**: auth
4. **CLICK**: "Create New Folder"
5. **DOUBLE-CLICK**: auth folder
6. **CLICK**: "Upload"
7. **ON YOUR COMPUTER**: Navigate to: php-backend/api/auth/
8. **UPLOAD**: login.php
9. **GO BACK**: Click "Up One Level" button (or breadcrumb link to go back to public_html/api/api)

**B. Create admin/ folder:**
1. **MAKE SURE** you're in: public_html/api/api
2. **CLICK**: "+ Folder" button
3. **TYPE**: admin
4. **CLICK**: "Create New Folder"
5. **DOUBLE-CLICK**: admin folder
6. **CLICK**: "Upload"
7. **ON YOUR COMPUTER**: Navigate to: php-backend/api/admin/
8. **UPLOAD**: stats.php
9. **GO BACK** to public_html/api/api

**C. Create media/ folder:**
1. **MAKE SURE** you're in: public_html/api/api
2. **CLICK**: "+ Folder" button
3. **TYPE**: media
4. **CLICK**: "Create New Folder"
5. **DOUBLE-CLICK**: media folder
6. **CLICK**: "Upload"
7. **ON YOUR COMPUTER**: Navigate to: php-backend/api/media/
8. **UPLOAD**: tags.php
9. **GO BACK** to public_html/api/api

**D. Create public/ folder:**
1. **MAKE SURE** you're in: public_html/api/api
2. **CLICK**: "+ Folder" button
3. **TYPE**: public
4. **CLICK**: "Create New Folder"
5. **DOUBLE-CLICK**: public folder
6. **CLICK**: "Upload"
7. **ON YOUR COMPUTER**: Navigate to: php-backend/api/public/
8. **UPLOAD** all files:
   - hero.php
   - logo.php
   - services-media.php
   - settings.php
9. **GO BACK** to public_html/api/api

---

### Step 4.10: Create Uploads Folder

**WHERE**: In File Manager → public_html/api

1. **NAVIGATE TO**: public_html/api (use breadcrumb to go back)

2. **CLICK**: "+ Folder" button

3. **TYPE**: uploads

4. **CLICK**: "Create New Folder"

5. **RIGHT-CLICK**: uploads folder

6. **CLICK**: "Permissions" (or "Change Permissions")

7. **SET PERMISSIONS**:
   - Check boxes for: Read, Write, Execute (Owner)
   - Check boxes for: Read, Execute (Group)
   - Check boxes for: Read, Execute (World)
   - Numeric value should show: 755

8. **CLICK**: "Change Permissions" button

9. **DOUBLE-CLICK**: uploads folder to enter it

10. **CLICK**: "+ File" button

11. **TYPE**: media.json

12. **CLICK**: "Create New File"

13. **RIGHT-CLICK**: media.json file

14. **CLICK**: "Edit"

15. **TYPE**: {}
    (just two curly braces, no spaces)

16. **CLICK**: "Save Changes" button

✅ **YOU SHOULD SEE**: uploads/ folder with media.json inside it

---

### Step 4.11: Verify File Structure

**WHERE**: In File Manager

**NAVIGATE** through your folders and verify this structure exists:

```
public_html/
├── index.html
├── assets/
│   ├── index-[random].js
│   └── index-[random].css
├── robots.txt
├── sitemap.xml
├── favicons/
│   └── (various icon files)
└── api/
    ├── config.php
    ├── database.php
    ├── utils.php
    ├── uploads/
    │   └── media.json
    └── api/
        ├── router.php
        ├── health.php
        ├── csrf-token.php
        ├── (other .php files)
        ├── auth/
        │   └── login.php
        ├── admin/
        │   └── stats.php
        ├── media/
        │   └── tags.php
        └── public/
            └── (4 .php files)
```

✅ **VERIFY** all folders and files are there - scroll through to check

---

## Part 5: Configure Apache (CPANEL)

### Step 5.1: Create Main .htaccess

**WHERE**: In File Manager → public_html

1. **NAVIGATE TO**: public_html (top level)

2. **CLICK**: "+ File" button

3. **TYPE**: .htaccess
   - ⚠️ **INCLUDE THE DOT** at the start: .htaccess
   - Not htaccess - must start with dot

4. **CLICK**: "Create New File"

5. **RIGHT-CLICK**: .htaccess file

6. **CLICK**: "Edit"

7. **YOU MAY SEE**: Popup asking about character encoding - click "Edit" button

8. **DELETE** any existing content (if file already existed)

9. **COPY AND PASTE** this exactly:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router (SPA routing)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Don't rewrite files or directories that exist
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Don't rewrite API calls
    RewriteCond %{REQUEST_URI} !^/api/
    
    # Rewrite everything else to index.html
    RewriteRule ^ index.html [L]
</IfModule>
```

10. **CLICK**: "Save Changes" button

11. **CLICK**: "Close" button

✅ **SUCCESS**: Main .htaccess created in public_html

---

### Step 5.2: Create API .htaccess

**WHERE**: In File Manager → public_html/api

1. **NAVIGATE TO**: public_html/api

2. **CLICK**: "+ File" button

3. **TYPE**: .htaccess

4. **CLICK**: "Create New File"

5. **RIGHT-CLICK**: .htaccess file

6. **CLICK**: "Edit"

7. **COPY AND PASTE** this exactly:

```apache
# Enable rewrite engine
RewriteEngine On

# Route all API requests through router.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ api/router.php [QSA,L]

# Protect sensitive files
<FilesMatch "^(config\.php|database\.php|utils\.php|schema\.sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# PHP settings for uploads
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value max_execution_time 300
php_value session.cookie_httponly 1
```

8. **CLICK**: "Save Changes" button

9. **CLICK**: "Close" button

✅ **SUCCESS**: API .htaccess created in public_html/api

---

## Part 6: Setup Cloudflare (CLOUDFLARE DASHBOARD)

### Step 6.1: Add Domain to Cloudflare

**WHERE**: Web browser → https://dash.cloudflare.com

1. **LOGIN** to Cloudflare (create free account if needed)

2. **CLICK**: "Add site" button (or "Add a Site")

3. **TYPE**: midwaymobilestorage.com
   - ⚠️ Type ONLY the domain - no https://, no www

4. **CLICK**: "Add site" button

5. **SELECT**: Free plan

6. **CLICK**: "Continue" button

---

### Step 6.2: Review DNS Records

**WHERE**: Still in Cloudflare site setup

1. **YOU SHOULD SEE**: Cloudflare found your existing DNS records

2. **VERIFY** these records exist (Cloudflare imports them automatically):
   - Type: A, Name: @ or midwaymobilestorage.com, Points to: (your server IP)
   - Type: CNAME, Name: www, Points to: midwaymobilestorage.com

3. **MAKE SURE** orange cloud icon is ON (not gray) for these records

4. **CLICK**: "Continue" button

---

### Step 6.3: Change Nameservers at GoDaddy

**WHERE**: GoDaddy account dashboard (open new tab)

**Cloudflare SHOWS you two nameservers** - they look like:
- name1.cloudflare.com
- name2.cloudflare.com

📝 **WRITE THESE DOWN** or leave Cloudflare tab open

**GO TO GODADDY**:

1. **LOGIN** to your GoDaddy account

2. **CLICK**: "My Products"

3. **FIND**: midwaymobilestorage.com in your domains list

4. **CLICK**: "DNS" button (or "Manage DNS")

5. **SCROLL DOWN** to "Nameservers" section

6. **CLICK**: "Change" button

7. **SELECT**: "Custom" (or "I'll use my own nameservers")

8. **DELETE** existing nameservers (click X or remove button)

9. **TYPE**: First Cloudflare nameserver (from Cloudflare tab)

10. **CLICK**: "Add Nameserver" button

11. **TYPE**: Second Cloudflare nameserver

12. **CLICK**: "Save" button

13. **CONFIRM** if asked

✅ **YOU SHOULD SEE**: Message like "Nameservers updated"

---

### Step 6.4: Verify Nameservers in Cloudflare

**WHERE**: Back in Cloudflare tab

1. **CLICK**: "Done, check nameservers" button

2. **YOU MAY SEE**: "Checking nameservers..." message

⏳ **THIS CAN TAKE**: 5 minutes to 48 hours (usually 1-2 hours)

**YOU CAN**:
- Close this tab and check back later
- Cloudflare will email you when it's ready
- Or keep clicking "Recheck nameservers" button every 15 minutes

✅ **WHEN ACTIVE**: Status changes to "Active" with green checkmark

---

### Step 6.5: Configure SSL Settings

**WHERE**: Cloudflare dashboard → your site

⚠️ **WAIT** until nameservers are active before doing this

1. **CLICK**: "SSL/TLS" in left sidebar

2. **SELECT**: "Full (strict)" from the options
   - Or "Full" if you get errors (less secure but works)
   - ⚠️ **DO NOT** select "Flexible"

3. **CLICK**: "SSL/TLS" → "Edge Certificates" in left sidebar

4. **TOGGLE ON**: "Always Use HTTPS"

5. **TOGGLE ON**: "Automatic HTTPS Rewrites" (if available)

✅ **SUCCESS**: SSL configured

---

### Step 6.6: Optional Performance Settings

**WHERE**: Still in Cloudflare dashboard

**A. Enable Auto Minify:**
1. **CLICK**: "Speed" → "Optimization" in left sidebar
2. **CHECK BOXES**: JavaScript, CSS, HTML
3. Settings save automatically

**B. Enable Brotli:**
1. Still in "Speed" → "Optimization"
2. **TOGGLE ON**: "Brotli"

**C. Enable HTTP/3:**
1. **CLICK**: "Network" in left sidebar
2. **TOGGLE ON**: "HTTP/3 (with QUIC)"

---

## Part 7: Test Deployment (WEB BROWSER)

### Step 7.1: Test Website Loads

**WHERE**: Web browser (Chrome, Firefox, Safari)

⚠️ **WAIT** at least 5 minutes after Cloudflare activation before testing

1. **OPEN** new private/incognito window

2. **GO TO**: https://midwaymobilestorage.com

✅ **YOU SHOULD SEE**: Your website homepage loads

❌ **IF YOU SEE** "This site can't be reached":
- DNS not propagated yet - wait 30 more minutes
- Or check Cloudflare status - must be "Active"

❌ **IF YOU SEE** blank page:
- Press F12 → Console tab
- Look for red errors
- Common: API_BASE URL wrong in config.js
- Fix: Update config.js and rebuild frontend

---

### Step 7.2: Test SSL Certificate

**WHERE**: Still in browser at your website

1. **LOOK AT** address bar - left side

✅ **YOU SHOULD SEE**: Padlock icon (🔒)

2. **CLICK** the padlock icon

3. **YOU SHOULD SEE**: "Connection is secure"

❌ **IF YOU SEE** "Not Secure" warning:
- Cloudflare SSL not active yet - wait 30 minutes
- Or check SSL settings in Cloudflare (Step 6.5)

---

### Step 7.3: Test API Health

**WHERE**: Browser at your website

1. **GO TO**: https://midwaymobilestorage.com/api/health

✅ **YOU SHOULD SEE**: 
```json
{"status":"ok"}
```

❌ **IF YOU SEE** 404 error:
- .htaccess not working - check Step 5.2
- router.php in wrong location - check Step 4.8

❌ **IF YOU SEE** 500 error:
- Database connection failed - check config.php credentials
- Or check cPanel error logs (Step 8.3)

---

### Step 7.4: Test Admin Login

**WHERE**: Browser at your website

1. **GO TO**: https://midwaymobilestorage.com

2. **SCROLL TO BOTTOM** - look in footer

3. **CLICK**: "Admin Login" link

✅ **YOU SHOULD SEE**: Login page appears

4. **TYPE**:
   - Username: admin
   - Password: admin123 (or your password from database)

5. **CLICK**: "Sign In" button

✅ **YOU SHOULD SEE**: Admin dashboard loads with statistics

❌ **IF LOGIN FAILS**:
- Check admin_users table exists (Step 3.4)
- Verify password hash was imported correctly
- Check browser console (F12) for errors

---

### Step 7.5: Test Dashboard Data

**WHERE**: In admin dashboard (after logging in)

1. **LOOK AT**: Dashboard cards showing numbers

✅ **YOU SHOULD SEE**: Numbers matching your database
- If you imported data: Your actual counts
- If fresh database: All zeros (normal)

2. **CLICK**: "Quotes" in sidebar

✅ **YOU SHOULD SEE**: List of quotes (if you imported data)
OR: "No records found" (if fresh database)

3. **TEST**: Click through each sidebar item:
   - Messages
   - Inventory
   - Applications
   - Orders
   - Site Info
   - Settings

✅ **VERIFY**: Each loads without errors

---

### Step 7.6: Test Public Form

**WHERE**: Browser (open new tab or logout from admin)

1. **GO TO**: https://midwaymobilestorage.com

2. **SCROLL DOWN** to "Request a Quote" section

3. **FILL OUT** form with test data:
   - Name: Test User
   - Email: test@example.com
   - (Fill in other fields)

4. **CLICK**: "Submit Quote" button

✅ **YOU SHOULD SEE**: Green success message "Quote request submitted successfully!"

5. **GO BACK** to admin panel

6. **CLICK**: "Quotes" in sidebar

7. **LOOK FOR**: Your test quote in the list

✅ **YOU SHOULD SEE**: "Test User" quote appears

---

## Part 8: Post-Deployment Security (CRITICAL)

### Step 8.1: Change Admin Password

**WHERE**: Admin panel

⚠️ **DO THIS IMMEDIATELY** - don't use admin123 in production

1. **LOGIN** to admin panel

2. **CLICK**: "Account Security" in left sidebar

3. **FILL OUT**:
   - Current Password: admin123
   - New Password: (type a strong password - 12+ characters)
   - Confirm Password: (type same password again)

4. **CLICK**: "Change Password" button

✅ **YOU SHOULD SEE**: Success message

5. **CLICK**: "Logout" button

6. **LOGIN AGAIN** with NEW password to verify it worked

---

### Step 8.2: Verify File Permissions

**WHERE**: cPanel File Manager

1. **LOGIN** to cPanel

2. **OPEN**: File Manager

3. **NAVIGATE TO**: public_html/api

4. **RIGHT-CLICK**: config.php

5. **CLICK**: "Permissions"

✅ **VERIFY**: Permissions are 644 or 640
- Owner: Read + Write
- Group: Read only
- World: Read only (or nothing)

6. **IF WRONG**: Change to 644 and click "Change Permissions"

7. **REPEAT** for uploads/ folder:
   - Should be: 755
   - Owner: Read + Write + Execute
   - Group: Read + Execute
   - World: Read + Execute

---

### Step 8.3: Check Error Logs

**WHERE**: cPanel

1. **SEARCH FOR**: "Errors" in cPanel

2. **CLICK**: "Errors" icon

3. **SELECT**: Your domain from dropdown

4. **LOOK FOR**: Any PHP errors or warnings

✅ **GOOD**: No errors, or only old errors (ignore dates before your deployment)

❌ **IF ERRORS EXIST**:
- Read the error message carefully
- Check file paths mentioned
- Common issues:
  - Database connection errors → check config.php
  - Permission denied → check Step 8.2
  - File not found → check file uploaded correctly

**📝 BOOKMARK** this page - check weekly

---

### Step 8.4: Setup Backup Schedule

**WHERE**: cPanel

1. **SEARCH FOR**: "Backup" in cPanel

2. **CLICK**: "Backup" or "Backup Wizard"

3. **LOOK FOR**: "Automatic Backups" section

4. **IF AVAILABLE** (depends on hosting plan):
   - Enable daily or weekly backups
   - Note where backups are stored

5. **IF NOT AVAILABLE**:
   - Manually backup monthly:
     - Download entire public_html folder
     - Export database from phpMyAdmin
     - Save both to external drive

---

### Step 8.5: Monitor SSL Certificate

**WHERE**: Browser

⚠️ **SET REMINDER** for 3 months from now

1. **TEST SSL**: https://www.ssllabs.com/ssltest/

2. **TYPE**: midwaymobilestorage.com

3. **CLICK**: "Submit"

4. **WAIT**: 2-3 minutes for test to complete

✅ **SHOULD GET**: Grade A or better

**Cloudflare automatically renews** SSL certificates - you don't need to do anything

---

## Troubleshooting Common Issues

### Issue: "500 Internal Server Error"

**Possible Causes:**
1. .htaccess syntax error
2. PHP version incompatibility
3. Database connection failed
4. File permissions wrong

**How to Fix:**

**A. Check .htaccess**
- Open public_html/api/.htaccess in File Manager
- Verify it matches exactly what's in Step 5.2
- Try temporarily renaming it to .htaccess.bak to disable it
- If site works, there's a syntax error in .htaccess

**B. Check PHP Version**
- In cPanel, search "PHP"
- Click "Select PHP Version"
- Verify version is 8.0 or higher
- If lower, select 8.1 or 8.2 and click "Save"

**C. Check Database**
- Open config.php in File Manager → Edit
- Verify DB_USER, DB_PASS, DB_NAME exactly match Step 2
- Look for typos or extra spaces
- Database names usually have prefix like: cpanelusername_midway_storage
- Username usually has prefix like: cpanelusername_midway_user

**D. Check Permissions**
- Navigate to public_html/api
- Right-click config.php → Permissions → Should be 644
- Right-click uploads folder → Permissions → Should be 755

**E. Check Error Logs**
- In cPanel, search "Errors"
- Click "Errors" icon
- Look at most recent error message
- It will tell you exactly what's wrong

---

### Issue: "Database connection failed"

**How to Verify Database Credentials:**

1. **Open phpMyAdmin** in cPanel

2. **Look at left sidebar** - see your database name?
   - ✅ If yes: Database exists
   - ❌ If no: Create it (repeat Part 2)

3. **Test connection manually**:
   - In phpMyAdmin, run this query (click "SQL" tab):
   ```sql
   SELECT COUNT(*) FROM admin_users;
   ```
   - ✅ If you see a number: Database working
   - ❌ If error: Table doesn't exist (repeat Part 3)

4. **Check config.php**:
   - Open in File Manager → Edit
   - Compare DB_NAME, DB_USER with phpMyAdmin sidebar
   - They MUST match exactly including prefix
   - Example:
     - cPanel shows: midwaymo_midway_storage
     - config.php must say: define('DB_NAME', 'midwaymo_midway_storage');

---

### Issue: API returns 404 error

**Possible Causes:**
1. .htaccess not working
2. router.php in wrong location
3. mod_rewrite disabled

**How to Fix:**

**A. Check file locations**:
```
public_html/api/.htaccess  ← MUST exist
public_html/api/api/router.php  ← MUST exist
```

**B. Verify .htaccess content**:
- Open public_html/api/.htaccess
- Must contain "RewriteRule ^(.*)$ api/router.php [QSA,L]"
- Exactly as shown in Step 5.2

**C. Test direct access**:
- Try: https://midwaymobilestorage.com/api/api/router.php
- If this works: .htaccess not routing correctly
- If this fails: router.php not uploaded or wrong location

**D. Contact support**:
- mod_rewrite might be disabled
- Ask GoDaddy support to enable mod_rewrite

---

### Issue: Frontend shows blank page

**Possible Causes:**
1. JavaScript error
2. API_BASE wrong
3. Build files corrupted

**How to Fix:**

**A. Check browser console**:
- Press F12 on your keyboard
- Click "Console" tab
- Look for red errors

**B. Common errors:**

**Error**: "Failed to fetch" or "Network error"
- **Cause**: API_BASE URL wrong
- **Fix**: 
  - Check frontend/src/config.js
  - Must say: export const API_BASE = 'https://midwaymobilestorage.com/api'
  - Rebuild: npm run build
  - Re-upload dist/ folder

**Error**: "CORS error"
- **Cause**: ALLOWED_ORIGINS wrong in config.php
- **Fix**:
  - Open php-backend/config.php
  - Verify ALLOWED_ORIGINS includes your domain
  - Re-upload config.php to public_html/api/

**Error**: "Unexpected token <"
- **Cause**: .htaccess routing broken
- **Fix**: Check Step 5.1 - main .htaccess file

**C. Clear cache**:
- In browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- In Cloudflare: Dashboard → Caching → Purge Everything

---

### Issue: SSL certificate warnings

**Possible Causes:**
1. Cloudflare SSL not configured
2. DNS not propagated
3. Mixed content (HTTP/HTTPS)

**How to Fix:**

**A. Check Cloudflare SSL**:
- Login to Cloudflare
- Click your site
- Click SSL/TLS in sidebar
- Verify mode is "Full" or "Full (strict)"
- NOT "Flexible" or "Off"

**B. Check DNS**:
- In Cloudflare, click "DNS"
- Verify records have orange cloud (proxied)
- If gray cloud: Click to turn orange

**C. Wait for propagation**:
- Can take 1-48 hours
- Test: https://www.whatsmydns.net/
- Type: midwaymobilestorage.com
- Should show Cloudflare IPs

**D. Mixed content**:
- Open browser console (F12)
- Look for "Mixed Content" warnings
- All API calls must use https://, not http://
- Check config.js API_BASE starts with https://

---

### Issue: Forms don't submit

**Possible Causes:**
1. CSRF token not generating
2. Database connection failed
3. Rate limiting triggered

**How to Fix:**

**A. Test CSRF token**:
- Go to: https://midwaymobilestorage.com/api/csrf-token
- Should see: {"token":"long_random_string"}
- If blank or error: Check database connection

**B. Check browser console**:
- Press F12
- Submit form
- Look at "Network" tab
- Click the failed request
- See error message in response

**C. Test rate limiting**:
- Try submitting form again
- If works the 2nd time: Rate limit hit
- If never works: Different problem

**D. Check database**:
- In phpMyAdmin, run:
```sql
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1;
```
- If your submission appears: Form works, display issue
- If nothing: Database not receiving data

---

### Issue: File upload fails

**Possible Causes:**
1. uploads/ folder permissions wrong
2. PHP upload limits too low
3. media.json missing or corrupted

**How to Fix:**

**A. Check permissions**:
- File Manager → public_html/api/uploads
- Right-click uploads → Permissions
- Must be 755
- Right-click media.json → Permissions
- Must be 644 or 666

**B. Check media.json**:
- Open in File Manager → Edit
- Must contain: {}
- If empty: Type {} and save
- If missing: Create file named media.json with content: {}

**C. Check PHP limits**:
- In cPanel, search "PHP"
- Click "Select PHP Version" → "Switch to PHP Options"
- Find: upload_max_filesize
- Set to: 10M or higher
- Find: post_max_size
- Set to: 10M or higher
- Click "Save"

---

### Issue: Cloudflare shows "Error 521"

**What it means**: Web server is down

**How to Fix:**

**A. Check if site accessible directly**:
- Find your server IP address (in GoDaddy hosting dashboard)
- Try: http://YOUR_SERVER_IP/
- If works: Cloudflare issue
- If doesn't work: Server issue

**B. Temporarily pause Cloudflare**:
- Cloudflare dashboard → Overview
- Click "Pause Cloudflare on Site" button at bottom right
- Wait 5 minutes
- Try accessing site
- If works: Cloudflare config issue
- If doesn't work: Server issue

**C. Check with hosting**:
- Contact GoDaddy support
- Ask if server is running
- Ask if any downtime or maintenance

---

### Issue: Rate limiting too aggressive

**Symptoms**: 
- Forms show "Too many requests" after a few submissions
- Can't test forms repeatedly

**How to Fix:**

**A. Increase limits temporarily**:
- Edit config.php:
```php
define('RATE_LIMIT_REQUESTS', 100);  // Was: 50
define('RATE_LIMIT_WINDOW', 900);
```
- Re-upload config.php
- For production, set back to 50

**B. Clear sessions**:
- In cPanel, search "Session"
- If available, click "Clear PHP Sessions"
- Or wait 15 minutes for automatic reset

**C. Use different browser/incognito**:
- Rate limit is per IP + session
- Opening incognito window bypasses it for testing

---

## Quick Reference

### Important URLs

**Your Website**: https://midwaymobilestorage.com
**Admin Panel**: https://midwaymobilestorage.com (click "Admin Login" in footer)
**API Health Check**: https://midwaymobilestorage.com/api/health
**cPanel**: https://midwaymobilestorage.com/cpanel
**Cloudflare Dashboard**: https://dash.cloudflare.com
**SSL Test**: https://www.ssllabs.com/ssltest/

---

### File Structure Reference

```
public_html/
├── index.html                    (React app entry)
├── .htaccess                     (React routing + HTTPS redirect)
├── assets/                       (JS and CSS bundles)
├── robots.txt
├── sitemap.xml
├── favicons/
└── api/
    ├── .htaccess                 (API routing + security)
    ├── config.php                (DB credentials)
    ├── database.php              (DB connection class)
    ├── utils.php                 (Security functions)
    ├── schema.sql               (DB structure - reference only)
    ├── uploads/
    │   └── media.json           (Media registry)
    └── api/
        ├── router.php           (Main API entry point)
        ├── (11 endpoint .php files)
        ├── auth/
        │   └── login.php
        ├── admin/
        │   └── stats.php
        ├── media/
        │   └── tags.php
        └── public/
            └── (4 public endpoint files)
```

---

### Credentials Checklist

📝 **WRITE DOWN** these values during setup:

From Step 1.1 (JWT Secret):
- [ ] JWT_SECRET: _________________________________

From Step 2 (Database):
- [ ] DB_NAME: _________________________________
- [ ] DB_USER: _________________________________
- [ ] DB_PASS: _________________________________

From Step 6 (Cloudflare):
- [ ] Nameserver 1: _________________________________
- [ ] Nameserver 2: _________________________________

From Step 8.1 (Admin):
- [ ] New Admin Password: _________________________________ (keep secure!)

---

## Final Checklist

**Before considering deployment complete, verify ALL these:**

### Configuration Files
- [ ] frontend/src/config.js → API_BASE = production URL
- [ ] php-backend/config.php → DB credentials correct
- [ ] php-backend/config.php → JWT_SECRET updated
- [ ] php-backend/config.php → ALLOWED_ORIGINS = production only
- [ ] php-backend/config.php → DEBUG_MODE = false

### Files Uploaded
- [ ] Frontend files in public_html/
- [ ] Backend files in public_html/api/
- [ ] All subfolders uploaded (auth/, admin/, media/, public/)
- [ ] uploads/ folder created with media.json
- [ ] Both .htaccess files created

### Database
- [ ] Database created in cPanel
- [ ] User created with ALL PRIVILEGES
- [ ] Data imported successfully (7 tables visible)
- [ ] admin_users table has at least one user

### Cloudflare
- [ ] Domain added to Cloudflare
- [ ] Nameservers changed at GoDaddy
- [ ] Status shows "Active" (not pending)
- [ ] SSL mode set to "Full" or "Full (strict)"
- [ ] "Always Use HTTPS" enabled

### Testing
- [ ] Website loads: https://midwaymobilestorage.com
- [ ] Padlock icon shows in browser
- [ ] API health check returns {"status":"ok"}
- [ ] Admin login works
- [ ] Dashboard shows correct data
- [ ] Quote form submission works
- [ ] Test quote appears in admin panel

### Security
- [ ] Admin password changed from default
- [ ] File permissions correct (config.php = 644, uploads = 755)
- [ ] Error logs checked (no critical errors)
- [ ] Backup schedule configured

---

## Support Resources

**If you get stuck:**

1. **Check error logs** (cPanel → Errors) - tells you exactly what's wrong
2. **Check browser console** (F12 → Console tab) - shows frontend errors
3. **Review this guide** - most issues covered in Troubleshooting section
4. **GoDaddy Support**: Available 24/7 via phone/chat
5. **Cloudflare Support**: Community forums or support ticket

**Common support questions to ask:**
- "Can you verify mod_rewrite is enabled on my account?"
- "Can you check if my database user has correct permissions?"
- "Can you see any server errors in the last hour for my domain?"

---

## What to Do After Deployment

**Week 1:**
- [ ] Check error logs daily (cPanel → Errors)
- [ ] Monitor form submissions (admin panel)
- [ ] Test on multiple devices and browsers
- [ ] Update business information (admin → Site Info)
- [ ] Upload company logo (admin → Settings → Media Manager)

**Week 2:**
- [ ] Setup Google Analytics or tracking (optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Test SSL certificate at ssllabs.com
- [ ] Create first database backup manually

**Monthly:**
- [ ] Check error logs
- [ ] Review form submissions for spam
- [ ] Verify backups are working
- [ ] Update admin password (optional - every 3 months)
- [ ] Check Cloudflare analytics

**As Needed:**
- [ ] Add/update inventory items
- [ ] Respond to quote requests
- [ ] Update business hours/contact info
- [ ] Upload new service/product images

---

**End of Deployment Guide**

**Last Updated**: November 25, 2025
**Author**: GitHub Copilot
**Status**: Production Ready
