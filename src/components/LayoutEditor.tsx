import React, { useState } from 'react';
import { Page, PageLayout, LayoutConfig, CardItem, HeroConfig } from '@/types/page';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface LayoutEditorProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
  disabled?: boolean;
}

const layoutOptions: { value: PageLayout; label: string; description: string }[] = [
  { value: 'default', label: 'Default', description: 'Standard documentation page with sidebar navigation' },
  { value: 'landing', label: 'Landing Page', description: 'Hero section with card grid - like Atlassian home' },
  { value: 'grid', label: 'Card Grid', description: 'Category page with card navigation' },
  { value: 'full-width', label: 'Full Width', description: 'Full width content without sidebar' },
  { value: 'article', label: 'Article', description: 'Narrow, centered content for blog posts' },
  { value: 'component', label: 'Component', description: 'Component showcase with tags and examples' },
];

const iconOptions = [
  'palette', 'layers', 'code', 'book', 'settings', 'layout', 
  'type', 'grid', 'box', 'zap', 'shield', 'globe'
];

export function LayoutEditor({ page, onChange, disabled }: LayoutEditorProps) {
  const layout = page.layout || 'default';
  const config = page.layoutConfig || {};

  const updateConfig = (updates: Partial<LayoutConfig>) => {
    onChange({ layoutConfig: { ...config, ...updates } });
  };

  const updateHero = (updates: Partial<HeroConfig>) => {
    updateConfig({ hero: { ...config.hero, ...updates } });
  };

  const addCard = () => {
    const newCard: CardItem = {
      title: 'New Card',
      description: 'Card description',
      icon: 'box',
      link: '/'
    };
    updateConfig({ cards: [...(config.cards || []), newCard] });
  };

  const updateCard = (index: number, updates: Partial<CardItem>) => {
    const cards = [...(config.cards || [])];
    cards[index] = { ...cards[index], ...updates };
    updateConfig({ cards });
  };

  const removeCard = (index: number) => {
    const cards = [...(config.cards || [])];
    cards.splice(index, 1);
    updateConfig({ cards });
  };

  return (
    <div className="space-y-6">
      {/* Layout Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Page Layout</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ layout: option.value })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                layout === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium mb-1">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <Accordion type="multiple" className="w-full">
        {/* Display Options */}
        <AccordionItem value="display">
          <AccordionTrigger>Display Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label>Show Breadcrumbs</Label>
                <Switch
                  checked={config.showBreadcrumbs !== false}
                  onCheckedChange={(checked) => updateConfig({ showBreadcrumbs: checked })}
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Title</Label>
                <Switch
                  checked={config.showTitle !== false}
                  onCheckedChange={(checked) => updateConfig({ showTitle: checked })}
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Summary</Label>
                <Switch
                  checked={config.showSummary !== false}
                  onCheckedChange={(checked) => updateConfig({ showSummary: checked })}
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show "On This Page" Navigation</Label>
                <Switch
                  checked={config.showOnThisPage !== false}
                  onCheckedChange={(checked) => updateConfig({ showOnThisPage: checked })}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Content Width</Label>
                <Select
                  value={config.maxWidth || 'default'}
                  onValueChange={(value: any) => updateConfig({ maxWidth: value })}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (768px)</SelectItem>
                    <SelectItem value="default">Default (1024px)</SelectItem>
                    <SelectItem value="wide">Wide (1280px)</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Hero Section (for landing/grid layouts) */}
        {(layout === 'landing' || layout === 'grid') && (
          <AccordionItem value="hero">
            <AccordionTrigger>Hero Section</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Hero Title (optional, defaults to page title)</Label>
                  <Input
                    value={config.hero?.title || ''}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    placeholder="Override page title..."
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle (optional, defaults to summary)</Label>
                  <Textarea
                    value={config.hero?.subtitle || ''}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    placeholder="Override page summary..."
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Image URL</Label>
                  <Input
                    value={config.hero?.backgroundImage || ''}
                    onChange={(e) => updateHero({ backgroundImage: e.target.value })}
                    placeholder="https://..."
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    value={config.hero?.backgroundColor || ''}
                    onChange={(e) => updateHero({ backgroundColor: e.target.value })}
                    placeholder="#1e40af or rgb(30, 64, 175)"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Select
                    value={config.hero?.textColor || 'dark'}
                    onValueChange={(value: any) => updateHero({ textColor: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark (for light backgrounds)</SelectItem>
                      <SelectItem value="light">Light (for dark backgrounds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary CTA Text</Label>
                    <Input
                      value={config.hero?.ctaText || ''}
                      onChange={(e) => updateHero({ ctaText: e.target.value })}
                      placeholder="Get Started"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA Link</Label>
                    <Input
                      value={config.hero?.ctaLink || ''}
                      onChange={(e) => updateHero({ ctaLink: e.target.value })}
                      placeholder="/getting-started"
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secondary CTA Text</Label>
                    <Input
                      value={config.hero?.secondaryCtaText || ''}
                      onChange={(e) => updateHero({ secondaryCtaText: e.target.value })}
                      placeholder="View Components"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Link</Label>
                    <Input
                      value={config.hero?.secondaryCtaLink || ''}
                      onChange={(e) => updateHero({ secondaryCtaLink: e.target.value })}
                      placeholder="/components"
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Cards Section (for landing/grid layouts) */}
        {(layout === 'landing' || layout === 'grid') && (
          <AccordionItem value="cards">
            <AccordionTrigger>Navigation Cards</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {(config.cards || []).map((card, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Card {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCard(index)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={card.title}
                            onChange={(e) => updateCard(index, { title: e.target.value })}
                            disabled={disabled}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Link</Label>
                          <Input
                            value={card.link}
                            onChange={(e) => updateCard(index, { link: e.target.value })}
                            placeholder="/path"
                            disabled={disabled}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={card.description}
                          onChange={(e) => updateCard(index, { description: e.target.value })}
                          rows={2}
                          disabled={disabled}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Icon</Label>
                          <Select
                            value={card.icon || ''}
                            onValueChange={(value) => updateCard(index, { icon: value })}
                            disabled={disabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon.charAt(0).toUpperCase() + icon.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Image URL (optional)</Label>
                          <Input
                            value={card.image || ''}
                            onChange={(e) => updateCard(index, { image: e.target.value })}
                            placeholder="https://..."
                            disabled={disabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addCard}
                  disabled={disabled}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Page Icon */}
        <AccordionItem value="icon">
          <AccordionTrigger>Page Icon</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Label>Icon (for navigation and cards)</Label>
              <Select
                value={page.icon || ''}
                onValueChange={(value) => onChange({ icon: value })}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon.charAt(0).toUpperCase() + icon.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
