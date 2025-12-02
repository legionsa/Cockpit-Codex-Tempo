import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const iconList = useMemo(() => {
        return Object.keys(LucideIcons)
            .filter((key) => key !== 'icons' && key !== 'createLucideIcon') // Filter out non-icon exports
            .sort();
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search) return iconList;
        return iconList.filter((icon) =>
            icon.toLowerCase().includes(search.toLowerCase())
        );
    }, [iconList, search]);

    const SelectedIcon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? (
                        <div className="flex items-center gap-2">
                            {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                            <span>{value}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Select icon...</span>
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <ScrollArea className="h-[300px] p-4">
                    <div className="grid grid-cols-4 gap-2">
                        {filteredIcons.slice(0, 50).map((iconName) => {
                            const Icon = (LucideIcons as any)[iconName];
                            if (!Icon) return null;

                            return (
                                <Button
                                    key={iconName}
                                    variant="ghost"
                                    className={cn(
                                        "h-10 w-10 p-0 flex items-center justify-center hover:bg-accent",
                                        value === iconName && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => {
                                        onChange(iconName);
                                        setOpen(false);
                                    }}
                                    title={iconName}
                                >
                                    <Icon className="h-6 w-6" />
                                </Button>
                            );
                        })}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-4 text-center text-sm text-muted-foreground py-4">
                                No icons found.
                            </div>
                        )}
                        {filteredIcons.length > 50 && (
                            <div className="col-span-4 text-center text-xs text-muted-foreground py-2">
                                {filteredIcons.length - 50} more icons... use search to find them.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
