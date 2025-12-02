import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  config: HeroConfig;
  title?: string;
  subtitle?: string;
}

export function HeroSection({ config, title, subtitle }: HeroSectionProps) {
  const displayTitle = config.title || title;
  const displaySubtitle = config.subtitle || subtitle;
  const isLight = config.textColor === 'light';

  return (
    <div 
      className={cn(
        "relative w-full py-20 md:py-32 px-6",
        config.backgroundImage ? "bg-cover bg-center" : "",
        !config.backgroundImage && !config.backgroundColor && "bg-gradient-to-br from-primary/10 via-background to-primary/5"
      )}
      style={{
        backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
        backgroundColor: config.backgroundColor || undefined,
      }}
    >
      {config.backgroundImage && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      
      <div className="relative max-w-4xl mx-auto text-center">
        {displayTitle && (
          <h1 className={cn(
            "text-4xl md:text-6xl font-bold mb-6 tracking-tight",
            isLight ? "text-white" : "text-foreground"
          )}>
            {displayTitle}
          </h1>
        )}
        
        {displaySubtitle && (
          <p className={cn(
            "text-lg md:text-xl mb-8 max-w-2xl mx-auto",
            isLight ? "text-white/90" : "text-muted-foreground"
          )}>
            {displaySubtitle}
          </p>
        )}
        
        {(config.ctaText || config.secondaryCtaText) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {config.ctaText && config.ctaLink && (
              <Button asChild size="lg" className="min-w-[140px]">
                <Link to={config.ctaLink}>{config.ctaText}</Link>
              </Button>
            )}
            {config.secondaryCtaText && config.secondaryCtaLink && (
              <Button asChild variant="outline" size="lg" className={cn(
                "min-w-[140px]",
                isLight && "border-white text-white hover:bg-white/10"
              )}>
                <Link to={config.secondaryCtaLink}>{config.secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
