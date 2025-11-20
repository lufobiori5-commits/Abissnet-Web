# Server Architecture Overview

## Important: Frontend is Independent of Node.js

**The frontend HTML/CSS/JavaScript files in the `public/` folder work completely independently** and can be deployed to any static hosting service (Apache, Nginx, GitHub Pages, Netlify, etc.) without Node.js.

The Node.js server in the `server/` folder is **only needed if you want**:
- Contact form submissions to go to Odoo CRM
- Job application submissions to go to Odoo CRM  
- The subscriber portal functionality (demo portal for logged-in customers)

## Two Deployment Options

### Option 1: Static Site Only (No Node.js Required)

Deploy just the `public/` folder contents to any web server:

```bash
# Upload these files to your hosting:
public/
├── index.html
├── karriera.html
├── internet.html
├── (all other .html files)
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
└── biznesi/
```

**What works:**
- ✅ All pages load normally
- ✅ Navigation, animations, UI
- ✅ Client-side JavaScript
- ✅ Job application form UI (but submissions won't be sent to Odoo)
- ✅ Contact form UI (but submissions won't be sent to Odoo)

**What doesn't work:**
- ❌ Form submissions to Odoo (contact & karriera forms will show errors)
- ❌ Subscriber portal features (login, invoices, tickets, etc.)

### Option 2: Full Stack (Node.js + Static Files)

Run the Node.js server which:
1. Serves the static files from `public/`
2. Provides API endpoints for forms and subscriber portal

```bash
# Start the server:
npm install
npm start

# Server runs on http://localhost:4000
# Serves both static files AND API endpoints
```

**What works:**
- ✅ Everything from Option 1
- ✅ Contact form submissions → Odoo CRM
- ✅ Job application submissions → Odoo CRM  
- ✅ Subscriber portal (login, invoices, devices, tickets)

## Server Architecture (server/)

### Files

```
server/
├── server_subs.js       # Main Express.js server
├── odooClient.js        # Odoo API integration
├── data/
│   └── subscribers.json # Demo data for subscriber portal
└── README.md            # Server documentation
```

### server_subs.js

Express.js server that provides:

1. **Static File Serving** - Serves `public/` folder
2. **API Endpoints** - Handles form submissions and portal data
3. **Request Logging** - Colorized console logs
4. **Error Handling** - Consistent JSON error responses

Key endpoints:
- `POST /api/contact` - Contact form → Odoo lead
- `POST /api/careers/apply` - Job application → Odoo lead
- `POST /api/login` - Subscriber portal login
- `GET /api/overview` - Account overview (requires auth)
- `GET /api/devices` - Connected devices (requires auth)
- `GET /api/invoices` - Invoice history (requires auth)
- `GET /api/tickets` - Support tickets (requires auth)
- `POST /api/speedtest` - Speed test (requires auth)

### odooClient.js

Odoo JSON-RPC client with:

1. **Configuration Validation** - Checks required env vars on startup
2. **Error Handling** - Friendly error messages for common issues
3. **Timeout Handling** - 10-second request timeout
4. **Connection Error Detection** - Detects unreachable Odoo servers

### Environment Variables (.env)

Required for Odoo integration:

```env
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_UID=123
ODOO_PASS=your_password
PORT=4000
```

If these are not set, the server will:
- ✅ Still start and serve static files
- ✅ Still provide subscriber portal with demo data
- ❌ Return errors for contact/karriera form submissions

## Frontend JavaScript (public/assets/js/)

The frontend JavaScript files are **completely independent** and work without Node.js:

- `script.js` - Navigation, dropdowns, animations
- `karriera.js` - Job listings, application form
- `toast.js` - Toast notifications
- `stores.js` - Store locator map
- `speedtest.js` - Speed test UI
- etc.

**These files only make API calls if forms are submitted.** All other functionality (navigation, UI, animations) works without a backend.

### Form Submission Logic

When a user submits the karriera (job application) form:

```javascript
// From karriera.js
const resp = await fetch("/api/careers/apply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

**If no server is running:**
- Browser will show network error
- User sees error message in the UI
- But the page itself still works

**If server is running:**
- Request goes to Node.js server
- Server validates data
- Server sends to Odoo CRM
- User sees success/error message

## Data Flow

### Contact Form Flow

```
User fills form on website
    ↓
Frontend JS (no dependencies)
    ↓
POST /api/contact
    ↓
server_subs.js validates data
    ↓
odooClient.js sends to Odoo
    ↓
Odoo creates CRM lead
    ↓
Response sent back to user
```

### Karriera (Job Application) Flow

```
User fills application form
    ↓
Frontend JS validates file, email
    ↓
POST /api/careers/apply
    ↓
server_subs.js validates required fields
    ↓
odooClient.js calls create_from_api_job
    ↓
Odoo creates lead + sends email to b.njerezore@abissnet.al
    ↓
Success message shown to user
```

## Security & Production Readiness

### ✅ Implemented

- Input validation on all endpoints
- Error handling with user-friendly messages
- Timeout protection (10s for Odoo requests)
- Environment variable validation
- Colorized logging for debugging
- Consistent JSON error responses

### ⚠️ Needs Enhancement for Production

- **Authentication**: Demo token is hardcoded (`demo-token`)
  - Implement JWT or session-based auth
  - Add user database
  - Secure password hashing

- **Rate Limiting**: No rate limiting on public endpoints
  - Add rate limiting to prevent abuse
  - Especially for `/api/contact` and `/api/careers/apply`

- **CORS**: Currently allows all origins
  - Restrict to your domain only

- **HTTPS**: Use HTTPS in production
  - Never send credentials over HTTP

- **File Upload**: Job applications mention resume upload
  - Currently only filename is sent
  - Implement actual file upload to Odoo or S3

## How to Deploy

### Deploy Static Files Only (Easiest)

1. Upload `public/` folder to any web host
2. Configure web server (Apache/Nginx) to serve `.html` files
3. Done! Site works (except form submissions)

### Deploy with Node.js Backend

1. **Set up server** (VPS, cloud provider)
2. **Install Node.js 18+**
3. **Copy project files**
4. **Install dependencies**: `npm install`
5. **Configure .env** with Odoo credentials
6. **Start server**: `npm start`
7. **Use process manager** (pm2, systemd) to keep it running
8. **Set up reverse proxy** (Nginx) for HTTPS

Example Nginx config:

```nginx
server {
    listen 80;
    server_name abissnet.al;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Testing

### Test Static Site

```bash
# Option 1: Use any local server
python -m http.server 8000
# or
npx serve public

# Open http://localhost:8000
```

### Test Full Server

```bash
# Start Node.js server
npm start

# Test endpoints
curl http://localhost:4000/api/health
curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com"}'
```

## Summary

**Key Point**: The frontend (HTML/CSS/JS in `public/`) is completely independent and works without Node.js. The Node.js server is only needed for:
1. Form submissions to Odoo
2. Subscriber portal functionality

You can deploy the static files anywhere and add the Node.js backend later if needed.
