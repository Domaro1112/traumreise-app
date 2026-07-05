/**
 * Generic JSON-LD render component.
 *
 * Accepts a single schema object or an array of objects.
 * Null / undefined entries are silently filtered out.
 * The `<` and `>` characters inside the serialised JSON are Unicode-escaped
 * so a value containing "</script>" cannot break out of the script tag.
 */
function dedup(items) {
  const seen = new Set();
  return items.filter(item => {
    const type  = Array.isArray(item['@type']) ? item['@type'][0] : item['@type'];
    const id    = item['@id'] ?? item.url ?? '';
    const key   = `${type}:${id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function JsonLd({ data }) {
  const items = dedup((Array.isArray(data) ? data : [data]).filter(Boolean));
  if (items.length === 0) return null;

  return (
    <>
      {items.map((schema, i) => {
        // Escape characters that could close the script tag or inject HTML.
        const json = JSON.stringify(schema)
          .replace(/&/g,  '\\u0026')
          .replace(/</g,  '\\u003c')
          .replace(/>/g,  '\\u003e');

        return (
          <script
            key={i}
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: json }}
          />
        );
      })}
    </>
  );
}
