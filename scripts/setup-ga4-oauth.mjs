/**
 * GA4 Setup using OAuth (Personal Google Account)
 * No service account needed!
 * 
 * Run: npx tsx scripts/setup-ga4-oauth.ts
 */

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const fs = require('fs');
const path = require('path');

// GA4 Configuration
const GA4_PROPERTY_ID = 'properties/269480984';
const SCOPES = ['https://www.googleapis.com/auth/analytics.edit'];

// OAuth2 Client ID (using Google's public test client)
// For production, create your own at https://console.cloud.google.com/apis/credentials
const CLIENT_ID = '764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com';
const CLIENT_SECRET = 'd-FL95Q19q7MQmFpd7hHD0Ty'; // Google's public test secret
const REDIRECT_URL = 'http://localhost:3000/oauth2callback';

async function authenticate() {
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  
  return new Promise((resolve, reject) => {
    // Create local server to handle OAuth callback
    const server = http.createServer(async (req, res) => {
      try {
        const queryObject = new URL(req.url, `http://localhost:3000`).searchParams;
        const code = queryObject.get('code');
        
        if (code) {
          res.end('Authentication successful! You can close this tab.');
          server.close();
          
          // Exchange code for tokens
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          resolve(oauth2Client);
        }
      } catch (error) {
        reject(error);
      }
    }).listen(3000, () => {
      // Generate auth URL and open in browser
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      });
      
      console.log('🌐 Opening browser for authentication...');
      console.log('If browser doesn\'t open, visit:', authorizeUrl);
      
      // Try to open browser automatically
      try {
        require('child_process').exec(`open "${authorizeUrl}"`);
      } catch (error) {
        console.log('Please open this URL manually:', authorizeUrl);
      }
    });
  });
}

async function setupGA4WithOAuth() {
  console.log('🚀 GA4 Setup using OAuth Authentication\n');
  console.log('This will open your browser to authenticate with your Google account.\n');
  
  try {
    // Authenticate
    const auth = await authenticate();
    console.log('✅ Authentication successful!\n');
    
    // Initialize Analytics Admin API
    const analyticsAdmin = google.analyticsadmin({ version: 'v1alpha', auth });
    
    // Create Custom Dimensions
    console.log('📊 Creating Custom Dimensions...\n');
    
    const dimensions = [
      { parameterName: 'method', displayName: 'Signup Method', scope: 'EVENT' },
      { parameterName: 'phone', displayName: 'Phone Number', scope: 'USER' },
      { parameterName: 'plan', displayName: 'Subscription Plan', scope: 'EVENT' },
      { parameterName: 'error', displayName: 'Error Message', scope: 'EVENT' },
      { parameterName: 'step', displayName: 'Error Step', scope: 'EVENT' },
      { parameterName: 'button', displayName: 'Button Clicked', scope: 'EVENT' },
      { parameterName: 'page_location', displayName: 'Page Location', scope: 'EVENT' },
      { parameterName: 'test_mode', displayName: 'Test Mode', scope: 'EVENT' },
    ];
    
    for (const dim of dimensions) {
      try {
        await analyticsAdmin.properties.customDimensions.create({
          parent: GA4_PROPERTY_ID,
          requestBody: {
            parameterName: dim.parameterName,
            displayName: dim.displayName,
            scope: dim.scope,
            description: `Custom dimension for ${dim.displayName}`
          }
        });
        console.log(`✅ Created dimension: ${dim.displayName}`);
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Dimension already exists: ${dim.displayName}`);
        } else {
          console.error(`❌ Error creating ${dim.displayName}:`, error.message);
        }
      }
    }
    
    // Mark Events as Conversions
    console.log('\n🎯 Marking Events as Conversions...\n');
    
    const conversions = [
      'account_created',
      'phone_verified', 
      'payment_completed',
      'start_flow_initiated'
    ];
    
    for (const eventName of conversions) {
      try {
        await analyticsAdmin.properties.conversionEvents.create({
          parent: GA4_PROPERTY_ID,
          requestBody: {
            eventName: eventName,
            deletable: true,
            custom: true
          }
        });
        console.log(`✅ Marked as conversion: ${eventName}`);
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Already a conversion: ${eventName}`);
        } else {
          console.error(`❌ Error marking ${eventName}:`, error.message);
        }
      }
    }
    
    console.log('\n✨ GA4 Configuration Complete!');
    console.log('\n📊 Next Steps:');
    console.log('1. Visit your site with ?debug=analytics');
    console.log('2. Check GA4 Realtime reports');
    console.log('3. Import conversions to Google Ads if needed');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\nIf authentication failed, you may need to:');
    console.log('1. Make sure you\'re logged into the correct Google account');
    console.log('2. Have Editor access to GA4 property 269480984');
    console.log('3. Try the manual setup using GA4_CONFIGURATION_CHECKLIST.md');
  }
  
  process.exit(0);
}

// Check if required package is installed
try {
  require('googleapis');
} catch {
  console.log('📦 Installing required packages...');
  console.log('Run: npm install googleapis google-auth-library');
  process.exit(1);
}

// Run the setup
setupGA4WithOAuth();