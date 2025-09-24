import { ReactNode } from 'react';
import { requireAdminWithRedirect } from '../lib/auth-helpers';
import AdminShell from './_components/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Require admin role with automatic redirect
  const user = await requireAdminWithRedirect();

  return <AdminShell user={user}>{children}</AdminShell>;
}

