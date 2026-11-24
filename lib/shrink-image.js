// ─────────────────────────────────────────────────────────────────────────────
// Bilder vor dem Upload im Browser verkleinern.
//
// Vercel nimmt pro Anfrage höchstens ca. 4,5 MB an. Große Handy- oder
// Kamerafotos werden deshalb vor dem Hochladen auf eine sinnvolle Größe
// gebracht (längste Seite max. 2400 px) und als JPEG bzw. – bei Transparenz –
// als WebP/PNG gespeichert, bis sie unter dem Limit liegen.
// ─────────────────────────────────────────────────────────────────────────────

const TARGET_BYTES = 3.5 * 1024 * 1024;   // sicher unter dem Vercel-Limit
const MAX_EDGE     = 2400;                 // reicht für Titelbilder in voller Breite

export const MAX_INPUT_BYTES = 40 * 1024 * 1024; // so große Originale nehmen wir an

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Bild konnte nicht gelesen werden.')); };
    img.src = url;
  });
}

function toBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

function hasTransparency(ctx, w, h) {
  // Stichprobe reicht: Ränder und Mitte prüfen
  const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] < 250) return true;
    }
  }
  return false;
}

/**
 * Gibt eine (falls nötig) verkleinerte Kopie des Bildes zurück.
 * Kleine Bilder unter dem Limit und mit passender Größe bleiben unverändert.
 * @param {File} file
 * @returns {Promise<File>}
 */
export async function shrinkImage(file) {
  if (typeof window === 'undefined' || !file?.type?.startsWith('image/')) return file;

  const img = await loadImage(file);
  const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
  if (file.size <= TARGET_BYTES && longEdge <= MAX_EDGE) return file;

  const base = file.name.replace(/\.[^.]+$/, '') || 'bild';
  let edge = Math.min(MAX_EDGE, longEdge);

  for (let attempt = 0; attempt < 6; attempt++) {
    const scale  = edge / longEdge;
    const w      = Math.max(1, Math.round(img.naturalWidth * scale));
    const h      = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    const transparent = file.type !== 'image/jpeg' && hasTransparency(ctx, w, h);

    let blob = null;
    let ext  = 'jpg';
    if (transparent) {
      blob = await toBlob(canvas, 'image/webp', 0.85);
      if (blob && blob.type === 'image/webp') ext = 'webp';
      else { blob = await toBlob(canvas, 'image/png'); ext = 'png'; }
    } else {
      for (const q of [0.85, 0.78, 0.7]) {
        blob = await toBlob(canvas, 'image/jpeg', q);
        if (blob && blob.size <= TARGET_BYTES) break;
      }
    }

    if (blob && blob.size <= TARGET_BYTES) {
      return new File([blob], `${base}.${ext}`, { type: blob.type, lastModified: Date.now() });
    }
    edge = Math.round(edge * 0.8); // noch zu groß → kleiner rechnen
  }
  throw new Error('Das Bild ließ sich nicht ausreichend verkleinern. Bitte ein kleineres Bild wählen.');
}
