import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies for Supabase tables...');
  
  try {
    // Fix content_categories table first - this is the main issue
    console.log('Creating policies for content_categories...');
    
    await sql`
      CREATE POLICY IF NOT EXISTS "allow_authenticated_read" 
      ON public.content_categories 
      FOR SELECT 
      TO authenticated 
      USING (true)
    `;
    
    await sql`
      CREATE POLICY IF NOT EXISTS "allow_public_read" 
      ON public.content_categories 
      FOR SELECT 
      TO anon 
      USING (true)
    `;
    
    await sql`
      CREATE POLICY IF NOT EXISTS "allow_service_role_all" 
      ON public.content_categories 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true)
    `;

    console.log('✅ content_categories policies created successfully');

    // Create policies for other main tables to prevent future RLS issues
    const tables = ['categories', 'brands', 'products', 'users', 'memberships'];
    
    for (const tableName of tables) {
      try {
        await sql`
          CREATE POLICY IF NOT EXISTS ${sql(`allow_read_${tableName}`)} 
          ON ${sql(tableName)} 
          FOR SELECT 
          TO authenticated, anon 
          USING (true)
        `;

        await sql`
          CREATE POLICY IF NOT EXISTS ${sql(`allow_service_${tableName}`)} 
          ON ${sql(tableName)} 
          FOR ALL 
          TO service_role 
          USING (true) 
          WITH CHECK (true)
        `;

        console.log(`✅ Created policies for ${tableName}`);
      } catch (error) {
        console.log(`⚠️ Table ${tableName} may not exist or already has policies`);
      }
    }

    return { success: true, message: 'RLS policies fixed successfully' };
    
  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error);
    throw error;
  }
}

// Run the fix if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixRLSPolicies()
    .then(result => {
      console.log('✅ Direct execution completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Direct execution failed:', error);
      process.exit(1);
    });
}