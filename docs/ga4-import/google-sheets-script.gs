/**
 * Google Sheets Script for GA4 Bulk Configuration
 * 
 * Setup:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Click Save and Run > setupGA4
 * 5. Authorize the script
 */

const GA4_PROPERTY_ID = '269480984';
const GA4_ACCOUNT_ID = '223143062';

// Events to configure
const EVENTS_CONFIG = [
  ['Event Name', 'Mark as Conversion', 'Value', 'Description'],
  ['account_created', 'YES', '2.0', 'User successfully created an account'],
  ['phone_verified', 'YES', '5.0', 'User successfully verified phone number'],
  ['payment_completed', 'YES', 'Variable', 'Payment successfully processed'],
  ['start_flow_initiated', 'YES', '3.0', 'User clicked Get Started'],
  ['phone_code_sent', 'YES', '4.0', 'Verification code sent'],
  ['plan_selected', 'NO', '-', 'User selected a plan'],
  ['payment_initiated', 'NO', '-', 'User started payment'],
  ['verification_error', 'NO', '-', 'Verification failed'],
  ['start_page_view', 'NO', '-', 'Viewed start page'],
  ['start_account_view', 'NO', '1.0', 'Viewed account page'],
  ['start_verify_view', 'NO', '-', 'Viewed verify page'],
  ['start_plan_view', 'NO', '-', 'Viewed plan page'],
  ['start_payment_view', 'NO', '-', 'Viewed payment page'],
];

// Custom dimensions to create
const DIMENSIONS_CONFIG = [
  ['Display Name', 'Scope', 'Parameter Name', 'Description'],
  ['Signup Method', 'EVENT', 'method', 'How user created account'],
  ['Phone Number', 'USER', 'phone', 'User phone (hashed)'],
  ['Subscription Plan', 'EVENT', 'plan', 'Selected plan'],
  ['Error Message', 'EVENT', 'error', 'Error details'],
  ['Error Step', 'EVENT', 'step', 'Where error occurred'],
  ['Button Clicked', 'EVENT', 'button', 'Which CTA clicked'],
  ['Page Location', 'EVENT', 'page_location', 'Page URL'],
  ['Test Mode', 'EVENT', 'test_mode', 'Is test mode'],
];

function setupGA4() {
  const spreadsheet = SpreadsheetApp.create('GA4 Configuration - Email to Text');
  
  // Create Events sheet
  const eventsSheet = spreadsheet.getActiveSheet();
  eventsSheet.setName('Events Configuration');
  eventsSheet.getRange(1, 1, EVENTS_CONFIG.length, 4).setValues(EVENTS_CONFIG);
  eventsSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  
  // Highlight conversions
  for (let i = 2; i <= EVENTS_CONFIG.length; i++) {
    if (eventsSheet.getRange(i, 2).getValue() === 'YES') {
      eventsSheet.getRange(i, 1, 1, 4).setBackground('#e8f5e9');
    }
  }
  
  // Create Dimensions sheet
  const dimensionsSheet = spreadsheet.insertSheet('Custom Dimensions');
  dimensionsSheet.getRange(1, 1, DIMENSIONS_CONFIG.length, 4).setValues(DIMENSIONS_CONFIG);
  dimensionsSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  
  // Create Instructions sheet
  const instructionsSheet = spreadsheet.insertSheet('Setup Instructions');
  const instructions = [
    ['GA4 Configuration Instructions', '', ''],
    ['', '', ''],
    ['Step 1: Configure Events', '', ''],
    ['1. Go to GA4 Admin > Events', '', ''],
    ['2. For each event marked YES in Events Configuration sheet:', '', ''],
    ['   - Find the event in the list', '', ''],
    ['   - Toggle "Mark as conversion"', '', ''],
    ['', '', ''],
    ['Step 2: Create Custom Dimensions', '', ''],
    ['1. Go to GA4 Admin > Custom definitions', '', ''],
    ['2. Click "Create custom dimension"', '', ''],
    ['3. For each row in Custom Dimensions sheet:', '', ''],
    ['   - Enter the Display Name', '', ''],
    ['   - Select the Scope', '', ''],
    ['   - Enter the Event parameter', '', ''],
    ['   - Add the Description', '', ''],
    ['', '', ''],
    ['Step 3: Import to Google Ads (if using)', '', ''],
    ['1. Go to Google Ads > Tools > Conversions', '', ''],
    ['2. Click + Conversion > Import > Google Analytics 4', '', ''],
    ['3. Select these events:', '', ''],
    ['   - account_created', '', ''],
    ['   - phone_verified', '', ''],
    ['   - payment_completed', '', ''],
    ['', '', ''],
    ['Property Details:', '', ''],
    ['GA4 Property ID:', GA4_PROPERTY_ID, ''],
    ['GA4 Account ID:', GA4_ACCOUNT_ID, ''],
    ['Measurement ID:', 'G-CB0Q6E7ND3', ''],
  ];
  
  instructionsSheet.getRange(1, 1, instructions.length, 3).setValues(instructions);
  instructionsSheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  instructionsSheet.getRange(3, 1).setFontWeight('bold').setFontColor('#0f9d58');
  instructionsSheet.getRange(9, 1).setFontWeight('bold').setFontColor('#0f9d58');
  instructionsSheet.getRange(18, 1).setFontWeight('bold').setFontColor('#0f9d58');
  instructionsSheet.getRange(26, 1).setFontWeight('bold').setFontColor('#4285f4');
  
  // Auto-resize columns
  eventsSheet.autoResizeColumns(1, 4);
  dimensionsSheet.autoResizeColumns(1, 4);
  instructionsSheet.autoResizeColumns(1, 3);
  
  // Show completion message
  SpreadsheetApp.getUi().alert(
    'GA4 Configuration Sheet Created!',
    'Your configuration sheet has been created with all events and dimensions.\n\n' +
    'Follow the instructions in the "Setup Instructions" tab to complete the configuration in GA4.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
  
  // Open the spreadsheet
  const url = spreadsheet.getUrl();
  const html = HtmlService.createHtmlOutput(
    '<script>window.open("' + url + '");google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showModalDialog(html, 'Opening Configuration Sheet...');
}

// Create menu item
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('GA4 Setup')
    .addItem('Generate Configuration', 'setupGA4')
    .addToUi();
}