import 'server-only';
import { SITE_URL } from '@/lib/site-config';
import { LEGAL } from '@/lib/legal-config';
import { sanitizeBlocks } from '@/lib/newsletter/blocks';
import { loadArticles, loadDestinations, type NlArticle, type NlDestination } from '@/lib/newsletter/content';

// ─────────────────────────────────────────────────────────────────────────────
// Baut aus den Bausteinen einer Kampagne eine E-Mail (HTML + Textversion).
// Tabellen-Layout mit Inline-Styles, damit es auch in Outlook & Co. hält.
// Der Abmeldelink steht als Platzhalter {{UNSUB_URL}} drin und wird je
// Empfänger ersetzt.
// ─────────────────────────────────────────────────────────────────────────────

export const UNSUB_PLACEHOLDER = '{{UNSUB_URL}}';

const C = {
  text: '#0F172A', body: '#334155', muted: '#64748B', light: '#94A3B8',
  blue: '#0EA5E9', blueDark: '#0284C7', line: '#E2E8F0', bg: '#F1F5F9', tipBg: '#F0F9FF',
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

type Campaign = { id?: string; subject?: string; preheader?: string; blocks?: unknown; title?: string };
type Ctx = { dests: Map<string, NlDestination>; arts: Map<string, NlArticle>; preview: boolean; utm: string };

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function absUrl(url: string, utm = ''): string {
  const u = String(url ?? '').trim();
  if (!u) return '';
  let full: string;
  if (u.startsWith('/')) full = SITE_URL + u;
  else if (/^https?:\/\//i.test(u)) full = u;
  else if (/^mailto:/i.test(u)) return u;
  else return '';
  // Eigene Links bekommen eine Kennung, damit man die Besuche aus dem Newsletter erkennt
  if (utm && full.startsWith(SITE_URL)) {
    const [base, hash] = full.split('#');
    full = base + (base.includes('?') ? '&' : '?') + utm + (hash ? `#${hash}` : '');
  }
  return full;
}

function imgUrl(url: string): string {
  return absUrl(url) || '';
}

/** Absätze, Zeilenumbrüche, **fett** und [Link](url) – alles andere wird escaped. */
function richText(src: string, utm: string, color = C.body): string {
  const paras = String(src ?? '').trim().split(/\n\s*\n/).filter(Boolean);
  return paras.map(p => {
    let h = esc(p);
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, href) => {
      const url = absUrl(href.replace(/&amp;/g, '&'), utm);
      return url ? `<a href="${esc(url)}" style="color:${C.blue};text-decoration:underline;">${t}</a>` : t;
    });
    h = h.replace(/\n/g, '<br>');
    return `<p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:${color};font-family:${FONT};">${h}</p>`;
  }).join('');
}

function plain(src: string, utm = ''): string {
  return String(src ?? '').replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, href) => `${t} (${absUrl(href, utm) || href})`).trim();
}

const row = (inner: string, pad = '0 32px 28px') => `<tr><td style="padding:${pad};">${inner}</td></tr>`;

function heading(text: string, size = 22): string {
  if (!text) return '';
  return `<h2 style="margin:0 0 12px;font-size:${size}px;line-height:1.3;font-weight:800;color:${C.text};font-family:${FONT};">${esc(text)}</h2>`;
}

function eyebrow(text: string): string {
  if (!text) return '';
  return `<p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.blue};font-family:${FONT};">${esc(text)}</p>`;
}

