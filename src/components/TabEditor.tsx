import React, { useState } from 'react';
import { PageTab } from '@/types/page';
import { PageEditor } from '@/components/PageEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TabEditorProps {
    tabs: PageTab[];
    activeTabId: string;
    onTabsChange: (tabs: PageTab[]) => void;
    onActiveTabChange: (tabId: string) => void;
    isEditing: boolean;
}

export function TabEditor({
    tabs,
    activeTabId,
    onTabsChange,
    onActiveTabChange,
    isEditing
}: TabEditorProps) {
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const addTab = () => {
        const newTab: PageTab = {
            id: `tab-${Date.now()}`,
            label: 'New Tab',
            content: { time: Date.now(), blocks: [], version: '2.29.0' }
        };
        onTabsChange([...tabs, newTab]);
        onActiveTabChange(newTab.id);
    };

    const removeTab = (tabId: string) => {
        if (tabs.length === 1) {
            alert('Cannot delete the last tab');
            return;
        }
        const newTabs = tabs.filter(t => t.id !== tabId);
        onTabsChange(newTabs);
        if (activeTabId === tabId) {
            onActiveTabChange(newTabs[0].id);
        }
        setDeleteConfirmId(null);
    };

    const moveTab = (fromIndex: number, toIndex: number) => {
        const newTabs = [...tabs];
        const [moved] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, moved);
        onTabsChange(newTabs);
    };

    const updateTabLabel = (tabId: string, label: string) => {
        onTabsChange(tabs.map(t =>
            t.id === tabId ? { ...t, label } : t
        ));
    };

    const activeTabIndex = tabs.findIndex(t => t.id === activeTabId);
    const activeTab = tabs[activeTabIndex];

    return (
        <div className="space-y-4">
            {/* Tab list */}
            <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.id}
                        className={`group flex items-center gap-1 px-3 py-2 rounded-md border ${tab.id === activeTabId
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-muted'
                            }`}
                    >
                        {editingLabelId === tab.id ? (
                            <Input
                                value={tab.label}
                                onChange={(e) => updateTabLabel(tab.id, e.target.value)}
                                onBlur={() => setEditingLabelId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingLabelId(null);
                                    if (e.key === 'Escape') setEditingLabelId(null);
                                }}
                                className="h-6 w-24 text-sm"
                                autoFocus
                                disabled={!isEditing}
                            />
                        ) : (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onActiveTabChange(tab.id)}
                                    className="text-sm font-medium"
                                >
                                    {tab.label}
                                </button>
                                {isEditing && tab.id === activeTabId && (
                                    <button
                                        onClick={() => setEditingLabelId(tab.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Rename tab"
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        )}

                        {isEditing && (
                            <div className="flex items-center gap-1 ml-2">
                                {index > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => moveTab(index, index - 1)}
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                    </Button>
                                )}
                                {index < tabs.length - 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => moveTab(index, index + 1)}
                                    >
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    onClick={() => setDeleteConfirmId(tab.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <Button onClick={addTab} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tab
                    </Button>
                )}
            </div>

            {/* Active tab editor */}
            {activeTab && (
                <div className="border rounded-lg p-4">
                    <PageEditor
                        key={activeTab.id}
                        content={activeTab.content}
                        onChange={(content) => {
                            onTabsChange(tabs.map(t =>
                                t.id === activeTab.id ? { ...t, content } : t
                            ));
                        }}
                        readOnly={!isEditing}
                    />
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tab?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this tab and all its content. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirmId && removeTab(deleteConfirmId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
