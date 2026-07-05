import { createAuthClient } from '@/lib/supabase/auth-server';
import { createServerClient } from '@/lib/supabase/server';
import SettingsClient from '@/components/admin/settings/SettingsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Einstellungen | ApeAround Admin',
};

export default async function AdminEinstellungenPage() {
  // ── Aktuellen Admin-User laden (Auth-Client, kein Service-Role) ─────────────
  let user = null;
  try {
    const auth = await createAuthClient();
    const { data } = await auth.auth.getUser();
    user = data.user ?? null;
  } catch { /* layout hat bereits auth geprüft */ }

  const adminUser = user
    ? { email: user.email ?? '', role: user.user_metadata?.role ?? 'admin', id: user.id }
    : null;

  // ── Site-Settings laden ──────────────────────────────────────────────────────
  let siteSettings = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();
    siteSettings = data;
  } catch { /* Tabelle existiert noch nicht — defaults werden im Client genutzt */ }

  // ── Audit-Log laden (letzte 20 Einträge) ─────────────────────────────────────
  let auditLog = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('admin_audit_log')
      .select('id, admin_email, action, entity_type, entity_id, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    auditLog = data ?? [];
  } catch { /* Tabelle existiert noch nicht */ }

  // ── Integration-Status: nur serverseitig prüfen, keine Keys weitergeben ──────
  const integrations = {
    anthropic:    !!process.env.ANTHROPIC_API_KEY,
    resend:       !!process.env.RESEND_API_KEY,
    supabase:     !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    sitePassword: !!process.env.SITE_PASSWORD,
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          Einstellungen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Admin-Zugang, Site-Konfiguration, Integrationen, Exports und Audit-Log.
        </p>
      </div>

      <SettingsClient
        user={adminUser}
        siteSettings={siteSettings}
        auditLog={auditLog}
        integrations={integrations}
      />
    </div>
  );
}
