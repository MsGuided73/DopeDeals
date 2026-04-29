'use client';

import Image, { type ImageProps } from 'next/image';
import { useCallback, useState } from 'react';
import { extractEdgeColor } from '../lib/image-edge-color';

type Props = Omit<ImageProps, 'onLoad'> & {
  // Background used until detection runs and for images that already
  // fill the tile (square images don't need a synthetic background).
  fallbackBg?: string;
};

// Wraps next/image with an absolute-positioned background div that
// matches the dominant edge color of the image — but only when the
// image doesn't already fill its container. Skipping the canvas work
// for square product shots keeps the common case free.
export default function SmartBgImage({ fallbackBg = '#ffffff', className, ...rest }: Props) {
  const [bg, setBg] = useState<string>(fallbackBg);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const color = extractEdgeColor(e.currentTarget, { skipIfSquare: true });
    if (color) setBg(color);
  }, []);

  return (
    <div
      style={{ backgroundColor: bg }}
      className="absolute inset-0 transition-colors duration-200"
    >
      <Image {...rest} onLoad={handleLoad} className={className} />
    </div>
  );
}
