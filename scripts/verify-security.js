#!/usr/bin/env node

/**
 * Security Verification Script for DopeDeals
 * This script checks various security configurations and provides recommendations
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

console.log('🔒 DopeDeals Security Verification\n');

// Check environment variables
function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(v => console.log(`   - ${v}`));
  } else {
    console.log('✅ All required environment variables are set');
  }

  // Check for exposed secrets
  const exposedSecrets = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length < 50) {
    exposedSecrets.push('SUPABASE_SERVICE_ROLE_KEY appears to be too short');
  }

  if (exposedSecrets.length > 0) {
    console.log('⚠️  Potential security issues:');
    exposedSecrets.forEach(issue => console.log(`   - ${issue}`));
  }

  console.log('');
}

// Check security headers
function checkSecurityHeaders() {
  console.log('🛡️  Checking Security Headers...');

  return new Promise((resolve) => {
    const url = new URL(SITE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/',
      method: 'HEAD',
      headers: {
        'User-Agent': 'Security-Verification-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const headers = res.headers;

      const securityHeaders = {
        'strict-transport-security': headers['strict-transport-security'],
        'x-frame-options': headers['x-frame-options'],
        'x-content-type-options': headers['x-content-type-options'],
        'content-security-policy': headers['content-security-policy'],
        'x-xss-protection': headers['x-xss-protection']
      };

      let score = 0;
      const maxScore = Object.keys(securityHeaders).length;

      Object.entries(securityHeaders).forEach(([header, value]) => {
        if (value) {
          console.log(`✅ ${header}: ${value}`);
          score++;
        } else {
          console.log(`❌ ${header}: Missing`);
        }
      });

      console.log(`\nSecurity Headers Score: ${score}/${maxScore} (${Math.round(score/maxScore*100)}%)\n`);
      resolve();
    });

    req.on('error', (err) => {
      console.log('❌ Could not check security headers:', err.message);
      console.log('   (This is normal for local development)\n');
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log('❌ Security headers check timed out\n');
      resolve();
    });

    req.end();
  });
}

// Check file permissions
function checkFilePermissions() {
  console.log('📁 Checking File Permissions...');

  const sensitiveFiles = [
    '.env.local',
    '.env',
    'next.config.js',
    'middleware.ts'
  ];

  sensitiveFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        const mode = stats.mode.toString(8);

        // Check if file is world-readable (last digit > 4)
        if (parseInt(mode.slice(-1)) > 4) {
          console.log(`⚠️  ${file} is world-readable (mode: ${mode})`);
        } else {
          console.log(`✅ ${file} has appropriate permissions`);
        }
      } catch (err) {
        console.log(`❌ Could not check permissions for ${file}`);
      }
    } else {
      console.log(`ℹ️  ${file} not found`);
    }
  });

  console.log('');
}

// Check for common security issues in code
function checkCodeSecurity() {
  console.log('🔍 Checking Code for Security Issues...');

  const filesToCheck = [
    'app/api/cart/route.ts',
    'middleware.ts',
    'next.config.js'
  ];

  let issues = [];

  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for potential security issues
        if (content.includes('eval(')) {
          issues.push(`${file}: Contains eval() usage`);
        }

        if (content.includes('innerHTML')) {
          issues.push(`${file}: Contains innerHTML usage (potential XSS)`);
        }

        if (content.includes('SUPABASE_SERVICE_ROLE_KEY') && !content.includes('process.env.')) {
          issues.push(`${file}: May expose service role key`);
        }

        // Check for SQL injection patterns
        if (content.includes('sql: `') && content.includes('${') && !content.includes("''")) {
          issues.push(`${file}: Potential SQL injection in dynamic SQL`);
        }

      } catch (err) {
        console.log(`❌ Could not read ${file}`);
      }
    }
  });

  if (issues.length > 0) {
    console.log('⚠️  Security issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ No obvious security issues found in code');
  }

  console.log('');
}

// Check Supabase configuration
function checkSupabaseConfig() {
  console.log('🗄️  Checking Supabase Configuration...');

  if (!SUPABASE_URL) {
    console.log('❌ Supabase URL not configured');
    return;
  }

  // Check if RLS is likely enabled (we can't check directly without API call)
  console.log('ℹ️  Supabase RLS policies should be verified manually in the dashboard');
  console.log('   - Ensure carts table has RLS enabled');
  console.log('   - Ensure cart_items table has RLS enabled');
  console.log('   - Verify session-based policies are active');

  console.log('');
}

// Main verification function
async function runSecurityCheck() {
  console.log('🚀 Starting Security Verification...\n');

  checkEnvironmentVariables();
  await checkSecurityHeaders();
  checkFilePermissions();
  checkCodeSecurity();
  checkSupabaseConfig();

  console.log('📊 Security Check Complete!');
  console.log('\n📝 Recommendations:');
  console.log('   - Regularly rotate API keys and secrets');
  console.log('   - Monitor Supabase logs for suspicious activity');
  console.log('   - Keep dependencies updated');
  console.log('   - Run security audits regularly');
  console.log('   - Use HTTPS in production');
  console.log('   - Implement rate limiting for API endpoints');
}

// Run the check if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityCheck().catch(console.error);
}

export { runSecurityCheck };
