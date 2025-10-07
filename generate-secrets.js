// Quick Environment Variables Generator
const crypto = require('crypto');

console.log('\n🔑 MISSING ENVIRONMENT VARIABLES - COPY TO YOUR .env FILE:\n');
console.log('# Generated Security Secrets');
console.log(`SESSION_SECRET=${crypto.randomBytes(64).toString('hex')}`);
console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}`);
console.log('');
console.log('# Stripe Configuration (Get from stripe.com)');
console.log('STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here');
console.log('STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here');
console.log('');
console.log('# Real Email Configuration');
console.log('EMAIL_USER=your-real-email@gmail.com');
console.log('EMAIL_PASS=your-app-specific-password');
console.log('');
console.log('🔐 Security secrets generated successfully!');
console.log('📋 Copy these to your .env file to complete setup.');