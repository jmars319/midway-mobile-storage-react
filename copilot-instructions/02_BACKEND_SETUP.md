# Backend Setup Instructions

## Folder: `backend/`

### File: `package.json`

```json
{
  "name": "midway-storage-backend",
  "version": "1.0.0",
  "description": "Midway Mobile Storage API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["storage", "containers", "api"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### File: `.env`

```env
DB_HOST=localhost
DB_USER=midway
DB_PASSWORD=midway2025
DB_NAME=midway_storage
PORT=5001
NODE_ENV=development
```

**IMPORTANT**: Replace `your_mysql_password_here` with actual MySQL password

### File: `server.js`

Create an Express server with the following requirements:

#### Dependencies
```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
```

#### Configuration
- Port: 5001
- Enable CORS
- Parse JSON bodies
- MySQL connection pool with credentials from .env

#### API Endpoints

**Authentication:**
- `POST /api/login` - Login with username/password, return user object

**Quote Requests:**
- `POST /api/quotes` - Create new quote request
- `GET /api/quotes` - Get all quotes
- `GET /api/quotes/:id` - Get single quote
- `PATCH /api/quotes/:id` - Update quote status

**Job Applications:**
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get all applications
- `PATCH /api/applications/:id` - Update application status

**Inventory:**
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item
- `PATCH /api/inventory/:id` - Update inventory item

**PanelSeal Orders:**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id` - Update order status

**Settings:**
- `GET /api/settings` - Get business settings
- `PATCH /api/settings` - Update business settings

#### Error Handling
- All endpoints should have try/catch blocks
- Return appropriate HTTP status codes
- Log errors to console

#### Database Connection
- Test connection on startup
- Log success/failure messages

#### Server Startup
```javascript
app.listen(PORT, () => {
  console.log(`Midway Mobile Storage API running on http://localhost:${PORT}`);
});
```

## Installation Commands

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Midway Mobile Storage API running on http://localhost:5001
✓ Database connected successfully
```