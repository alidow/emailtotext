/**
 * Automated GA4 Configuration using Admin API
 * This script configures all events, conversions, and custom dimensions
 * 
 * Prerequisites:
 * 1. Enable Google Analytics Admin API: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com
 * 2. Create service account: https://console.cloud.google.com/iam-admin/serviceaccounts
 * 3. Download credentials JSON and save as ga4-credentials.json
 * 4. Grant service account "Editor" access in GA4 property settings
 * 
 * Usage: npm install @google-analytics/admin && npx tsx scripts/setup-ga4-config.ts
 */

const { AnalyticsAdminServiceClient } = require('@google-analytics/admin');
const fs = require('fs');
const path = require('path');

// Configuration
const GA4_PROPERTY_ID = '269480984'; // Your GA4 property ID
const ACCOUNT_ID = '223143062'; // Your GA4 account ID

// Events to mark as conversions
const CONVERSION_EVENTS = [
  'account_created',
  'phone_verified',
  'payment_completed',
  'start_flow_initiated', // optional but recommended
];

// Custom dimensions to create
const CUSTOM_DIMENSIONS = [
  {
    parameterName: 'method',
    displayName: 'Signup Method',
    description: 'How user created account (email/google)',
    scope: 'EVENT' as const,
  },
  {
    parameterName: 'phone',
    displayName: 'Phone Number (Hashed)',
    description: 'User phone number - should be hashed for privacy',
    scope: 'USER' as const,
  },
  {
    parameterName: 'plan',
    displayName: 'Subscription Plan',
    description: 'Selected subscription plan',
    scope: 'EVENT' as const,
  },
  {
    parameterName: 'error',
    displayName: 'Error Message',
    description: 'Error details for debugging',
    scope: 'EVENT' as const,
  },
  {
    parameterName: 'step',
    displayName: 'Error Step',
    description: 'Where in flow error occurred',
    scope: 'EVENT' as const,
  },
  {
    parameterName: 'button',
    displayName: 'Button Clicked',
    description: 'Which CTA button was clicked',
    scope: 'EVENT' as const,
  },
  {
    parameterName: 'page_location',
    displayName: 'Page Location',
    description: 'URL or page identifier',
    scope: 'EVENT' as const,
  },
];

// Custom events to create (if they don't exist)
const CUSTOM_EVENTS = [
  {
    eventName: 'account_created',
    displayName: 'Account Created',
    description: 'User successfully created an account',
  },
  {
    eventName: 'phone_code_sent',
    displayName: 'Phone Code Sent',
    description: 'Verification code sent to phone',
  },
  {
    eventName: 'phone_verified',
    displayName: 'Phone Verified',
    description: 'User successfully verified phone number',
  },
  {
    eventName: 'plan_selected',
    displayName: 'Plan Selected',
    description: 'User selected a subscription plan',
  },
  {
    eventName: 'payment_initiated',
    displayName: 'Payment Initiated',
    description: 'User started payment process',
  },
  {
    eventName: 'payment_completed',
    displayName: 'Payment Completed',
    description: 'Payment successfully processed',
  },
  {
    eventName: 'verification_error',
    displayName: 'Verification Error',
    description: 'Phone verification failed',
  },
  {
    eventName: 'start_flow_initiated',
    displayName: 'Start Flow Initiated',
    description: 'User clicked Get Started',
  },
];

