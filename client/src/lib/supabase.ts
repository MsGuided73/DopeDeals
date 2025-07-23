import { createClient } from '@supabase/supabase-js'

// Supabase configuration - requires actual project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript integration
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          age_verified: boolean
          vip_member: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          age_verified?: boolean
          vip_member?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          age_verified?: boolean
          vip_member?: boolean
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
  }
}

// Typed client
export const typedSupabase = supabase as ReturnType<typeof createClient<Database>>