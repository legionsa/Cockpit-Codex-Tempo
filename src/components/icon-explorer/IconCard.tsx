import React from 'react';
import { IconData } from './types';

interface IconCardProps {
    icon: IconData;
    onClick: (icon: IconData) => void;
}

export function IconCard({ icon, onClick }: IconCardProps) {
    return (
        <button
            onClick={() => onClick(icon)}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={icon.name}
        >
            <div
                className="w-8 h-8 mb-3 text-foreground"
                dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
            <span className="text-xs text-center font-medium truncate w-full">
                {icon.name}
            </span>
        </button>
    );
}
