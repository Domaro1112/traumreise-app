import { redirect } from 'next/navigation';
import { createAuthClient } from '@/lib/supabase/auth-server';
import { isAdminUser } from '@/lib/admin-auth';
import AdminShell from '@/components/admin/AdminShell';
import AdminAccessDenied from '@/components/admin/AdminAccessDenied';

// This layout wraps all protected /admin/** routes.
// Unauthenticated users → /admin/login
// Authenticated but non-admin users → inline 403 page
//
// Auth is via Supabase Auth session + user_metadata.role === 'admin'.
// The middleware (middleware.ts) keeps the session token refreshed.

export default async function ProtectedAdminLayout({ children }) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  if (!isAdminUser(user)) {
    return <AdminAccessDenied email={user.email} />;
  }

  return (
    <AdminShell userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
