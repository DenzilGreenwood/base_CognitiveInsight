# 🚀 Quick Start: Set Up Your First Admin

Follow these steps to set up your first admin user in the Cognitive Insight platform.

## Step 1: Set Up Environment Variables

1. **Copy the environment template**:
   ```bash
   copy .env.example .env
   ```

2. **Get your Firebase configuration**:
   - Go to your [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click the gear icon → Project settings
   - Scroll down to "Your apps" section
   - Click on your web app or create one if you don't have it
   - Copy the config values

3. **Edit the .env file** with your Firebase values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Step 2: Create Your First Admin

**Option A: Using the setup script (Recommended)**
```bash
npm run setup:first-admin
```

**Option B: Manual command**
```bash
node setup-first-admin.js
```

Follow the prompts:
- Enter your email address
- Create a secure password (min 6 characters)
- Enter your full name
- Enter your organization name
- Choose role (recommend "1" for Regulator = full admin access)

## Step 3: Test Your Admin Access

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Login to admin panel**:
   - Go to: http://localhost:9002/login
   - Use the email and password you just created
   - You should be redirected to the admin dashboard

3. **Access admin settings**:
   - Go to: http://localhost:9002/admin/settings
   - Configure admin creation settings as needed

## Step 4: Create Additional Admins (Optional)

Once you have your first admin set up, you can create additional admins through the web interface:

1. **Configure settings**: Go to `/admin/settings` and enable admin creation
2. **Share signup link**: Send `/signup` to new admins
3. **Approve if needed**: Process requests in admin settings if approval is required

---

## 🆘 Troubleshooting

### "Firebase configuration error"
- Check that your `.env` file exists and has correct values
- Make sure all NEXT_PUBLIC_ variables are set
- Verify your Firebase project is active

### "Email already in use"
- The email might already have an account
- Use the promote existing user script instead:
  ```bash
  npm run setup:make-admin
  ```

### "Permission denied"
- Check your Firebase rules allow user creation
- Ensure your Firebase project has Authentication enabled
- Verify Email/Password sign-in is enabled in Firebase Auth

### Script won't run
- Make sure you're in the project directory
- Install dependencies: `npm install`
- Check Node.js version (should be 18+)

---

## 🎯 What's Next?

After setting up your first admin:

1. **Configure platform settings** at `/admin/settings`
2. **Set up additional admins** as needed
3. **Test the pilot request flow** at `/pilot-request`
4. **Test the contact form** at `/contact`
5. **Review submissions** in the admin dashboard

---

## 📞 Need Help?

If you encounter issues:
1. Check the detailed guide: `docs/ADMIN_SETUP_GUIDE.md`
2. Review the admin management docs: `docs/ADMIN_MANAGEMENT.md`
3. Check Firebase console for any authentication errors
4. Verify your environment variables are set correctly
