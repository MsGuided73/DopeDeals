// Update the DATABASE_URL to use IPv4-compatible pooler
const fs = require('fs');

const newDatabaseUrl = "postgresql://postgres.qirbapivptotybspnbet:SAB%40459dcr%21@aws-0-us-west-1.pooler.supabase.com:6543/postgres";

console.log('Updating DATABASE_URL environment variable...');
console.log('New URL:', newDatabaseUrl);

// For Replit, we need to update the environment through the secrets manager
// This script shows the correct URL format for manual update
console.log('\n✅ Copy this URL to your Replit Secrets manager:');
console.log(newDatabaseUrl);