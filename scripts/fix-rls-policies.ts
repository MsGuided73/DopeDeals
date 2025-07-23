#!/usr/bin/env tsx
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false }
});

async function fixRLSPolicies() {
  console.log('🔧 Fixing Supabase RLS policies...');

  try {
    // Check current RLS status
    console.log('📋 Checking current RLS status...');
    const rlsStatus = await sql`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE tablename = 'content_categories'
    `;
    console.log('RLS Status:', rlsStatus);

    // Check existing policies
    const existingPolicies = await sql`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
      FROM pg_policies 
      WHERE tablename = 'content_categories'
    `;
    console.log('Existing policies:', existingPolicies);

    // Create RLS policies for content_categories
    console.log('🛡️ Creating RLS policies for content_categories...');

    // Allow all authenticated users to read content_categories
    await sql`
      CREATE POLICY "Allow authenticated read access"
      ON public.content_categories
      FOR SELECT
      TO authenticated
      USING (true)
    `;

    // Allow all users (including anonymous) to read content_categories for public access
    await sql`
      CREATE POLICY "Allow public read access"
      ON public.content_categories
      FOR SELECT
      TO anon
      USING (true)
    `;

    // Allow service role full access for admin operations
    await sql`
      CREATE POLICY "Allow service role full access"
      ON public.content_categories
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true)
    `;

    console.log('✅ Successfully created RLS policies for content_categories');

    // Check if there are other tables with RLS enabled but no policies
    console.log('🔍 Checking for other tables with RLS issues...');
    const tablesWithRLS = await sql`
      SELECT t.schemaname, t.tablename, t.rowsecurity,
             COALESCE(p.policy_count, 0) as policy_count
      FROM pg_tables t
      LEFT JOIN (
        SELECT schemaname, tablename, COUNT(*) as policy_count
        FROM pg_policies 
        GROUP BY schemaname, tablename
      ) p ON t.schemaname = p.schemaname AND t.tablename = p.tablename
      WHERE t.schemaname = 'public' 
      AND t.rowsecurity = true
      AND COALESCE(p.policy_count, 0) = 0
    `;

    if (tablesWithRLS.length > 0) {
      console.log('⚠️  Found tables with RLS enabled but no policies:');
      tablesWithRLS.forEach(table => {
        console.log(`   - ${table.schemaname}.${table.tablename}`);
      });

      // Create basic read policies for all public tables with RLS but no policies
      for (const table of tablesWithRLS) {
        console.log(`🛡️ Creating basic policies for ${table.tablename}...`);
        
        try {
          // Allow authenticated users to read
          await sql`
            CREATE POLICY ${sql(`Allow authenticated read ${table.tablename}`)}
            ON ${sql(table.schemaname)}.${sql(table.tablename)}
            FOR SELECT
            TO authenticated
            USING (true)
          `;

          // Allow anonymous users to read (for public access)
          await sql`
            CREATE POLICY ${sql(`Allow public read ${table.tablename}`)}
            ON ${sql(table.schemaname)}.${sql(table.tablename)}
            FOR SELECT
            TO anon
            USING (true)
          `;

          // Allow service role full access
          await sql`
            CREATE POLICY ${sql(`Allow service role full ${table.tablename}`)}
            ON ${sql(table.schemaname)}.${sql(table.tablename)}
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true)
          `;

          console.log(`✅ Created policies for ${table.tablename}`);
        } catch (error) {
          console.log(`❌ Failed to create policies for ${table.tablename}:`, error);
        }
      }
    } else {
      console.log('✅ No other tables found with RLS issues');
    }

    console.log('🎉 RLS policy fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error);
    process.exit(1);
  }
}

// Run the fix
fixRLSPolicies();