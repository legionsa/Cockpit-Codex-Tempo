import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';

interface SearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Search({ open, onOpenChange }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectResult(results[selectedIndex].item);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const pages = storage.getPages();
    const searchData = pages.map(page => ({
      ...page,
      searchableContent: page.content.blocks
        .map(block => {
          if (block.type === 'paragraph' || block.type === 'header') {
            return block.data.text;
          }
          return '';
        })
        .join(' ')
    }));

    const fuse = new Fuse(searchData, {
      keys: ['title', 'summary', 'tags', 'searchableContent'],
      threshold: 0.3,
      includeScore: true
    });

    const searchResults = fuse.search(searchQuery);
    setResults(searchResults.slice(0, 10));
  };

  const handleSelectResult = (page: any) => {
    const breadcrumbs = storage.getBreadcrumbs(page.id);
    const path = '/' + breadcrumbs.map(p => p.slug).join('/');
    navigate(path);
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Documentation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, components, and content..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              autoFocus
            />
          </div>
          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={result.item.id}
                  onClick={() => handleSelectResult(result.item)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    index === selectedIndex ? "bg-accent" : "hover:bg-accent"
                  )}
                >
                  <div className="font-medium">{result.item.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {result.item.summary}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {result.item.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
          {query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}