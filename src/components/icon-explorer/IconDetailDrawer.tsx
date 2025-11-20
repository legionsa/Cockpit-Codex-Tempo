import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, Download } from 'lucide-react';
import { IconData } from './types';

interface IconDetailDrawerProps {
    icon: IconData | null;
    open: boolean;
    onClose: () => void;
}

export function IconDetailDrawer({ icon, open, onClose }: IconDetailDrawerProps) {
    if (!icon) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const downloadSvg = () => {
        const blob = new Blob([icon.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${icon.name.toLowerCase()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{icon.name}</SheetTitle>
                    <SheetDescription>
                        {icon.category} • {icon.status || 'Stable'}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-100px)] pr-4">
                    <div className="py-6">
                        {/* Preview */}
                        <div className="flex items-center justify-center p-12 border rounded-lg bg-muted/20 mb-6">
                            <div
                                className="w-24 h-24 text-foreground"
                                dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mb-6">
                            <Button variant="outline" className="flex-1" onClick={downloadSvg}>
                                <Download className="mr-2 h-4 w-4" />
                                Download SVG
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(icon.svg)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy SVG
                            </Button>
                        </div>

                        <Separator className="my-6" />

                        {/* Metadata */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {icon.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>

                            {icon.usage && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Usage</h4>
                                    <p className="text-sm text-muted-foreground">{icon.usage}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Maintained By</h4>
                                    <p className="text-sm text-muted-foreground">{icon.maintainedBy || 'Unknown'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Available Sizes</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {icon.sizes?.join(', ') || 'Scalable'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
