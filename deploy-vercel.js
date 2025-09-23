#!/usr/bin/env node

/**
 * ConnectSpace Vercel Deployment Script
 * Run this to deploy your application to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ConnectSpace Vercel Deployment Script');
console.log('======================================\n');

// Check if vercel.json exists
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
    console.error('❌ vercel.json not found. Please ensure you have the Vercel configuration file.');
    process.exit(1);
}

// Check if Vercel CLI is installed
try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
} catch (error) {
    console.log('📦 Installing Vercel CLI...');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installed successfully');
    } catch (installError) {
        console.error('❌ Failed to install Vercel CLI. Please install it manually:');
        console.error('   npm install -g vercel');
        process.exit(1);
    }
}

// Check if user is logged in to Vercel
try {
    execSync('vercel whoami', { stdio: 'ignore' });
    console.log('✅ Logged in to Vercel');
} catch (error) {
    console.log('🔐 Please log in to Vercel...');
    try {
        execSync('vercel login', { stdio: 'inherit' });
        console.log('✅ Successfully logged in to Vercel');
    } catch (loginError) {
        console.error('❌ Failed to log in to Vercel');
        process.exit(1);
    }
}

// Deploy to Vercel
console.log('\n🚀 Deploying ConnectSpace to Vercel...');
try {
    // Production deployment
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('\n🎉 Deployment successful!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your deployment URL (displayed above)');
    console.log('2. Test your application functionality');
    console.log('3. Configure environment variables if needed');
    console.log('4. Set up custom domain (optional)');
    console.log('\n📊 Monitor your deployment at: https://vercel.com/dashboard');
} catch (deployError) {
    console.error('❌ Deployment failed. Please check the error messages above.');
    console.error('💡 Try running "vercel" without --prod for a preview deployment first.');
    process.exit(1);
}

console.log('\n🌟 ConnectSpace is now live on Vercel!');