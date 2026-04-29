// Sample the dominant color along the edges of an image. Used to make
// product image containers blend into the image's background instead of
// sitting on a white card that clashes with dark studio shots.

type Options = {
  // When true (default) and the image is square within ~2%, skip the
  // canvas work — a square image already covers a square tile, so
  // there's no visible whitespace to color-match. Set to false when you
  // want the extracted color regardless (e.g. PDP where chrome around
  // the image is what needs to blend, not the tile itself).
  skipIfSquare?: boolean;
};

export function extractEdgeColor(
  img: HTMLImageElement,
  { skipIfSquare = true }: Options = {}
): string | null {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;

  if (skipIfSquare && Math.abs(w / h - 1) < 0.02) return null;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  try {
    ctx.drawImage(img, 0, 0);
    // 4 corners + 4 edge midpoints, inset 1px to dodge anti-aliasing.
    const pts: Array<[number, number]> = [
      [1, 1],
      [w - 2, 1],
      [1, h - 2],
      [w - 2, h - 2],
      [Math.floor(w / 2), 1],
      [Math.floor(w / 2), h - 2],
      [1, Math.floor(h / 2)],
      [w - 2, Math.floor(h / 2)],
    ];
    let r = 0;
    let g = 0;
    let b = 0;
    for (const [x, y] of pts) {
      const px = ctx.getImageData(x, y, 1, 1).data;
      r += px[0];
      g += px[1];
      b += px[2];
    }
    const n = pts.length;
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  } catch {
    // Canvas tainted by CORS — let the caller keep its fallback.
    return null;
  }
}
