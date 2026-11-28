// Hinweise, wenn für den Versand noch etwas fehlt (wird serverseitig ermittelt).
export default function SetupNotice({ missingTable, missingResend, missingCron }) {
  if (!missingTable && !missingResend && !missingCron) return null;
  const item = (title, text) => (
    <li style={{ marginBottom: '6px' }}><strong>{title}</strong> {text}</li>
  );
  return (
    <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: '#92400E', lineHeight: 1.6 }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Bevor der erste Newsletter rausgehen kann:</p>
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        {missingTable && item('Datenbank:', 'Die Datei supabase/newsletter-kampagnen.sql einmal im Supabase SQL-Editor ausführen.')}
        {missingResend && item('Mailversand:', 'In Vercel fehlt die Umgebungsvariable RESEND_API_KEY.')}
        {missingCron && item('Zeitplan:', 'In Vercel die Umgebungsvariable CRON_SECRET anlegen und danach supabase/newsletter-zeitplan.sql ausführen. Ohne Zeitplan gehen nur „Jetzt senden“ und Testmails – geplante Newsletter bleiben liegen.')}
      </ul>
    </div>
  );
}
