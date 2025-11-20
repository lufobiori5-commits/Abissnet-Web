# Abissnet Backend Server

This is the Node.js backend server for the Abissnet website. It provides API endpoints for contact forms, job applications, and subscriber portal functionality.

## Features

- **Contact Form API** - Sends contact submissions to Odoo CRM
- **Job Application API** - Handles karriera (career) applications and forwards to HR
- **Subscriber Portal** - Manages subscriber data, invoices, devices, and tickets
- **Odoo Integration** - Connects to Odoo ERP for CRM lead management

## Prerequisites

- Node.js 18+ installed
- Access to an Odoo instance (for contact/karriera forms)
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env and fill in your Odoo credentials
```

3. Required environment variables in `.env`:
```env
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_UID=your_user_id
ODOO_PASS=your_password_or_api_key
PORT=4000
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:4000` (or the PORT specified in .env).

## API Endpoints

### Public Endpoints

- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, phone, city, subject, client_status, message }`
  - Returns: `{ success: true, lead_id }`

- `POST /api/careers/apply` - Submit job application
  - Body: `{ position_title, full_name, email, phone, message, resume_name }`
  - Returns: `{ success: true, lead_id }`

- `GET /api/health` - Health check endpoint
  - Returns: `{ status: "ok", timestamp, uptime }`

### Authenticated Endpoints

All subscriber portal endpoints require `Authorization: Bearer demo-token` header.

- `POST /api/login` - Login to subscriber portal
  - Body: `{ email, password }`
  - Demo credentials: `demo@abissnet.al` / `demo123`
  - Returns: `{ token: "demo-token" }`

- `GET /api/overview` - Get account overview
- `GET /api/devices` - Get connected devices
- `GET /api/invoices` - Get invoice history
- `GET /api/tickets` - Get support tickets
- `POST /api/tickets` - Create support ticket
- `POST /api/speedtest` - Run speed test
- `POST /api/upgrade` - Upgrade internet plan
- `POST /api/line-test` - Test line quality
- `POST /api/restart-cpe` - Restart CPE device

## Data Storage

Subscriber data is stored in `server/data/subscribers.json`. This file is automatically created on first run with demo data.

## Odoo Integration

The server integrates with Odoo for:

1. **Contact Forms** - Creates leads in `crm.lead` model via `create_from_api` method
2. **Job Applications** - Creates leads in `crm.lead` model via `create_from_api_job` method

### Required Odoo Setup

Your Odoo instance must have:
- The `crm` module installed
- Custom methods `create_from_api` and `create_from_api_job` on the `crm.lead` model
- Proper user permissions for the API user

See `ODOO_JOB_APPLICATION_SETUP.md` and `KARRIERA_EMAIL_SETUP.md` in the project root for Odoo configuration details.

## Logging

The server includes colorized logging for all requests and responses:
- Request method, path, and body
- Response status codes and duration
- Errors and warnings
- Odoo integration status

## Error Handling

- All endpoints return consistent JSON responses
- Validation errors return 400 status with Albanian error messages
- Server errors return 500 status with user-friendly messages
- Odoo connection errors are caught and logged with helpful messages

## Security Notes

- The current authentication is demo-only (`demo-token`)
- For production, implement proper JWT or session-based authentication
- Store Odoo credentials securely in environment variables
- Consider rate limiting for public endpoints
- Use HTTPS in production

## Troubleshooting

### Odoo connection errors

If you see "Cannot connect to Odoo server" errors:
1. Check that `ODOO_URL` is correct and accessible
2. Verify your Odoo instance is running
3. Ensure firewall allows connections to Odoo

### Missing environment variables

If you see "Odoo is not configured" warnings:
1. Ensure `.env` file exists in project root
2. Verify all required variables are set
3. Restart the server after changing `.env`

### Port already in use

If port 4000 is busy:
1. Change `PORT` in `.env` file
2. Or stop the process using port 4000

## Development

File structure:
```
server/
├── server_subs.js      # Main Express server
├── odooClient.js       # Odoo integration client
├── data/
│   └── subscribers.json # Subscriber data storage
└── README.md           # This file
```

## License

Copyright © 2025 Abissnet. All rights reserved.
