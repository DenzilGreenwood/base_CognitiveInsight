/**
 * First Admin Setup Script
 * 
 * This script helps you create your first admin user when you don't have any existing admins.
 * Run this script once to bootstrap your admin system.
 * 
 * Usage: node setup-first-admin.js
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp as initializeAdminApp, cert, getApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import readline from 'readline';

// Load environment variables
config();

// Firebase config - using the same config as your Next.js app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

// Debug: Check if config is loaded
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase configuration not loaded properly!');
  console.log('Make sure you have a .env file with your Firebase configuration.');
  console.log('Expected variables: NEXT_PUBLIC_FIREBASE_API_KEY, etc.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Admin for setting custom claims
function initializeAdminSDK() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64;
    
    if (privateKey?.includes("BEGIN PRIVATE KEY") === false && process.env.FIREBASE_PRIVATE_KEY_BASE64) {
      privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
    }
    
    if (privateKey?.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    
    if (!projectId || !clientEmail || !privateKey) {
      console.warn('⚠️  Firebase Admin SDK not configured - custom claims will not be set');
      return null;
    }
    
    try {
      const adminApp = initializeAdminApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId
      });
      return getAdminAuth(adminApp);
    } catch (error) {
      console.warn('⚠️  Firebase Admin SDK initialization failed:', error.message);
      return null;
    }
  }
}

const adminAuth = initializeAdminSDK();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createFirstAdmin() {
  console.log('🚀 First Admin Setup');
  console.log('===================');
  console.log('This script will create your first admin user for the Cognitive Insight platform.\n');

  try {
    // Collect admin details
    const email = await question('Admin Email: ');
    const password = await question('Admin Password (min 6 characters): ');
    const displayName = await question('Full Name: ');
    const organization = await question('Organization: ');
    
    console.log('\nThis will create an Owner Admin account (system admin with full control)');
    
    const role = 'owner_admin';

    console.log('\n📝 Creating admin user...');

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      organization: organization,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: user.emailVerified,
      isActive: true
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Set Firebase Auth custom claims if Admin SDK is available
    if (adminAuth) {
      try {
        await adminAuth.setCustomUserClaims(user.uid, {
          admin: true,
          role: role
        });
        console.log('✅ Custom claims set successfully');
      } catch (error) {
        console.warn('⚠️  Failed to set custom claims:', error.message);
        console.log('   User created successfully but may need to re-login to get full admin access');
      }
    } else {
      console.log('⚠️  Custom claims not set - Firebase Admin SDK not configured');
      console.log('   User created successfully but may need custom claims set manually');
    }

    // Set default platform settings - disable admin creation after creating owner_admin
    const defaultSettings = {
      id: 'platform_settings',
      allowAdminCreation: false, // Disabled for security after creating first owner_admin
      maxAdminUsers: 10,
      requireApproval: false,
      notificationEmail: email,
      lastUpdated: new Date(),
      updatedBy: user.uid
    };

    await setDoc(doc(db, 'settings', 'platform_settings'), defaultSettings);

    console.log('\n✅ First admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Name:', displayName);
    console.log('🏢 Organization:', organization);
    console.log('👑 Role:', role);
    console.log('🆔 User ID:', user.uid);
    console.log('\n🔒 Security: Admin creation has been disabled for security.');
    console.log('   Only the owner_admin can re-enable it in admin settings if needed.');
    console.log('\n🌐 You can now login at: http://localhost:9002/login');
    console.log('⚙️  Admin settings: http://localhost:9002/admin/settings');
    console.log('\n🔒 Make sure to verify your email and change your password if needed.');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 The email is already in use. You can either:');
      console.log('   1. Use a different email address');
      console.log('   2. Use Method 2 below to make an existing user an admin');
    }
  } finally {
    rl.close();
  }
}

// Run the setup
createFirstAdmin();
