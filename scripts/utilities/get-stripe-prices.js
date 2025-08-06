const Stripe = require('stripe');
require('dotenv').config({ path: '.env.production' });

// Using the Stripe secret key from .env.production
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getPrices() {
  try {
    // Fetch all products
    const products = await stripe.products.list({ limit: 100, active: true });
    
    console.log('=== STRIPE PRODUCTS AND PRICES ===\n');
    
    for (const product of products.data) {
      console.log(`Product: ${product.name}`);
      console.log(`Product ID: ${product.id}`);
      
      // Fetch prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 100
      });
      
      console.log('Prices:');
      for (const price of prices.data) {
        const interval = price.recurring?.interval || 'one-time';
        const amount = (price.unit_amount / 100).toFixed(2);
        console.log(`  - ${interval}: ${price.id} ($${amount})`);
      }
      console.log('');
    }
    
    console.log('\n=== ENV VARIABLES FORMAT ===\n');
    console.log('# Copy these to your .env.production file');
    console.log('# Update the price IDs based on the output above\n');
    
    console.log('# Free Plan');
    console.log('NEXT_PUBLIC_STRIPE_FREE_PLAN_PRICE_ID=price_xxx\n');
    
    console.log('# Basic Plan');
    console.log('NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxx');
    console.log('NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID=price_xxx\n');
    
    console.log('# Standard Plan');
    console.log('NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx');
    console.log('NEXT_PUBLIC_STRIPE_STANDARD_ANNUAL_PRICE_ID=price_xxx\n');
    
    console.log('# Premium Plan');
    console.log('NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx');
    console.log('NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxx');
    
  } catch (error) {
    console.error('Error fetching prices:', error.message);
  }
}

getPrices();