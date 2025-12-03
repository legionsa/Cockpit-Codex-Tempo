import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconLibraryManager } from '@/components/icon-explorer/IconLibraryManager';

interface Icon {
  name: string;
  category: string;
  svg: string;
}

interface IconLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectIcon: (icon: Icon) => void;
}

export function IconLibraryModal({ open, onClose, onSelectIcon }: IconLibraryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Icon Library</DialogTitle>
        </DialogHeader>

        <IconLibraryManager
          mode="modal"
          onSelectIcon={(icon) => {
            onSelectIcon(icon);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
