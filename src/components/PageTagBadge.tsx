import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';

interface PageTagBadgeProps {
    tag: string;
}

export function PageTagBadge({ tag }: PageTagBadgeProps) {
    const [tagData, setTagData] = useState<any>(null);

    useEffect(() => {
        const tags = storage.getTags();
        const found = tags.find((t: any) => t.label === tag);
        setTagData(found);
    }, [tag]);

    if (!tagData) return null;

    return (
        <Badge
            style={{ backgroundColor: tagData.color, color: '#fff' }}
            className="mr-2"
            title={tagData.description}
        >
            {tagData.label}
        </Badge>
    );
}
