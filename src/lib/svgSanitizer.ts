import DOMPurify from 'dompurify';

/**
 * Sanitize SVG to prevent XSS attacks
 * Removes scripts, event handlers, and foreign objects
 */
export function sanitizeSvg(svgString: string): string {
    const sanitized = DOMPurify.sanitize(svgString, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ALLOWED_TAGS: [
            'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
            'ellipse', 'g', 'defs', 'mask', 'clipPath', 'linearGradient',
            'radialGradient', 'stop', 'use', 'symbol', 'title', 'desc'
        ],
        ALLOWED_ATTR: [
            'viewBox', 'fill', 'stroke', 'stroke-width',
            'stroke-linecap', 'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'rx', 'ry',
            'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform', 'id',
            'class', 'opacity', 'fill-opacity', 'stroke-opacity', 'offset',
            'stop-color', 'stop-opacity', 'xlink:href', 'href'
        ],
        FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'width', 'height']
    });

    return sanitized;
}

/**
 * Validate SVG file size
 */
export function validateSvgSize(svgString: string, maxKB: number = 50): boolean {
    const sizeKB = new Blob([svgString]).size / 1024;
    return sizeKB <= maxKB;
}

/**
 * Extract SVG dimensions
 */
export function getSvgDimensions(svgString: string): { width: number; height: number } | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) return null;

    const width = parseInt(svg.getAttribute('width') || '0');
    const height = parseInt(svg.getAttribute('height') || '0');

    return { width, height };
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
