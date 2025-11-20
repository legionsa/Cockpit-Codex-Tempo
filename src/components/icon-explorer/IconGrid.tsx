import React from 'react';
import { IconData } from './types';
import { IconCard } from './IconCard';

interface IconGridProps {
    icons: IconData[];
    onIconClick: (icon: IconData) => void;
}

export function IconGrid({ icons, onIconClick }: IconGridProps) {
    if (icons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>No icons found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {icons.map((icon, index) => (
                <IconCard
                    key={`${icon.name}-${index}`}
                    icon={icon}
                    onClick={onIconClick}
                />
            ))}
        </div>
    );
}
