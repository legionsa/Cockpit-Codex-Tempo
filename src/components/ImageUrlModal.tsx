import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUrlModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

export function ImageUrlModal({ open, onClose, onConfirm }: ImageUrlModalProps) {
    const [url, setUrl] = useState('');

    const handleConfirm = () => {
        if (url.trim()) {
            onConfirm(url.trim());
            setUrl('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Image from URL</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <Input
                            id="image-url"
                            placeholder="https://example.com/image.png"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Place</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
