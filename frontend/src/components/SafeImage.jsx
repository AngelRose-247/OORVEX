import React, { useState } from 'react';

// Elegant Nalukettu & Nilavilakku Heritage SVG Fallback Data URI
// Styled with traditional Kerala temple architecture palette: #123B32, #C9A45C, #9E4035
export const HERITAGE_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23103B30" />
      <stop offset="50%" stop-color="%231a4d3f" />
      <stop offset="100%" stop-color="%230b261f" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23F3E5AB" />
      <stop offset="50%" stop-color="%23C9A45C" />
      <stop offset="100%" stop-color="%238C6D2B" />
    </linearGradient>
    <radialGradient id="flame" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="%23FFF6BD" />
      <stop offset="40%" stop-color="%23FF9F1C" />
      <stop offset="100%" stop-color="%23E71D36" stop-opacity="0" />
    </radialGradient>
    <pattern id="nalukettuWood" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="%23C9A45C" stroke-width="0.75" stroke-opacity="0.15" />
    </pattern>
  </defs>

  <rect width="800" height="500" fill="url(%23bg)" />
  <rect width="800" height="500" fill="url(%23nalukettuWood)" />

  <g transform="translate(400, 220)" text-anchor="middle">
    <!-- Traditional Nilavilakku Oil Lamp Silhouette -->
    <!-- Base -->
    <path d="M-50,140 C-30,120 30,120 50,140 L70,160 L-70,160 Z" fill="url(%23gold)" />
    <ellipse cx="0" cy="140" rx="55" ry="12" fill="%23B28E46" />
    <!-- Lower stem & rings -->
    <rect x="-8" y="70" width="16" height="70" fill="url(%23gold)" rx="4" />
    <ellipse cx="0" cy="100" rx="18" ry="6" fill="%23E5C178" />
    <ellipse cx="0" cy="70" rx="24" ry="7" fill="%23B28E46" />
    <!-- Oil Bowl / Thattu -->
    <ellipse cx="0" cy="40" rx="75" ry="16" fill="url(%23gold)" />
    <ellipse cx="0" cy="38" rx="68" ry="12" fill="%237D5A1E" />
    <ellipse cx="0" cy="39" rx="60" ry="8" fill="%23E59B2A" opacity="0.8" />
    <!-- Upper crown / Makudam -->
    <path d="M-10,38 L0,-10 L10,38 Z" fill="url(%23gold)" />
    <!-- Central flame -->
    <circle cx="0" cy="-20" r="32" fill="url(%23flame)" />
    <path d="M0,-35 C-8,-20 -6,-10 0,-5 C6,-10 8,-20 0,-35 Z" fill="%23FFFBEA" />
    <!-- Side wicks -->
    <circle cx="-50" cy="32" r="14" fill="url(%23flame)" />
    <circle cx="50" cy="32" r="14" fill="url(%23flame)" />
  </g>

  <!-- Typography & Heritage Badge -->
  <g text-anchor="middle">
    <rect x="250" y="390" width="300" height="34" rx="17" fill="%23FFFCF5" fill-opacity="0.12" stroke="%23C9A45C" stroke-width="1.2" stroke-opacity="0.5" />
    <text x="400" y="412" font-family="'Cinzel', 'Noto Serif Malayalam', Georgia, serif" font-size="13" font-weight="bold" fill="%23F3E5AB" letter-spacing="3">OORVEX KERALA HERITAGE</text>
    <text x="400" y="445" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="%23E8D8B8" fill-opacity="0.75" letter-spacing="1">Authentic Cultural Archive</text>
  </g>
</svg>`;

export const DEFAULT_PLACEHOLDER_PATH = '/images/placeholders/kerala-heritage.jpg';

export default function SafeImage({
  src,
  alt = 'Kerala Cultural Heritage',
  fallbackSrc = DEFAULT_PLACEHOLDER_PATH,
  className = '',
  loading = 'lazy',
  onError,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [errorStage, setErrorStage] = useState(0);

  // If the src prop changes externally, reset error stage and update src
  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setErrorStage(0);
  }, [src, fallbackSrc]);

  const handleImageError = (e) => {
    if (errorStage === 0) {
      // First fallback: attempt local verified placeholder image
      setErrorStage(1);
      setCurrentSrc(fallbackSrc);
    } else if (errorStage === 1) {
      // Second fallback: inline SVG data URI that can NEVER fail
      setErrorStage(2);
      setCurrentSrc(HERITAGE_FALLBACK_SVG);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleImageError}
      {...props}
    />
  );
}

