# PHP Backend for Abissnet - cPanel Deployment

## Overview
This directory contains the PHP backend API that replaces the Node.js server for cPanel compatibility.

## Structure

```
api/
├── config.php           # Configuration, env loader, helper functions
├── OdooClient.php       # Odoo JSON-RPC client class
├── contact.php          # Contact form endpoint
├── careers-apply.php    # Job application endpoint
├── login.php            # Authentication endpoint
└── subscriber.php       # All subscriber portal endpoints
```

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Contact form submissions
- `POST /api/careers/apply` - Job applications
- `POST /api/login` - User authentication
- `GET /api/health` - Health check

### Authenticated Endpoints (require Bearer token)
- `GET /api/overview` - Account overview
- `GET /api/devices` - Connected devices
- `GET /api/invoices` - Invoice history
- `GET /api/tickets` - Support tickets
- `POST /api/tickets` - Create support ticket
- `POST /api/speedtest` - Run speed test
- `POST /api/line-test` - Test line quality
- `POST /api/restart-cpe` - Restart CPE device
- `POST /api/pay` - Payment processing
- `POST /api/upgrade` - Upgrade plan
- `POST /api/add-tv` - Add TV package
- `GET /api/public-ip` - Get public IP info

## Configuration

The backend reads configuration from `.env` file in the parent directory:

```env
ODOO_URL=https://hr.abissnet.al
ODOO_DB=odoo
ODOO_UID=858
ODOO_PASS=Biori1234
PORT=4000
```

## Authentication

Demo credentials:
- **Email:** demo@abissnet.al
- **Password:** demo123
- **Token:** demo-token

Use the token in request headers:
```
Authorization: Bearer demo-token
```

## cPanel Deployment Steps

### 1. Upload Files
Upload the entire `ABISNET_FrontEnd-Final4` folder to your cPanel public_html:
```
public_html/
├── .htaccess
├── .env
├── index.html
├── karriera.html
├── ... (other HTML files)
├── api/
│   ├── config.php
│   ├── OdooClient.php
│   ├── contact.php
│   ├── careers-apply.php
│   ├── login.php
│   └── subscriber.php
├── assets/
├── server/
│   └── data/
│       └── subscribers.json
```

### 2. Set File Permissions
```bash
chmod 755 api/
chmod 644 api/*.php
chmod 755 server/data/
chmod 666 server/data/subscribers.json
chmod 644 .env
chmod 644 .htaccess
```

### 3. Verify PHP Version
Ensure PHP 7.4+ is enabled in cPanel:
- Go to **Select PHP Version**
- Choose PHP 7.4 or higher
- Enable extensions: `curl`, `json`, `mbstring`

### 4. Test Endpoints

Test the API is working:
```bash
# Health check (public)
curl https://yourdomain.com/api/health

# Contact form (public)
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","city":"Tiranë","subject":"Test","client_status":"new","message":"Test message"}'

# Login
curl -X POST https://yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@abissnet.al","password":"demo123"}'

# Overview (authenticated)
curl https://yourdomain.com/api/overview \
  -H "Authorization: Bearer demo-token"
```

### 5. Update Frontend URLs (if needed)

If your domain is different, update fetch URLs in HTML files:
```javascript
// Change from:
fetch('/api/contact', ...)

// To (if needed):
fetch('https://yourdomain.com/api/contact', ...)
```

## Troubleshooting

### 500 Internal Server Error
- Check PHP error logs in cPanel
- Verify file permissions
- Ensure `.env` file exists and is readable

### 404 Not Found
- Verify `.htaccess` is in the root directory
- Check that `mod_rewrite` is enabled
- Ensure file paths are correct

### Odoo Connection Issues
- Verify ODOO credentials in `.env`
- Test Odoo connection manually
- Check firewall/network access to Odoo server
- Enable PHP `curl` extension

### CORS Issues
- Headers are set in `config.php`
- If still issues, add to `.htaccess`:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

## Development vs Production

### Local Testing (XAMPP/WAMP)
```bash
# Place files in htdocs/
# Access via: http://localhost/api/health
```

### Production (cPanel)
```bash
# Upload to public_html/
# Access via: https://yourdomain.com/api/health
```

## Data Storage

Subscriber data is stored in:
```
server/data/subscribers.json
```

This file is automatically created with default data if it doesn't exist.

## Security Notes

1. **Production .env**: Update with real credentials, never commit to git
2. **Token**: Change `AUTH_TOKEN` in config.php for production
3. **File permissions**: Ensure sensitive files aren't world-readable
4. **SSL**: Use HTTPS for production (cPanel provides free SSL)
5. **Error logging**: Check `error_log` files regularly

## Migration from Node.js

The PHP backend is functionally equivalent to the Node.js version:

| Node.js File | PHP Equivalent |
|--------------|----------------|
| `server/server_subs.js` | `api/subscriber.php`, `api/contact.php`, etc. |
| `server/odooClient.js` | `api/OdooClient.php` |
| Express routing | `.htaccess` + individual PHP files |
| `dotenv` | `config.php` env loader |
| `fs/promises` | Native PHP file functions |

## Support

For issues, check:
1. PHP error logs in cPanel
2. Browser console for client-side errors
3. Network tab for failed API calls
4. Odoo logs for integration issues
