// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('🔍 Environment check:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET (' + process.env.SENDGRID_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'NOT SET');
console.log('TEST_EMAIL:', process.env.TEST_EMAIL || 'NOT SET');
console.log('');

// Check if API key is configured
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY environment variable is not set');
  console.log('Please set it in your .env.local file or load from sendgrid.env');
  process.exit(1);
}

// Set API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Uncomment the line below if you are sending mail using a regional EU subuser
// sgMail.setDataResidency('eu'); 

// Update these email addresses for testing
const testConfig = {
  to: process.env.TEST_EMAIL || 'test@example.com', // Change to your test recipient
  from: process.env.SENDGRID_FROM_EMAIL || 'test@example.com', // Must be verified sender
};

console.log('🧪 Testing SendGrid configuration...');
console.log(`📧 From: ${testConfig.from}`);
console.log(`📧 To: ${testConfig.to}`);

const msg = {
  to: testConfig.to,
  from: testConfig.from,
  subject: 'SendGrid Test - Cognitive Insight™',
  text: 'This is a test email from your Cognitive Insight application. SendGrid is working correctly!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4F46E5;">SendGrid Test Email</h2>
      <p>This is a test email from your <strong>Cognitive Insight™</strong> application.</p>
      <p>✅ SendGrid is configured correctly and working!</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #F3F4F6; border-radius: 8px;">
        <p style="margin: 0; color: #374151;">
          <strong>Test Details:</strong><br>
          Sent: ${new Date().toISOString()}<br>
          From: ${testConfig.from}<br>
          To: ${testConfig.to}
        </p>
      </div>
      <p>You can now use SendGrid in your application for:</p>
      <ul>
        <li>Early access confirmation emails</li>
        <li>Admin notifications</li>
        <li>Other transactional emails</li>
      </ul>
    </div>
  `,
};

console.log('📤 Sending test email...');

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox (and spam folder) for the test email');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error.message);
    
    if (error.response) {
      console.error('📋 Response details:', {
        statusCode: error.response.statusCode,
        body: JSON.stringify(error.response.body, null, 2)
      });
      
      // Common error messages
      if (error.response.statusCode === 401) {
        console.log('💡 Tip: Check your SENDGRID_API_KEY is correct');
      } else if (error.response.statusCode === 403) {
        console.log('💡 Tip: Make sure your "from" email is verified in SendGrid');
        console.log('🔗 Verify sender: https://app.sendgrid.com/settings/sender_auth/senders');
      }
    }
    
    console.log('🔍 Full error object:', JSON.stringify(error, null, 2));
  });
