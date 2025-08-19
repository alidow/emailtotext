#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.production') });

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY || '0512f401b045e5aef0e6f90997abb2bf-b5f9e877-d7be-4246-9935-db04c21b47b9';
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL || 'm3q9rw.api.infobip.com';

interface InfoBipSmsResponse {
  messages: Array<{
    to: string;
    messageId: string;
    status: {
      id: number;
      groupId: number;
      groupName: string;
      name: string;
      description: string;
    };
  }>;
}

async function sendTestSms(to: string, text: string) {
  const url = `https://${INFOBIP_BASE_URL}/sms/2/text/advanced`;
  
  const payload = {
    messages: [
      {
        destinations: [{ to }],
        from: "18338596750",
        text: text
      }
    ]
  };

  console.log('Sending SMS via InfoBip...');
  console.log('URL:', url);
  console.log('To:', to);
  console.log('Message:', text);
  console.log('---');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Error Response:', response.status, response.statusText);
      console.error('Response Body:', responseText);
      return;
    }

    const data: InfoBipSmsResponse = JSON.parse(responseText);
    console.log('Success! Response:', JSON.stringify(data, null, 2));
    
    if (data.messages && data.messages[0]) {
      const msg = data.messages[0];
      console.log('\nMessage Status:');
      console.log(`- Message ID: ${msg.messageId}`);
      console.log(`- Status: ${msg.status.name} (${msg.status.description})`);
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npx tsx scripts/test-infobip-sms.ts <phone_number> <message>');
    console.log('Example: npx tsx scripts/test-infobip-sms.ts +1234567890 "Test message"');
    process.exit(1);
  }

  const phoneNumber = args[0];
  const message = args.slice(1).join(' ');

  await sendTestSms(phoneNumber, message);
}

main().catch(console.error);