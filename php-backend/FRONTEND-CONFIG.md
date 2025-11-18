# Frontend Configuration for PHP Backend

When you're ready to switch from the Node.js backend to the PHP backend, follow these steps:

## Option 1: Update Global Config (Recommended)

Edit `frontend/src/config.js`:

```javascript
// For local development with PHP backend
export const API_BASE = 'http://localhost/api';

// For production with GoDaddy
export const API_BASE = 'https://yourdomain.com/api';
```

## Option 2: Environment Variable

Use Vite's environment variable system:

Create `frontend/.env.local`:
```bash
VITE_API_BASE=http://localhost:8000
```

For production:
```bash
VITE_API_BASE=https://yourdomain.com/api
```

The `config.js` will automatically use this value if set.

## Verification

All admin modules and public forms now import `API_BASE` from `config.js`:
- ✅ QuotesModule.jsx
- ✅ MessagesModule.jsx  
- ✅ ApplicationsModule.jsx
- ✅ OrdersModule.jsx
- ✅ InventoryModule.jsx
- ✅ QuoteForm.jsx
- ✅ ContactModal.jsx
- ✅ PanelSealOrderModal.jsx
- ✅ CareersSection.jsx

Just update `config.js` or the environment variable to switch backends!

## Testing Locally with PHP Backend

### 1. Install PHP (if not already installed)

**macOS:**
```bash
# PHP comes pre-installed, or install via Homebrew
brew install php
```

### 2. Set Up Local PHP Server

```bash
# Navigate to php-backend directory
cd php-backend

# Copy config template
cp config.example.php config.php

# Edit config.php with your local MySQL credentials
nano config.php

# Start PHP built-in server
php -S localhost:8000 -t api/
```

### 3. Update Frontend Config for Local Testing

```javascript
export const API_BASE = 'http://localhost:8000';
```

### 4. Test Endpoints

Visit:
- http://localhost:8000/health
- http://localhost:8000/auth/login (POST with credentials)

## Production Deployment

### 1. Upload Frontend

After configuring API_BASE for production:

```bash
# Build frontend
cd frontend
npm run build

# Upload dist/ folder contents to public_html/ via cPanel File Manager
```

### 2. Verify API Connection

Open browser console on your live site and check for:
- No CORS errors
- API requests going to correct URL
- Successful responses from PHP backend

## Troubleshooting

### CORS Errors
- Verify your domain is in `ALLOWED_ORIGINS` in `php-backend/config.php`
- Check HTTPS vs HTTP (must match)

### 404 on API Endpoints
- Verify `.htaccess` is uploaded to `/api/` directory
- Check mod_rewrite is enabled (contact GoDaddy if needed)

### Authentication Not Working
- Clear browser localStorage
- Verify JWT_SECRET matches between requests
- Check token isn't expired (12-hour default)

### Forms Not Submitting
- Check browser console for errors
- Verify rate limiting isn't blocking (10 requests per 5 min)
- Check database credentials in config.php

## Quick Comparison

| Aspect | Node.js Backend | PHP Backend |
|--------|----------------|-------------|
| **URL** | http://localhost:5001/api | https://yourdomain.com/api |
| **Hosting** | Requires Node.js server | Works with GoDaddy cPanel |
| **Port** | 5001 | 80/443 (standard) |
| **Start Command** | npm start | Always running |
| **Logs** | Terminal output | cPanel error logs |
