# Deployment Guide for cPanel (Shared Hosting)

## Overview

This guide explains how to deploy the Abissnet website to cPanel shared hosting **without Node.js**. The forms will work using a PHP proxy that connects to Odoo.

## ✅ What Works on Shared Hosting

- All HTML/CSS/JavaScript pages
- Navigation, animations, UI
- Contact form → sends to Odoo CRM
- Karriera (job application) form → sends to Odoo CRM
- Static content delivery
- All client-side functionality

## ❌ What Doesn't Work on Shared Hosting

- Subscriber portal (requires Node.js backend)
- Real-time features (require Node.js)

## Files to Upload

Upload these files/folders from the `public/` directory:

```
public/
├── index.html
├── karriera.html
├── suport.html
├── internet.html
├── (all other .html files)
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
├── biznesi/
├── AbissnetSuperiore/
└── api/
    └── odoo-proxy.php  ← IMPORTANT: This handles Odoo integration
```

## Step-by-Step Deployment

### 1. Prepare Files

1. Copy everything from the `public/` folder
2. Make sure `api/odoo-proxy.php` is included

### 2. Upload to cPanel

**Option A: File Manager**
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or your domain's root folder)
4. Upload all files from `public/`
5. Verify `api/odoo-proxy.php` is at `public_html/api/odoo-proxy.php`

**Option B: FTP**
1. Use FileZilla or another FTP client
2. Connect to your hosting
3. Upload all `public/` contents to `public_html/`

### 3. Configure PHP Proxy (IMPORTANT)

Edit `api/odoo-proxy.php` and verify these settings:

```php
define('ODOO_URL', 'https://hr.abissnet.al');
define('ODOO_DB', 'odoo');
define('ODOO_UID', 858);
define('ODOO_PASSWORD', 'Biori1234');
```

**Security Note:** These credentials are kept server-side in PHP and are NOT exposed to browsers.

### 4. Set File Permissions

In cPanel File Manager:
- Set `api/odoo-proxy.php` to **644** or **755**
- Ensure the `api/` folder has **755** permissions

### 5. Test the Deployment

1. **Visit your website:**
   ```
   https://yourdomain.al
   ```

2. **Test contact form:**
   - Go to `https://yourdomain.al/suport.html`
   - Fill out the contact form
   - Submit
   - Should show "Mesazhi u dërgua. Faleminderit!"

3. **Test karriera form:**
   - Go to `https://yourdomain.al/karriera.html`
   - Click "Apliko" on any job
   - Fill out the application
   - Submit
   - Should show "Aplikimi u dërgua me sukses!"

4. **Check Odoo:**
   - Log into your Odoo instance
   - Go to CRM → Leads
   - Verify new leads were created

### 6. Configure .htaccess (Optional)

For clean URLs and security, create/edit `.htaccess` in `public_html/`:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect to HTTPS (recommended)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Custom error pages (optional)
ErrorDocument 404 /index.html

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Protect sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
```

## Troubleshooting

### Forms Don't Submit

**Check 1: PHP File Location**
- Verify `odoo-proxy.php` is at `/public_html/api/odoo-proxy.php`
- Test by visiting: `https://yourdomain.al/api/odoo-proxy.php`
- You should see a JSON error (this confirms PHP is working)

**Check 2: PHP Version**
- cPanel → MultiPHP Manager
- Ensure PHP 7.4 or higher is selected for your domain

**Check 3: PHP cURL Extension**
- cPanel → Select PHP Version → Extensions
- Enable `curl` extension

**Check 4: Error Logs**
- cPanel → Errors
- Check error logs for PHP errors
- Look for "Odoo" or "curl" related errors

### CORS Errors in Browser Console

If you see CORS errors:

1. Edit `api/odoo-proxy.php`
2. Change this line:
   ```php
   header('Access-Control-Allow-Origin: *');
   ```
   To:
   ```php
   header('Access-Control-Allow-Origin: https://yourdomain.al');
   ```

### Odoo Connection Errors

**Symptoms:** Forms submit but show "Connection error"

**Solutions:**
1. Verify Odoo credentials in `odoo-proxy.php`
2. Test Odoo connection manually:
   ```bash
   curl -X POST https://hr.abissnet.al/jsonrpc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"call","params":{},"id":1}'
   ```
3. Check if your hosting allows outbound HTTPS connections
4. Contact hosting support if needed

### File Upload Path Issues

If forms can't find the API:

1. Check browser console for 404 errors
2. Verify the path in forms matches your structure:
   - `karriera.html` calls: `api/odoo-proxy.php?endpoint=careers`
   - `suport.html` calls: `api/odoo-proxy.php?endpoint=contact`

## Production Checklist

- [ ] All files uploaded to `public_html/`
- [ ] `api/odoo-proxy.php` present and configured
- [ ] PHP 7.4+ enabled
- [ ] cURL extension enabled
- [ ] Odoo credentials verified in PHP file
- [ ] HTTPS enabled (recommended)
- [ ] `.htaccess` configured for security
- [ ] Contact form tested and working
- [ ] Karriera form tested and working
- [ ] Leads appear in Odoo CRM
- [ ] Email notifications received at b.njerezore@abissnet.al

## Security Best Practices

1. **Never commit credentials to Git:**
   - Add `api/odoo-proxy.php` to `.gitignore` (already configured)
   
2. **Use HTTPS only:**
   - Enable SSL certificate in cPanel (Let's Encrypt is free)
   - Force HTTPS redirects in `.htaccess`

3. **Restrict API access:**
   - Add rate limiting if available
   - Consider IP whitelisting for admin pages

4. **Regular updates:**
   - Keep Odoo credentials secure
   - Monitor error logs regularly

## Alternative: FormSubmit.co (If Odoo Integration Fails)

If Odoo integration doesn't work on your hosting, you can use FormSubmit.co as a fallback:

1. Edit forms to use:
   ```html
   <form action="https://formsubmit.co/b.njerezore@abissnet.al" method="POST">
   ```

2. No PHP required
3. Emails sent directly to HR
4. Free and reliable

See `KARRIERA_EMAIL_SETUP.md` for FormSubmit details.

## Support

If you encounter issues:
1. Check cPanel error logs
2. Test PHP proxy directly in browser
3. Verify Odoo credentials
4. Contact hosting support for server configuration issues

## Summary

✅ **Upload all files from `public/` to cPanel**  
✅ **Ensure `api/odoo-proxy.php` is present and configured**  
✅ **Enable PHP 7.4+ and cURL extension**  
✅ **Test both forms after deployment**  

The site will work perfectly on shared hosting without Node.js!
