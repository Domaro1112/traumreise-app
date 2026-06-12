import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

// This layout wraps all protected admin routes.
// Unauthenticated requests are redirected to /admin/login.
//
// TODO: When Supabase Auth is integrated, replace the cookie check with:
//   const supabase = createServerClient(...);
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user || user.user_metadata?.role !== 'admin') redirect('/admin/login');

export default async function ProtectedAdminLayout({ children }) {
  const cookieStore   = await cookies();
  const adminSession  = cookieStore.get('admin_session');

  if (!adminSession || adminSession.value !== 'granted') {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
