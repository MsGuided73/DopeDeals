import { supabaseServer } from './supabase-server';

export async function getSessionUser() {
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get additional user data from profiles table if it exists
    const { data: profile } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      profile
    };
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}
