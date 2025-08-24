/**
 * GA4 Configuration Generator
 * Generates configuration that can be manually applied in GA4 UI
 * Run: npx tsx scripts/generate-ga4-config.ts
 */

const EVENTS_TO_MARK_AS_CONVERSIONS = [
  'account_created',
  'phone_verified',
  'payment_completed',
  'start_flow_initiated',
];

const CUSTOM_DIMENSIONS = [
  { name: 'Signup Method', parameter: 'method', scope: 'Event' },
  { name: 'Phone Number', parameter: 'phone', scope: 'User' },
  { name: 'Subscription Plan', parameter: 'plan', scope: 'Event' },
  { name: 'Error Message', parameter: 'error', scope: 'Event' },
  { name: 'Error Step', parameter: 'step', scope: 'Event' },
  { name: 'Button Clicked', parameter: 'button', scope: 'Event' },
  { name: 'Page Location', parameter: 'page_location', scope: 'Event' },
  { name: 'Test Mode', parameter: 'test_mode', scope: 'Event' },
];

console.log('🎯 GA4 Manual Configuration Guide\n');
console.log('=' .repeat(60));

console.log('\n📍 GA4 Property Details:');
console.log('Property ID: 269480984');
console.log('Account ID: 223143062');
console.log('Measurement ID: G-CB0Q6E7ND3');

console.log('\n' + '=' .repeat(60));
console.log('\n✅ STEP 1: Mark Events as Conversions\n');
console.log('Go to: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/conversions/list\n');
console.log('Toggle "Mark as conversion" for these events:');
EVENTS_TO_MARK_AS_CONVERSIONS.forEach((event, i) => {
  console.log(`  ${i + 1}. ✓ ${event}`);
});

console.log('\n' + '=' .repeat(60));
console.log('\n📊 STEP 2: Create Custom Dimensions\n');
console.log('Go to: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/customdefinitions/list\n');
console.log('Click "Create custom dimension" for each:');
console.log('\n');

CUSTOM_DIMENSIONS.forEach((dim, i) => {
  console.log(`Dimension ${i + 1}:`);
  console.log(`  Display name: ${dim.name}`);
  console.log(`  Scope: ${dim.scope}`);
  console.log(`  Event parameter: ${dim.parameter}`);
  console.log('');
});

console.log('=' .repeat(60));
console.log('\n🔍 STEP 3: Verify Events are Flowing\n');
console.log('Go to: https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/reports/realtime\n');
console.log('1. Open your website');
console.log('2. Add ?debug=analytics to see event debugger');
console.log('3. Go through signup flow');
console.log('4. Watch events appear in Realtime');

console.log('\n' + '=' .repeat(60));
console.log('\n📈 STEP 4: Import to Google Ads (Optional)\n');
console.log('If you\'re running Google Ads campaigns:\n');
console.log('1. Go to Google Ads > Tools > Conversions');
console.log('2. Click "+ Conversion" > "Import"');
console.log('3. Select "Google Analytics 4"');
console.log('4. Import these conversion events:');
console.log('   - account_created');
console.log('   - phone_verified');
console.log('   - payment_completed');

console.log('\n' + '=' .repeat(60));
console.log('\n⏱️  Estimated time: 10-15 minutes\n');

// Create a checklist file
const fs = require('fs');
const checklistContent = `# GA4 Configuration Checklist

## Property Info
- Property ID: 269480984
- Account ID: 223143062  
- Measurement ID: G-CB0Q6E7ND3

## ✅ Conversions to Mark
- [ ] account_created
- [ ] phone_verified
- [ ] payment_completed
- [ ] start_flow_initiated

## 📊 Custom Dimensions to Create

### Dimension 1
- [ ] Display name: Signup Method
- [ ] Scope: Event
- [ ] Parameter: method

### Dimension 2
- [ ] Display name: Phone Number
- [ ] Scope: User
- [ ] Parameter: phone

### Dimension 3
- [ ] Display name: Subscription Plan
- [ ] Scope: Event
- [ ] Parameter: plan

### Dimension 4
- [ ] Display name: Error Message
- [ ] Scope: Event
- [ ] Parameter: error

### Dimension 5
- [ ] Display name: Error Step
- [ ] Scope: Event
- [ ] Parameter: step

### Dimension 6
- [ ] Display name: Button Clicked
- [ ] Scope: Event
- [ ] Parameter: button

### Dimension 7
- [ ] Display name: Page Location
- [ ] Scope: Event
- [ ] Parameter: page_location

### Dimension 8
- [ ] Display name: Test Mode
- [ ] Scope: Event
- [ ] Parameter: test_mode

## 🔗 Quick Links
- [Mark Conversions](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/conversions/list)
- [Create Dimensions](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/customdefinitions/list)
- [Realtime Events](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/reports/realtime)
- [DebugView](https://analytics.google.com/analytics/web/#/a223143062w311162084p269480984/admin/debugview)
`;

fs.writeFileSync('GA4_CONFIGURATION_CHECKLIST.md', checklistContent);
console.log('📝 Checklist saved to: GA4_CONFIGURATION_CHECKLIST.md');
console.log('\nOpen the checklist and follow each step in GA4!');