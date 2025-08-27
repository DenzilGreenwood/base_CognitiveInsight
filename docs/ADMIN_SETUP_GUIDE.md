# How to Set Up Admin Users

There are several ways to set up admin users in your Cognitive Insight platform, depending on your current situation.

## 🚀 Method 1: First Admin Setup (No existing admins)

If you don't have any admin users yet, use this method to create your first admin:

### Prerequisites
1. Make sure your Firebase project is set up and the app is running
2. Have your Firebase configuration ready

### Steps:

1. **Set up environment variables** (if not already done):
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Firebase configuration
   ```

2. **Run the first admin setup script**:
   ```bash
   node setup-first-admin.js
   ```

3. **Follow the prompts**:
   - Enter admin email
   - Enter password (minimum 6 characters)
   - Enter full name
   - Enter organization
   - Choose admin role:
     - **Regulator**: Full admin access (recommended for primary admin)
     - **Auditor**: Audit and review access
     - **AI Builder**: Platform configuration access

4. **Login to verify**:
   - Go to `http://localhost:9002/login`
   - Use the email and password you just created
   - You should be redirected to the admin dashboard

---

## 👤 Method 2: Promote Existing User (User already has account)

If someone already has a user account but needs admin privileges:

### Steps:

1. **Run the promote user script**:
   ```bash
   node make-user-admin.js
   ```

2. **Enter the user's email** when prompted

3. **Select their new admin role**:
   - Regulator (Full admin access)
   - Auditor (Audit and review access)
   - AI Builder (Platform configuration access)

4. **Confirm the change**

---

## 🌐 Method 3: Using the Web Interface (Existing admin required)

If you already have at least one admin user, you can create additional admins through the web interface:

### Steps:

1. **Login as an existing admin**:
   - Go to `http://localhost:9002/login`
   - Login with admin credentials

2. **Configure admin creation settings**:
   - Go to `http://localhost:9002/admin/settings`
   - Make sure "Allow Admin Creation" is enabled
   - Configure whether approval is required
   - Set maximum admin user limit if needed
   - Save settings

3. **Create new admin**:
   
   **Option A: Direct Creation (No approval required)**
   - Share the signup link: `http://localhost:9002/signup`
   - New admin fills out the form
   - Account is created immediately
   
   **Option B: Approval Workflow (Approval required)**
   - Share the signup link: `http://localhost:9002/signup`
   - New admin submits request
   - Existing admin reviews and approves at `/admin/settings`
   - System creates account and provides temporary password

---

## 🛠️ Method 4: Direct Database Edit (Advanced)

If you have direct access to your Firebase Firestore database:

### Steps:

1. **Find the user document** in the `users` collection
2. **Edit the user document** and change the `role` field to one of:
   - `regulator` (Full admin access)
   - `auditor` (Audit and review access)  
   - `ai_builder` (Platform configuration access)
3. **Update the `updatedAt` field** to the current timestamp

---

## 🔐 Admin Roles Explained

### Regulator
- **Access Level**: Full admin access
- **Permissions**: 
  - View and manage all admin sections
  - Access admin settings
  - Create/approve other admin accounts
  - Manage pilot requests and contact submissions
- **Best For**: Primary administrators, system owners

### Auditor
- **Access Level**: Audit and review access
- **Permissions**: 
  - View admin dashboard
  - Review pilot requests and contact submissions
  - Limited settings access
- **Best For**: Compliance officers, reviewers

### AI Builder
- **Access Level**: Platform configuration access
- **Permissions**: 
  - Access admin dashboard
  - Manage platform configuration
  - Technical administration
- **Best For**: Technical administrators, developers

---

## 🔍 Verifying Admin Access

After creating an admin user, verify they have proper access:

1. **Login Test**: Have them login at `/login`
2. **Admin Dashboard**: Verify they can access `/admin`
3. **Role-Specific Access**: Check they can access appropriate sections
4. **Settings Access**: Regulators should be able to access `/admin/settings`

---

## 🆘 Troubleshooting

### "No admin users found"
- Use Method 1 to create your first admin
- Check that the user's role is set correctly in the database

### "Email already in use" 
- Use Method 2 to promote the existing user
- Or use a different email address

### "Firebase configuration error"
- Check your `.env` file has correct Firebase settings
- Verify Firebase project is properly configured

### "Permission denied"
- Make sure the user has the correct role in Firestore
- Check that Firebase rules allow the operations

### User can login but can't access admin sections
- Verify the user's role in the Firestore `users` collection
- Check that the role is one of: `regulator`, `auditor`, `ai_builder`
- Use Method 2 to update their role if needed

---

## 📋 Quick Start Checklist

- [ ] Firebase project configured
- [ ] App running locally
- [ ] Environment variables set
- [ ] First admin created using Method 1
- [ ] Admin can login at `/login`
- [ ] Admin can access `/admin` dashboard
- [ ] Admin settings configured at `/admin/settings`
- [ ] Additional admins created as needed

---

## 🔒 Security Best Practices

1. **Use strong passwords** for admin accounts
2. **Limit the number of admin users** to only what's necessary
3. **Regularly review admin access** and remove unused accounts
4. **Use approval workflows** for new admin creation in production
5. **Monitor admin activity** through logs and audit trails
6. **Change default passwords** immediately after account creation