function button(label: string, href: string, align = 'left'): string {
  if (!label || !href) return '';
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${align}" style="margin:4px 0 0;">
    <tr><td style="border-radius:12px;background:${C.blue};">
      <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:12px;font-family:${FONT};">${esc(label)} &rarr;</a>
    </td></tr></table>`;
}

function warn(msg: string, ctx: Ctx): string {
  return ctx.preview
    ? row(`<div style="padding:12px 16px;border-radius:10px;background:#FEF3C7;color:#92400E;font-size:13px;font-family:${FONT};">⚠️ ${esc(msg)} – dieser Baustein wird beim Versand weggelassen.</div>`)
    : '';
}

function truncate(s: string, n: number): string {
  const t = String(s ?? '').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + ' …' : t;
}

// ── Bausteine ────────────────────────────────────────────────────────────────

function renderBlock(b: any, ctx: Ctx): { html: string; text: string } {
  const { utm } = ctx;
  switch (b.type) {
    case 'text': {
      if (!b.heading && !b.body) return { html: '', text: '' };
      return {
        html: row(heading(b.heading) + richText(b.body, utm)),
        text: [b.heading?.toUpperCase(), plain(b.body, utm)].filter(Boolean).join('\n\n'),
      };
    }
    case 'destination': {
      const d = ctx.dests.get(b.slug);
      if (!d) return { html: b.slug ? warn('Reiseziel nicht gefunden oder nicht veröffentlicht', ctx) : warn('Kein Reiseziel ausgewählt', ctx), text: '' };
      const url = absUrl(`/reiseziele/${d.slug}`, utm);
      const desc = b.text?.trim() ? b.text : truncate(d.description, 240);
      const img = imgUrl(d.image);
      return {
        html: row(
          eyebrow(b.heading) +
          (img ? `<a href="${esc(url)}"><img src="${esc(img)}" width="536" alt="${esc(d.name)}" style="display:block;width:100%;max-width:536px;height:auto;border-radius:14px;border:0;margin:0 0 16px;"></a>` : '') +
          `<h3 style="margin:0 0 4px;font-size:24px;font-weight:800;color:${C.text};font-family:${FONT};">${esc(d.name)}</h3>` +
          (d.country ? `<p style="margin:0 0 10px;font-size:14px;color:${C.muted};font-family:${FONT};">${esc(d.country)}</p>` : '') +
          richText(desc, utm) +
          button(`Mehr über ${d.name}`, url),
        ),
        text: [b.heading?.toUpperCase(), `${d.name}${d.country ? `, ${d.country}` : ''}`, plain(desc, utm), url].filter(Boolean).join('\n'),
      };
    }
    case 'destinations': {
      const list = (b.slugs ?? []).map((s: string) => ctx.dests.get(s)).filter(Boolean) as NlDestination[];
      if (!list.length) return { html: warn('Keine Reiseziele ausgewählt', ctx), text: '' };
      const cell = (d: NlDestination) => {
        const url = absUrl(`/reiseziele/${d.slug}`, utm);
        const img = imgUrl(d.image);
        return `<td width="50%" valign="top" style="padding:0 6px 14px;">
          <a href="${esc(url)}" style="text-decoration:none;">
            ${img ? `<img src="${esc(img)}" width="256" alt="${esc(d.name)}" style="display:block;width:100%;max-width:256px;height:auto;border-radius:12px;border:0;margin:0 0 8px;">` : ''}
            <span style="display:block;font-size:16px;font-weight:700;color:${C.text};font-family:${FONT};">${esc(d.name)}</span>
            ${d.country ? `<span style="display:block;font-size:13px;color:${C.muted};font-family:${FONT};">${esc(d.country)}</span>` : ''}
          </a></td>`;
      };
      let rows = '';
      for (let i = 0; i < list.length; i += 2) {
        rows += `<tr>${cell(list[i])}${list[i + 1] ? cell(list[i + 1]) : '<td width="50%"></td>'}</tr>`;
      }
      return {
        html: row((b.heading ? `<div style="padding:0 6px;">${heading(b.heading)}</div>` : '') + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`, '0 26px 14px'),
        text: [b.heading?.toUpperCase(), ...list.map(d => `- ${d.name}: ${absUrl(`/reiseziele/${d.slug}`, utm)}`)].filter(Boolean).join('\n'),
      };
    }
    case 'articles': {
      const list = (b.slugs ?? []).map((s: string) => ctx.arts.get(s)).filter(Boolean) as NlArticle[];
      if (!list.length) return { html: warn('Keine Blogartikel ausgewählt', ctx), text: '' };
      const items = list.map(a => {
        const url = absUrl(`/reiseblog/${a.slug}`, utm);
        const img = imgUrl(a.image);
        return `<tr>
          ${img ? `<td width="150" valign="top" style="padding:0 16px 18px 0;"><a href="${esc(url)}"><img src="${esc(img)}" width="150" alt="" style="display:block;width:150px;height:auto;border-radius:10px;border:0;"></a></td>` : ''}
          <td valign="top" style="padding:0 0 18px;">
            <a href="${esc(url)}" style="font-size:17px;font-weight:700;line-height:1.35;color:${C.text};text-decoration:none;font-family:${FONT};">${esc(a.title)}</a>
            ${a.excerpt ? `<p style="margin:6px 0 6px;font-size:14px;line-height:1.55;color:${C.muted};font-family:${FONT};">${esc(truncate(a.excerpt, 140))}</p>` : ''}
            <a href="${esc(url)}" style="font-size:14px;font-weight:700;color:${C.blue};text-decoration:none;font-family:${FONT};">Weiterlesen &rarr;</a>
          </td></tr>`;
      }).join('');
      return {
        html: row(heading(b.heading) + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items}</table>`, '0 32px 10px'),
        text: [b.heading?.toUpperCase(), ...list.map(a => `- ${a.title}: ${absUrl(`/reiseblog/${a.slug}`, utm)}`)].filter(Boolean).join('\n'),
      };
    }
    case 'tip': {
      if (!b.heading && !b.body) return { html: '', text: '' };
      return {
        html: row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:${C.tipBg};border-left:4px solid ${C.blue};border-radius:12px;padding:20px 22px 8px;">
            ${b.heading ? `<p style="margin:0 0 8px;font-size:17px;font-weight:800;color:${C.blueDark};font-family:${FONT};">💡 ${esc(b.heading)}</p>` : ''}
            ${richText(b.body, utm)}
          </td></tr></table>`),
        text: [b.heading ? `TIPP: ${b.heading}` : 'TIPP', plain(b.body, utm)].join('\n'),
      };
    }
    case 'image': {
      const src = imgUrl(b.url);
      if (!src) return { html: warn('Kein Bild hinterlegt', ctx), text: '' };
      const img = `<img src="${esc(src)}" width="536" alt="${esc(b.alt)}" style="display:block;width:100%;max-width:536px;height:auto;border-radius:14px;border:0;">`;
      const link = absUrl(b.link, utm);
      return { html: row(link ? `<a href="${esc(link)}">${img}</a>` : img), text: link ? `${b.alt || 'Bild'}: ${link}` : '' };
    }
    case 'button': {
      const url = absUrl(b.url, utm);
      if (!url || !b.label) return { html: warn('Button ohne Text oder Link', ctx), text: '' };
      return { html: row(`<div style="text-align:center;">${button(b.label, url, 'center')}</div>`), text: `${b.label}: ${url}` };
    }
    case 'offer': {
      const url = absUrl(b.url, utm);
      if (!b.heading && !b.body) return { html: '', text: '' };
      const img = imgUrl(b.image);
      return {
        html: row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="border:1px solid ${C.line};border-radius:14px;padding:18px 22px 20px;">
            <p style="margin:0 0 10px;"><span style="display:inline-block;padding:2px 10px;border-radius:999px;background:${C.bg};color:${C.muted};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:${FONT};">Anzeige</span></p>
            ${img ? `<img src="${esc(img)}" width="490" alt="" style="display:block;width:100%;max-width:490px;height:auto;border-radius:10px;border:0;margin:0 0 14px;">` : ''}
            ${b.heading ? `<p style="margin:0 0 8px;font-size:19px;font-weight:800;color:${C.text};font-family:${FONT};">${esc(b.heading)}</p>` : ''}
            ${richText(b.body, utm)}
            ${url ? button(b.label || 'Zum Angebot', url) : ''}
          </td></tr></table>`),
        text: ['ANZEIGE', b.heading, plain(b.body, utm), url].filter(Boolean).join('\n'),
      };
    }
    default:
      return { html: '', text: '' };
  }
}

// ── Gesamte Mail ─────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'newsletter';
}

export async function renderCampaign(campaign: Campaign, opts: { preview?: boolean } = {}) {
  const blocks = sanitizeBlocks(campaign.blocks) as any[];
  const needDest = blocks.some(b => b.type === 'destination' || b.type === 'destinations');
  const needArt = blocks.some(b => b.type === 'articles');
  const [dests, arts] = await Promise.all([
    needDest ? loadDestinations() : Promise.resolve([]),
    needArt ? loadArticles() : Promise.resolve([]),
  ]);
  const ctx: Ctx = {
    dests: new Map(dests.map(d => [d.slug, d])),
    arts: new Map(arts.map(a => [a.slug, a])),
    preview: !!opts.preview,
    utm: `utm_source=newsletter&utm_medium=email&utm_campaign=${slugify(campaign.title || campaign.subject || '')}`,
  };

  const parts = blocks.map(b => renderBlock(b, ctx));
  const bodyHtml = parts.map(p => p.html).join('');
  const bodyText = parts.map(p => p.text).filter(Boolean).join('\n\n---\n\n');

  const subject = String(campaign.subject ?? '').trim() || '(ohne Betreff)';
  const preheader = String(campaign.preheader ?? '').trim();
  const logo = `${SITE_URL}/images/newsletter/mail-logo.png`;
  const footerLinks = [
    `<a href="${UNSUB_PLACEHOLDER}" style="color:${C.muted};text-decoration:underline;">Vom Newsletter abmelden</a>`,
    `<a href="${SITE_URL}/impressum" style="color:${C.muted};text-decoration:underline;">Impressum</a>`,
    `<a href="${SITE_URL}/datenschutz" style="color:${C.muted};text-decoration:underline;">Datenschutz</a>`,
  ].join(' &nbsp;·&nbsp; ');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<style>
  @media (max-width:620px){ .nl-wrap{padding:0 !important;} .nl-card{border-radius:0 !important;} }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}${'&#8204;&nbsp;'.repeat(60)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr><td class="nl-wrap" align="center" style="padding:28px 12px;">
    <table role="presentation" class="nl-card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:18px;overflow:hidden;">
      <tr><td style="height:5px;background:${C.blue};line-height:5px;font-size:0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:28px 32px 24px;">
        <a href="${esc(absUrl('/', ctx.utm))}"><img src="${logo}" width="220" alt="ApeAround – Dein Urlaub beginnt mit einer Idee" style="display:block;width:220px;height:auto;border:0;"></a>
      </td></tr>
      ${bodyHtml || row(`<p style="font-size:15px;color:${C.light};font-family:${FONT};text-align:center;">Noch keine Inhalte – füge links Bausteine hinzu.</p>`)}
      <tr><td style="padding:24px 32px 28px;background:#F8FAFC;border-top:1px solid ${C.line};">
        <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:${C.muted};font-family:${FONT};text-align:center;">
          Du bekommst diese E-Mail, weil du dich auf apearound.de für den ApeAround-Newsletter angemeldet und die Anmeldung bestätigt hast.
        </p>
        <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:${C.muted};font-family:${FONT};text-align:center;">${footerLinks}</p>
        <p style="margin:0;font-size:11px;line-height:1.6;color:${C.light};font-family:${FONT};text-align:center;">
          ${esc(LEGAL.brand)} · ${esc(LEGAL.ownerName)} · ${esc(LEGAL.zip)} ${esc(LEGAL.city)}
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    preheader,
    bodyText,
    '---',
    'Du bekommst diese E-Mail, weil du dich auf apearound.de für den ApeAround-Newsletter angemeldet hast.',
    `Abmelden: ${UNSUB_PLACEHOLDER}`,
    `Impressum: ${SITE_URL}/impressum`,
  ].filter(Boolean).join('\n\n');

  return { subject, html, text, blockCount: blocks.length };
}

export function personalize(content: string, unsubUrl: string): string {
  return content.split(UNSUB_PLACEHOLDER).join(unsubUrl);
}
