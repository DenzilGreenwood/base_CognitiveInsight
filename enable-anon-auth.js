const admin = require('firebase-admin');

// Initialize admin SDK with your service account
const serviceAccount = require('./functions/src/cognitiveinsight-j7xwb-firebase-adminsdk-yfbrw-bf3e2c2fc6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cognitiveinsight-j7xwb'
});

async function enableAnonymousAuth() {
  try {
    // Get the current auth configuration
    const auth = admin.auth();
    
    // Enable anonymous authentication by updating project config
    // Note: This requires the Firebase Admin SDK and proper permissions
    console.log('Attempting to enable anonymous authentication...');
    
    // The Admin SDK doesn't directly support enabling/disabling auth providers
    // This needs to be done through the Firebase Console or REST API
    console.log('Anonymous authentication must be enabled through the Firebase Console:');
    console.log('1. Go to https://console.firebase.google.com/project/cognitiveinsight-j7xwb/authentication/providers');
    console.log('2. Click on "Anonymous" provider');
    console.log('3. Toggle "Enable" and save');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

enableAnonymousAuth();
