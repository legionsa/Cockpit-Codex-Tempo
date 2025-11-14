import React from 'react';
import { Card } from '@/components/ui/card';

interface FigmaEmbedProps {
  url: string;
  title?: string;
  height?: number;
  width?: string;
}

export function FigmaEmbed({ 
  url, 
  title = 'Figma Design', 
  height = 450,
  width = '100%' 
}: FigmaEmbedProps) {
  // Extract Figma file ID and convert to embed URL
  const getEmbedUrl = (figmaUrl: string) => {
    // Handle both file and proto URLs
    const match = figmaUrl.match(/figma\.com\/(file|proto)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;
    }
    return figmaUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <Card className="overflow-hidden my-6">
      <iframe
        src={embedUrl}
        title={title}
        style={{ 
          width, 
          height: `${height}px`,
          border: 'none'
        }}
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        className="w-full"
      />
    </Card>
  );
}
