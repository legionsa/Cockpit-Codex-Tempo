import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardItem } from '@/types/page';
import { 
  Palette, Layers, Code, BookOpen, Settings, Layout, 
  Type, Grid, Box, Zap, Shield, Globe, ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  palette: Palette,
  layers: Layers,
  code: Code,
  book: BookOpen,
  settings: Settings,
  layout: Layout,
  type: Type,
  grid: Grid,
  box: Box,
  zap: Zap,
  shield: Shield,
  globe: Globe,
};

interface CardGridProps {
  cards: CardItem[];
  columns?: 2 | 3 | 4;
}

export function CardGrid({ cards, columns = 3 }: CardGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {cards.map((card, index) => {
        const IconComponent = card.icon ? iconMap[card.icon.toLowerCase()] : null;
        
        return (
          <Link key={index} to={card.link} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
              {card.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                {IconComponent && (
                  <IconComponent className="h-10 w-10 mb-3 text-primary" />
                )}
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  {card.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
