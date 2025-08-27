/**
 * Make Existing User Admin Script
 * 
 * This script promotes an existing user to admin status.
 * Useful when you have a user account but need to give them admin privileges.
 * 
 * Usage: node make-user-admin.js
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

async function findUserByEmail(email) {
  const usersCollection = collection(db, 'users');
  const userQuery = query(usersCollection, where('email', '==', email));
  const querySnapshot = await getDocs(userQuery);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return querySnapshot.docs[0].data();
}

async function makeUserAdmin() {
  console.log('👑 Make Existing User Admin');
  console.log('===========================');
  console.log('This script will promote an existing user to admin status.\n');

  try {
    // Get user email
    const email = await question('User Email to make admin: ');
    
    // Find user
    console.log('\n🔍 Searching for user...');
    const user = await findUserByEmail(email);
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      console.log('\n💡 Make sure the user has signed up first, or use the first-admin script.');
      return;
    }

    console.log('\n📄 User found:');
    console.log('👤 Name:', user.displayName);
    console.log('🏢 Organization:', user.organization);
    console.log('📧 Email:', user.email);
    console.log('🔄 Current Role:', user.role);
    
    console.log('\nThis will promote the user to Owner Admin (system admin with full control)');
    
    const newRole = 'owner_admin';

    const confirm = await question(`\n⚠️  Confirm: Make ${user.displayName} a ${newRole}? (yes/no): `);
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log('\n📝 Updating user role...');

    // Update user profile
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      role: newRole,
      updatedAt: new Date()
    }, { merge: true });

    // Set Firebase Auth custom claims if Admin SDK is available
    if (adminAuth) {
      try {
        await adminAuth.setCustomUserClaims(user.uid, {
          admin: true,
          role: newRole
        });
        console.log('✅ Custom claims set successfully');
      } catch (error) {
        console.warn('⚠️  Failed to set custom claims:', error.message);
        console.log('   User role updated but may need to re-login to get full admin access');
      }
    } else {
      console.log('⚠️  Custom claims not set - Firebase Admin SDK not configured');
      console.log('   User role updated but may need custom claims set manually');
    }

    // If promoting to owner_admin, disable admin creation for security
    if (newRole === 'owner_admin') {
      try {
        const settingsDoc = doc(db, 'settings', 'platform_settings');
        await setDoc(settingsDoc, {
          allowAdminCreation: false,
          lastUpdated: new Date(),
          updatedBy: user.uid
        }, { merge: true });
        console.log('🔒 Admin creation disabled for security after promoting to owner_admin');
      } catch (error) {
        console.warn('⚠️  Failed to disable admin creation:', error.message);
      }
    }

    console.log('\n✅ User promoted to admin successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.displayName);
    console.log('👑 New Role:', newRole);
    
    if (newRole === 'owner_admin') {
      console.log('\n🔒 Security: Admin creation has been disabled.');
      console.log('   Only owner_admin can re-enable it in admin settings if needed.');
    }
    
    console.log('\n🌐 They can now access admin features at: http://localhost:9002/admin');

  } catch (error) {
    console.error('\n❌ Error updating user:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
makeUserAdmin();