async function setupGA4() {
  console.log('🚀 Starting GA4 Configuration...\n');

  try {
    // Initialize the client using Application Default Credentials
    // This will use your gcloud auth or service account impersonation
    let adminClient;
    
    try {
      // Try to use Application Default Credentials (gcloud auth)
      adminClient = new AnalyticsAdminServiceClient({
        projectId: 'dulcet-aileron-468217-a7'
      });
      console.log('✅ Using Application Default Credentials\n');
    } catch (error) {
      console.log('📝 Authentication Instructions:');
      console.log('Since service account keys are disabled, use one of these methods:\n');
      console.log('Method 1: Use gcloud CLI');
      console.log('1. Install gcloud: https://cloud.google.com/sdk/docs/install');
      console.log('2. Run: gcloud auth application-default login');
      console.log('3. Run this script again\n');
      console.log('Method 2: Use service account impersonation');
      console.log('1. Run: gcloud auth application-default login --impersonate-service-account=emailtotextnotify@dulcet-aileron-468217-a7.iam.gserviceaccount.com');
      console.log('2. Run this script again\n');
      console.log('Note: Make sure emailtotextnotify@dulcet-aileron-468217-a7.iam.gserviceaccount.com has Editor access in GA4');
      return;
    }

    const propertyName = `properties/${GA4_PROPERTY_ID}`;

    // Step 1: Create Custom Dimensions
    console.log('📊 Creating Custom Dimensions...');
    for (const dimension of CUSTOM_DIMENSIONS) {
      try {
        const [response] = await adminClient.createCustomDimension({
          parent: propertyName,
          customDimension: {
            parameterName: dimension.parameterName,
            displayName: dimension.displayName,
            description: dimension.description,
            scope: dimension.scope,
          },
        });
        console.log(`✅ Created dimension: ${dimension.displayName}`);
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️  Dimension already exists: ${dimension.displayName}`);
        } else {
          console.error(`❌ Error creating dimension ${dimension.displayName}:`, error.message);
        }
      }
    }

    // Step 2: Mark Events as Conversions
    console.log('\n🎯 Marking Events as Conversions...');
    
    // First, get all conversion events
    const [conversions] = await adminClient.listConversionEvents({
      parent: propertyName,
    });

    const existingConversions = new Set(
      conversions.map(c => c.eventName)
    );

    for (const eventName of CONVERSION_EVENTS) {
      if (existingConversions.has(eventName)) {
        console.log(`⏭️  Already a conversion: ${eventName}`);
      } else {
        try {
          await adminClient.createConversionEvent({
            parent: propertyName,
            conversionEvent: {
              eventName: eventName,
            },
          });
          console.log(`✅ Marked as conversion: ${eventName}`);
        } catch (error: any) {
          console.error(`❌ Error marking ${eventName} as conversion:`, error.message);
        }
      }
    }

    // Step 3: List current configuration
    console.log('\n📋 Current Configuration Summary:');
    
    // List all custom dimensions
    const [dimensions] = await adminClient.listCustomDimensions({
      parent: propertyName,
    });
    
    console.log('\nCustom Dimensions:');
    dimensions.forEach(dim => {
      console.log(`  - ${dim.displayName} (${dim.parameterName})`);
    });

    // List all conversion events
    const [finalConversions] = await adminClient.listConversionEvents({
      parent: propertyName,
    });
    
    console.log('\nConversion Events:');
    finalConversions.forEach(conv => {
      console.log(`  - ${conv.eventName}`);
    });

    console.log('\n✨ GA4 Configuration Complete!');
    console.log('\n📊 Next Steps:');
    console.log('1. Go to GA4 Realtime reports to verify events');
    console.log('2. Create audiences based on these events');
    console.log('3. Set up custom reports using the dimensions');
    console.log('4. Import conversions to Google Ads if needed');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Create a package.json install helper
const packageJsonContent = {
  scripts: {
    "setup-ga4": "tsx scripts/setup-ga4-config.ts"
  },
  dependencies: {
    "@google-analytics/admin": "^1.0.0",
    "@google-analytics/data": "^4.0.0",
    "tsx": "^4.0.0"
  }
};

// Check if required packages are installed
try {
  require('@google-analytics/admin');
} catch {
  console.log('📦 Installing required packages...');
  console.log('Run: npm install @google-analytics/admin @google-analytics/data');
  console.log('\nOr add to package.json:');
  console.log(JSON.stringify(packageJsonContent, null, 2));
  process.exit(1);
}

// Run the setup
setupGA4().catch(console.error);