import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server component guard – can be wrapped around any server-rendered admin section
 * for an extra layer of protection beyond the layout-level check.
 *
 * TODO: Replace cookie check with Supabase Auth + admin role check when
 *       proper user authentication is implemented.
 *       Check: supabase.auth.getUser() → user.user_metadata.role === 'admin'
 */
export default async function AdminGuard({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'granted') {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
