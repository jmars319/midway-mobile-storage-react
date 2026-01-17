# About Section Feature - Deployment Guide

## Overview
Adds editable About section content to the admin panel's Site Settings module.

**Estimated Time:** 15-20 minutes  
**Downtime:** None

---

## Step 1: Database Migration (5 minutes)

1. **Login to phpMyAdmin** in cPanel
2. **Select your database** (e.g., `wzeno_midway_storage`)
3. **Click "SQL" tab**
4. **Copy and paste the SQL below** (from ALTER to the last semicolon - don't copy the ```sql markers):

```sql
ALTER TABLE site_settings 
ADD COLUMN aboutTitle VARCHAR(255) NOT NULL DEFAULT 'About Midway Mobile Storage' AFTER siteUrl,
ADD COLUMN aboutSubtitle VARCHAR(255) NOT NULL DEFAULT 'Serving Winston-Salem and the Triad Area' AFTER aboutTitle,
ADD COLUMN aboutSinceYear VARCHAR(10) NOT NULL DEFAULT '1989' AFTER aboutSubtitle,
ADD COLUMN aboutText1 TEXT AFTER aboutSinceYear,
ADD COLUMN aboutText2 TEXT AFTER aboutText1,
ADD COLUMN aboutCommitments TEXT AFTER aboutText2;

UPDATE site_settings 
SET 
    aboutTitle = 'About Midway Mobile Storage',
    aboutSubtitle = 'Serving Winston-Salem and the Triad Area',
    aboutSinceYear = '1989',
    aboutText1 = 'Since 1989, Midway Mobile Storage has been at the forefront of the portable storage industry in Winston-Salem, NC. With over three decades of experience, we\'ve built our reputation on delivering secure, affordable mobile storage solutions backed by unmatched expertise and customer service throughout North Carolina.',
    aboutText2 = 'As pioneers in our market, we understand what our customers need — whether it\'s short-term job site storage, long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and innovation has made us a trusted partner for businesses and individuals throughout Winston-Salem, Greensboro, High Point, and surrounding areas.',
    aboutCommitments = 'Quality Products,Professional Service,Flexible Solutions,Competitive Pricing'
WHERE aboutText1 IS NULL OR aboutText1 = '';
```

5. **Verify:** Should see "Query OK" message

---

## Step 2: Upload Backend Files (5 minutes)

Upload to `public_html/midwaymobilestorage.com/api/`:

1. **`utils.php`** (root of api folder) - Added `decodeOutput()` function
2. **`api/settings.php`** - Handles About fields in admin endpoint
3. **`api/public/settings.php`** - Returns About fields to public

**Important:** These files handle apostrophes correctly and maintain security.

---

## Step 3: Upload Frontend Files (5 minutes)

**First, build the frontend:**
```bash
cd frontend
npm run build
```

**Then upload from `frontend/dist/` to `public_html/midwaymobilestorage.com/`:**
1. Delete old `index.html` and `assets/` folder
2. Upload new `index.html` and `assets/` folder

---

## Step 4: Test (3 minutes)

1. **Visit homepage** - About section should load
2. **Login to admin** at `/admin`
3. **Go to Site Settings**
4. **Scroll to "About Section Content"**
5. **Edit fields** (test apostrophes like "we're")
6. **Click Save**
7. **Refresh homepage** - Changes should appear

---

## What Changed

### Features:
- ✅ About section editable from admin panel
- ✅ 7 new database fields for About content
- ✅ Proper handling of apostrophes and special characters
- ✅ Maintains SEO heading structure (H2→H3→H4)

### Security:
- ✅ JWT authentication required
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention (input sanitization)
- ✅ Proper output decoding

### Files Modified:
- `backend/schema.sql`
- `backend/utils.php`
- `backend/api/settings.php`
- `backend/api/public/settings.php`
- `frontend/src/admin/modules/SiteSettingsModule.jsx`
- `frontend/src/components/AboutSection.jsx`

### Files Created:
- `backend/migrations/add_about_section_fields.sql`

---

## Troubleshooting

**About section doesn't update:**
- Clear browser cache (Cmd+Shift+R)
- Check console for API errors
- Verify migration ran successfully

**Apostrophes show as `&#039;`:**
- Ensure `decodeOutput()` function in `utils.php`
- Verify updated files were uploaded
- Clear browser cache

**Admin login fails:**
- Check database credentials in `config.php`
- Verify `admin_users` table exists
- Enable DEBUG_MODE for errors

---

## Rollback Plan

If issues occur:
1. Keep backup of old files
2. Restore previous `utils.php`, `settings.php`, and frontend files
3. Run: `ALTER TABLE site_settings DROP COLUMN aboutTitle, DROP COLUMN aboutSubtitle, DROP COLUMN aboutSinceYear, DROP COLUMN aboutText1, DROP COLUMN aboutText2, DROP COLUMN aboutCommitments;`
