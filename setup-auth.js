const admin = require('firebase-admin');
const serviceAccount = require('./functions/src/service-account-key.json');

// Initialize admin SDK with service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'cognitiveinsight-j7xwb'
  });
}

async function setupAuthentication() {
  try {
    console.log('Setting up authentication...');
    
    // Create the demo user if it doesn't exist
    const email = 'demo@cognitiveinsight.app';
    const password = 'demo123456';
    
    try {
      // Try to get the user first
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('Demo user already exists:', userRecord.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create the demo user
        const userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: 'Demo User',
          emailVerified: true
        });
        console.log('Created demo user:', userRecord.uid);
      } else {
        throw error;
      }
    }
    
    console.log('Authentication setup complete!');
    console.log('Demo credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error setting up authentication:', error);
  }
}

setupAuthentication();
