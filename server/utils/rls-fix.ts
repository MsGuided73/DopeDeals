import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function fixRLSPolicies() {
  console.log('🔧 Attempting to fix RLS policies through raw SQL...');
  
  try {
    // Create RLS policies for content_categories using raw SQL
    const policies = [
      // Allow authenticated users to read
      `CREATE POLICY IF NOT EXISTS "allow_authenticated_read" ON public.content_categories FOR SELECT TO authenticated USING (true);`,
      
      // Allow anonymous users to read (for public access)
      `CREATE POLICY IF NOT EXISTS "allow_public_read" ON public.content_categories FOR SELECT TO anon USING (true);`,
      
      // Allow service role full access
      `CREATE POLICY IF NOT EXISTS "allow_service_role_all" ON public.content_categories FOR ALL TO service_role USING (true) WITH CHECK (true);`
    ];

    // Execute each policy creation
    for (const policy of policies) {
      try {
        await db.execute(policy);
        console.log('✅ Policy created successfully');
      } catch (error) {
        console.log('Policy creation result:', error);
      }
    }

    // Also create basic policies for other common tables that might have RLS issues
    const commonTables = [
      'categories',
      'brands', 
      'products',
      'users',
      'orders',
      'cart_items',
      'memberships',
      'user_behavior',
      'user_preferences',
      'recommendations',
      'product_similarity',
      'recommendation_cache'
    ];

    for (const tableName of commonTables) {
      const tablePolicies = [
        `CREATE POLICY IF NOT EXISTS "allow_authenticated_read_${tableName}" ON public.${tableName} FOR SELECT TO authenticated USING (true);`,
        `CREATE POLICY IF NOT EXISTS "allow_public_read_${tableName}" ON public.${tableName} FOR SELECT TO anon USING (true);`,
        `CREATE POLICY IF NOT EXISTS "allow_service_role_all_${tableName}" ON public.${tableName} FOR ALL TO service_role USING (true) WITH CHECK (true);`
      ];

      for (const policy of tablePolicies) {
        try {
          await db.execute(policy);
        } catch (error) {
          // Silently handle errors - table might not exist or policy might already exist
        }
      }
    }

    console.log('🎉 RLS policy fix attempt completed');
    
  } catch (error) {
    console.error('❌ Error in RLS fix:', error);
  }
}