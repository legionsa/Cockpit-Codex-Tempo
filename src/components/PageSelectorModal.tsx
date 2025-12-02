import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Page } from '@/types/page';
import { cn } from '@/lib/utils';

interface PageSelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (page: Page) => void;
}

export function PageSelectorModal({ open, onClose, onSelect }: PageSelectorModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [pages, setPages] = useState<Page[]>([]);
    const [filteredPages, setFilteredPages] = useState<Page[]>([]);

    useEffect(() => {
        if (open) {
            const allPages = storage.getPages();
            setPages(allPages);
            setFilteredPages(allPages);
            setSearchQuery('');
        }
    }, [open]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPages(pages);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = pages.filter(page =>
            page.title.toLowerCase().includes(query) ||
            page.slug.toLowerCase().includes(query)
        );
        setFilteredPages(filtered);
    }, [searchQuery, pages]);

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Link to Page</DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b bg-muted/30">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredPages.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No pages found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredPages.map((page) => (
                                <button
                                    key={page.id}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                                    )}
                                    onClick={() => onSelect(page)}
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="truncate font-medium">{page.title}</div>
                                        <div className="truncate text-xs text-muted-foreground">
                                            /{page.slug}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
