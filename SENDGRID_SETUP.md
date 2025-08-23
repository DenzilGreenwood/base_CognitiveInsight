# SendGrid Email Setup

This project uses SendGrid for sending transactional emails like early access confirmations and admin notifications.

## Setup Instructions

### 1. Create SendGrid Account
- Sign up at [sendgrid.com](https://sendgrid.com)
- Verify your account and domain

### 2. Get API Key
- Go to Settings > API Keys in SendGrid dashboard
- Create a new API key with "Mail Send" permissions
- Copy the API key (you'll only see it once)

### 3. Verify Sender Identity
- Go to Settings > Sender Authentication
- Verify a single sender email OR authenticate your domain
- This email will be used as the "from" address

### 4. Configure Environment Variables
Add these to your `.env.local` file:

```bash
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=no-reply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### 5. Test the Setup
Run the test script to verify everything works:

```bash
# Load environment variables and test
source sendgrid.env  # if using the env file
npm run test:sendgrid
```

Or test manually:
```bash
node test-sendgrid.js
```

## API Endpoints

### Enhanced Early Access Route
- **Path**: `/api/early-access-sendgrid`
- **Features**: 
  - Stores submission in Firestore
  - Sends confirmation email to user
  - Sends notification email to admin
  - Rate limiting and validation

### Current Early Access Route
- **Path**: `/api/early-access`
- **Features**: Basic Firestore storage without emails

## Email Templates

The system sends two types of emails:

1. **User Confirmation**: Professional welcome email with next steps
2. **Admin Notification**: Formatted table with submission details

Both templates are mobile-responsive and include proper branding.

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your API key
2. **403 Forbidden**: Verify sender email is authenticated
3. **Rate Limiting**: SendGrid has sending limits on free plans
4. **Email not delivered**: Check spam folder, verify recipient email

### Testing in Development

Use the test script with different email addresses to verify:
- Email delivery
- Template rendering
- Error handling

### Production Considerations

- Use a verified domain for better deliverability
- Set up dedicated IP if sending high volume
- Monitor SendGrid analytics for bounce rates
- Implement webhook handlers for delivery events

## Integration Examples

The SendGrid integration is already set up in:
- Firebase Functions (`functions/src/leads.ts`)
- Next.js API route (`src/app/api/early-access-sendgrid/route.ts`)

Choose the approach that fits your deployment strategy.
