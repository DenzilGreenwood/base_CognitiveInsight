# Admin Management System

This document describes the admin management system that allows controlled creation of admin accounts with approval workflows.

## Features

### Admin Creation Control
- **Toggle admin creation on/off**: Administrators can enable or disable the ability to create new admin accounts
- **Admin user limits**: Set maximum number of admin accounts allowed
- **Approval workflow**: Option to require manual approval for new admin accounts
- **Request management**: View and process pending admin account requests

### Admin Settings Page
Located at `/admin/settings`, this page allows existing admins to:

1. **Control Admin Creation**
   - Enable/disable admin account creation
   - Set maximum number of admin users
   - Toggle approval requirements
   - Configure notification email

2. **Process Admin Requests**
   - View pending admin account requests
   - Approve requests (creates the account automatically)
   - Reject requests with optional reason
   - View request details (name, email, organization, role)

### Signup Flow

#### When Admin Creation is Enabled (No Approval Required)
1. User visits `/signup`
2. Fills out the admin signup form
3. Account is created immediately
4. User is redirected to login page with success message

#### When Admin Creation Requires Approval
1. User visits `/signup`
2. Fills out the admin signup form
3. Request is submitted for approval (no account created yet)
4. User is redirected to login page with pending message
5. Admin processes request in settings page
6. If approved, account is created with temporary password
7. Admin shares temporary password with new user

#### When Admin Creation is Disabled
1. User visits `/signup`
2. Form shows disabled state with explanation
3. Submit button is disabled
4. User is instructed to contact system administrator

## Database Structure

### Settings Collection (`settings/platform_settings`)
```typescript
{
  allowAdminCreation: boolean;
  maxAdminUsers: number;
  requireApproval: boolean;
  notificationEmail: string;
  lastUpdated: Date;
  updatedBy: string;
}
```

### Admin Requests Collection (`admin_requests/{id}`)
```typescript
{
  email: string;
  displayName: string;
  organization: string;
  requestedRole: 'regulator' | 'auditor' | 'ai_builder';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  reason?: string;
}
```

## Security Considerations

1. **Admin Verification**: Only users with 'regulator' role can access admin settings
2. **Temporary Passwords**: Generated passwords are shown only once and should be changed immediately
3. **Request Validation**: All admin requests are validated before processing
4. **Audit Trail**: All admin creation activities are logged with timestamps and user IDs

## Usage Instructions

### Setting Up Admin Creation
1. Navigate to `/admin/settings`
2. Configure your preferred settings:
   - Toggle "Allow Admin Creation" on
   - Set appropriate maximum admin user limit
   - Choose whether to require approval
   - Optionally set notification email
3. Click "Save Settings"

### Processing Admin Requests (When Approval is Required)
1. Navigate to `/admin/settings`
2. Scroll to "Pending Admin Requests" section
3. Review each request details
4. Click "Approve" to create the account or "Reject" to deny
5. For approved requests, copy the temporary password and share securely with the new admin
6. Instruct new admin to change password on first login

### Creating Admin Accounts (When No Approval Required)
1. Share the `/signup` link with the new admin
2. They fill out the form and submit
3. Account is created immediately
4. They can login at `/login`

## API Endpoints

### POST `/api/admin/create-admin`
Creates an admin account from an approved request.

**Request Body:**
```json
{
  "requestId": "string",
  "adminUid": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin account created successfully",
  "tempPassword": "string",
  "userId": "string"
}
```

## Files Modified/Created

### New Files
- `src/lib/settings-service.ts` - Settings and admin request management
- `src/app/admin/settings/page.tsx` - Admin settings interface
- `src/app/api/admin/create-admin/route.ts` - API for creating approved admin accounts
- `src/app/login/page.tsx` - Login page with status message support

### Modified Files
- `src/app/signup/page.tsx` - Added admin creation controls and approval workflow
- `src/app/admin/page.tsx` - Added settings section link

## Future Enhancements

1. **Email Notifications**: Send emails when admin requests are submitted/processed
2. **Password Reset**: Implement password reset functionality for admin accounts
3. **Role-Based Permissions**: More granular permissions beyond basic admin access
4. **Bulk Admin Operations**: Create/manage multiple admin accounts at once
5. **Admin Activity Logs**: Detailed logging of all admin actions

## Troubleshooting

### Common Issues
1. **"Admin creation disabled"**: Check admin settings to ensure creation is enabled
2. **"Maximum admins reached"**: Increase limit in settings or remove inactive admins
3. **"Request not found"**: Ensure the request hasn't already been processed
4. **Firebase errors**: Check Firebase configuration and permissions

### Support
For technical support or questions about the admin management system, contact your system administrator or development team.
