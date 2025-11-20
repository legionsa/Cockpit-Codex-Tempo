/**
 * Dynamically inject SVG favicon into document head
 */
export function injectFavicon(svgString: string): void {
    // Remove existing favicon
    const existing = document.querySelector('link[rel="icon"]');
    if (existing) existing.remove();

    // Create data URL from SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    // Create and append new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * Dynamically inject Google Font into document head
 */
export function injectGoogleFont(fontUrl: string, fontFamily: string): void {
    // Remove existing font link
    const existing = document.querySelector('link[data-google-font]');
    if (existing) existing.remove();

    // Create new font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.setAttribute('data-google-font', 'true');
    document.head.appendChild(link);

    // Update CSS variable
    document.documentElement.style.setProperty(
        '--font-family',
        `"${fontFamily}", sans-serif`
    );
}

/**
 * Available Google Fonts
 */
export const GOOGLE_FONTS = [
    { name: 'Inter', weights: '300,400,500,600,700' },
    { name: 'Outfit', weights: '300,400,500,600,700' },
    { name: 'Plus Jakarta Sans', weights: '300,400,500,600,700' },
    { name: 'Sora', weights: '300,400,500,600,700' },
    { name: 'Work Sans', weights: '300,400,500,600,700' },
    { name: 'Figtree', weights: '300,400,500,600,700' },
    { name: 'Noto Sans', weights: '300,400,500,600,700' },
    { name: 'Lexend', weights: '300,400,500,600,700' },
    { name: 'Roboto Flex', weights: '300,400,500,600,700' },
];

/**
 * Get Google Font URL
 */
export function getGoogleFontUrl(fontName: string): string {
    const font = GOOGLE_FONTS.find(f => f.name === fontName);
    if (!font) return '';

    const formattedName = fontName.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${formattedName}:wght@${font.weights}&display=swap`;
}
