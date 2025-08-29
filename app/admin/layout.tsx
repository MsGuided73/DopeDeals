import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/supabase-server-ssr';
import AdminShell from './_components/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/(public)/auth');

  // TODO: add role-based check here when roles are stored (e.g., user.app_metadata.role)
  return <AdminShell>{children}</AdminShell>;
}

