import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface IconSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function IconSearchBar({ value, onChange }: IconSearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search icons..."
                className="pl-9"
            />
        </div>
    );
}
