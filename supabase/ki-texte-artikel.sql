-- Entfernt die KI-Erwähnungen aus dem Blogartikel „reise-alternativen-inspiration“.
update public.blog_articles
set content_sections = replace(replace(replace(content_sections::text,
      'Inspirationsplattformen und KI-gestützte Reisetools, wie sie zunehmend angeboten werden, können dir',
      'Inspirationsplattformen und Reisefinder können dir'),
      'KI-Reisetools und Karten-Suchen für Inspiration nutzen',
      'Reisefinder und Karten-Suchen für Inspiration nutzen'),
      'Nutze Inspirationsplattformen, KI-Reisetools und die Karten-Suche',
      'Nutze Inspirationsplattformen, Reisefinder und die Karten-Suche')::jsonb,
    faq = replace(replace(faq::text,
      'Nutze Inspirationsplattformen, KI-Reisetools und die Karten-Suche',
      'Nutze Inspirationsplattformen, Reisefinder und die Karten-Suche'),
      'KI-Reisetools und Karten-Suchen für Inspiration nutzen',
      'Reisefinder und Karten-Suchen für Inspiration nutzen')::jsonb,
    key_takeaways = replace(coalesce(key_takeaways::text,'[]'),
      'KI-Reisetools', 'Reisefinder')::jsonb
where slug = 'reise-alternativen-inspiration';

-- Kontrolle: sollte 0 ergeben
select count(*) as verbleibende_ki_stellen
from public.blog_articles
where (content_sections::text || faq::text || coalesce(key_takeaways::text,'')) ~ 'KI-';
