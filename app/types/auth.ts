// User roles enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support'
}

// Enhanced user type with role information
export interface AuthenticatedUser {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profile?: any;
  app_metadata?: any;
  user_metadata?: any;
  aud: string;
  created_at: string;
  updated_at?: string;
  isVip?: boolean;
  age_verification_status?: string;
}
