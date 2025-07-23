import { createClient } from '@supabase/supabase-js'

// Supabase configuration - will be updated with new project credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

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