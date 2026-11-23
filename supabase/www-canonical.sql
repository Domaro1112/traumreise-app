-- Canonical-Adressen von www.apearound.de auf apearound.de umstellen
update public.destinations
   set canonical_url = replace(canonical_url, 'https://www.apearound.de', 'https://apearound.de')
 where canonical_url like 'https://www.apearound.de%';

update public.blog_articles
   set canonical_url = replace(canonical_url, 'https://www.apearound.de', 'https://apearound.de')
 where canonical_url like 'https://www.apearound.de%';

select
  (select count(*) from public.destinations  where canonical_url like '%www.apearound.de%') as reiseziele_mit_www,
  (select count(*) from public.blog_articles where canonical_url like '%www.apearound.de%') as artikel_mit_www;
