import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Icon {
  name: string;
  category: string;
  svg: string;
}

interface IconLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectIcon: (icon: Icon) => void;
}

export function IconLibraryModal({ open, onClose, onSelectIcon }: IconLibraryModalProps) {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const cachedIcons = localStorage.getItem('icon-library-cache');
    if (cachedIcons) {
      const parsed = JSON.parse(cachedIcons);
      setIcons(parsed);
      setFilteredIcons(parsed);
      setLoading(false);
    } else {
      fetch('/icons.json')
        .then(res => res.json())
        .then(data => {
          setIcons(data);
          setFilteredIcons(data);
          localStorage.setItem('icon-library-cache', JSON.stringify(data));
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load icons:', err);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    let filtered = icons;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIcons(filtered);
    setFocusedIndex(0);
  }, [searchQuery, selectedCategory, icons]);

  const categories = ['all', ...Array.from(new Set(icons.map(icon => icon.category)))];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const cols = 6;
    const rows = Math.ceil(filteredIcons.length / cols);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredIcons.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + cols, filteredIcons.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - cols, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredIcons[focusedIndex]) {
          onSelectIcon(filteredIcons[focusedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Icon Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] border border-border rounded-lg p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading icons...
              </div>
            ) : filteredIcons.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No icons found
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredIcons.map((icon, index) => (
                  <button
                    key={`${icon.name}-${index}`}
                    onClick={() => {
                      onSelectIcon(icon);
                      onClose();
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                      hover:bg-accent hover:border-primary
                      ${index === focusedIndex ? 'bg-accent border-primary ring-2 ring-primary' : 'border-border'}
                    `}
                    title={icon.name}
                    aria-label={icon.name}
                  >
                    <div 
                      className="w-8 h-8 text-foreground"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                    <span className="text-xs mt-2 text-center truncate w-full">
                      {icon.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded">↑↓←→</kbd> Navigate • 
            <kbd className="px-2 py-1 bg-muted rounded ml-2">Enter</kbd> Select • 
            <kbd className="px-2 py-1 bg-muted rounded ml-2">Esc</kbd> Close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
