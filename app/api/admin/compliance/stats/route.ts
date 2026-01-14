import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    // In a real scenario, we would aggregate data from users, verifications, and logs
    // For now, we'll fetch actual counts where possible and use sensible defaults for rates
    
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: verifiedUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('age_verified', true);

    const { count: pendingVerifications } = await supabase
      .from('age_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: activeRestrictions } = await supabase
      .from('compliance_rules')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      verifiedUsers: verifiedUsers || 0,
      pendingVerifications: pendingVerifications || 0,
      rejectedVerifications: 0, // Placeholder
      ageComplianceRate: totalUsers ? Math.round((verifiedUsers || 0) / totalUsers * 100) : 100,
      locationComplianceRate: 98, // Placeholder
      activeRestrictions: activeRestrictions || 0
    });
  } catch (error) {
    console.error('[Compliance Stats API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
