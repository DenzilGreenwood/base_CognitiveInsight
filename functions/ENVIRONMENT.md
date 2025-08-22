# Firebase Functions Environment Variables

This document describes the environment variables required for the Firebase Functions to work properly.

## Required Environment Variables

### SendGrid Configuration
- `SENDGRID_API`: Your SendGrid API key stored as a Firebase secret
- `SENDGRID_FROM_EMAIL`: The verified sender email address in SendGrid (e.g., "no-reply@yourdomain.com")

### Notification Settings
- `NOTIFY_TO`: Email address to receive lead notifications (e.g., "admin@yourdomain.com")

## Setting Environment Variables

You can set these environment variables using the Firebase CLI:

```bash
# Set SendGrid API key as a secret (recommended)
firebase functions:secrets:set SENDGRID_API

# Set the from email address as environment config
firebase functions:config:set sendgrid.from_email="no-reply@yourdomain.com"

# Set notification email
firebase functions:config:set notify.to="admin@yourdomain.com"
```

**Note:** The `SENDGRID_API` is now stored as a Firebase secret for better security, while other configuration values use the traditional config method.

Or you can create a `.env` file in the functions directory for local development:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=no-reply@yourdomain.com
NOTIFY_TO=admin@yourdomain.com
```

## SendGrid Setup

1. Create a SendGrid account at https://sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Verify your sender email address or domain
4. Use the verified email as your `SENDGRID_FROM_EMAIL`

## Function Endpoints

- `POST /api/leads` - Submit a new lead
- `onLeadCreate` - Firestore trigger that sends emails when a lead is created

## Lead Form Fields

The lead form accepts the following fields:
- `name` (required): Lead's name
- `email` (required): Lead's email address
- `company` (optional): Lead's company
- `notes` (optional): Additional notes
- `source` (optional): Lead source/referrer
