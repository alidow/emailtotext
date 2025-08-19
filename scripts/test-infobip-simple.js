const https = require('https');

const INFOBIP_API_KEY = '0512f401b045e5aef0e6f90997abb2bf-b5f9e877-d7be-4246-9935-db04c21b47b9';
const INFOBIP_BASE_URL = 'm3q9rw.api.infobip.com';

const to = process.argv[2] || '+14155238886';
const text = process.argv[3] || 'Email to Text Notification: New email from "alidow@gmail.com", subject "heyo".\n\nView full message at:\n\nhttps://emailtotextnotify.com/messages';

const payload = JSON.stringify({
  messages: [
    {
      destinations: [{ to }],
      from: "18338596750",
      text: text
    }
  ]
});

const options = {
  hostname: INFOBIP_BASE_URL,
  port: 443,
  path: '/sms/2/text/advanced',
  method: 'POST',
  headers: {
    'Authorization': `App ${INFOBIP_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': payload.length
  }
};

console.log('Sending SMS via InfoBip...');
console.log('To:', to);
console.log('Message:', text);
console.log('---');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      if (response.messages && response.messages[0]) {
        const msg = response.messages[0];
        console.log('\nMessage Status:');
        console.log(`- Message ID: ${msg.messageId}`);
        console.log(`- Status: ${msg.status.name} (${msg.status.description})`);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(payload);
req.end();