import React from 'react';
import { EditorRenderer } from '@/components/EditorRenderer';
import { EditorJSBlock } from '@/types/page';

interface DefaultLayoutProps {
    blocks: EditorJSBlock[];
}

export function DefaultLayout({ blocks }: DefaultLayoutProps) {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <EditorRenderer blocks={blocks} />
        </div>
    );
}
