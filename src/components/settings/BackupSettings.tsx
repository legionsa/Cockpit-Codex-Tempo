import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage, Backup } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, RotateCcw, Trash2, FileJson, History } from 'lucide-react';
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

export function BackupSettings() {
    const { toast } = useToast();
    const [backups, setBackups] = useState<Backup[]>([]);
    const [showRestoreDialog, setShowRestoreDialog] = useState<string | null>(null);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = () => {
        setBackups(storage.getBackups());
    };

    const handleCreateBackup = () => {
        const label = `Backup ${new Date().toLocaleString()}`;
        storage.createBackup(label);
        loadBackups();
        toast({
            title: 'Backup Created',
            description: 'A new backup has been created successfully.'
        });
    };

    const handleExport = () => {
        // Create a fresh backup first to ensure we export latest state
        const backup = storage.createBackup(`Exported: ${new Date().toLocaleString()}`);
        loadBackups();

        // Create download link
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `cockpit-backup-${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        toast({
            title: 'Export Successful',
            description: 'Your site data has been downloaded.'
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImportFile(e.target.files[0]);
            setShowImportDialog(true);
        }
    };

    const handleImport = async () => {
        if (!importFile) return;

        try {
            const text = await importFile.text();
            storage.importBackup(text);
            loadBackups();
            setShowImportDialog(false);
            setImportFile(null);

            toast({
                title: 'Import Successful',
                description: 'Site data has been restored from the backup file.'
            });

            // Reload to reflect changes
            window.location.reload();
        } catch (error) {
            toast({
                title: 'Import Failed',
                description: 'The backup file is invalid or corrupted.',
                variant: 'destructive'
            });
        }
    };

    const handleRestore = (id: string) => {
        try {
            storage.restoreBackup(id);
            setShowRestoreDialog(null);
            toast({
                title: 'Restored Successfully',
                description: 'Site data has been restored to the selected backup.'
            });
            window.location.reload();
        } catch (error) {
            toast({
                title: 'Restore Failed',
                description: 'Could not restore the selected backup.',
                variant: 'destructive'
            });
        }
    };

    const handleDelete = (id: string) => {
        storage.deleteBackup(id);
        loadBackups();
        toast({
            title: 'Backup Deleted',
            description: 'The backup has been removed from history.'
        });
    };

    const handleDownloadBackup = (backup: Backup) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `cockpit-backup-${backup.timestamp}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                    <CardDescription>
                        Manage your site data. Export a backup to keep it safe, or import one to restore your site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Export Data</Label>
                            <Button onClick={handleExport} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download Backup
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Downloads a JSON file containing all pages, settings, and users.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Import Data</Label>
                            <div className="relative">
                                <Button variant="outline" className="w-full relative">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Backup
                                    <Input
                                        type="file"
                                        accept=".json"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileSelect}
                                    />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Restores your site from a previously exported JSON file.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        <CardTitle>History</CardTitle>
                    </div>
                    <CardDescription>
                        Recent backups and imports (Last 5). You can restore or download any of these.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {backups.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No backups found.
                            </div>
                        ) : (
                            backups.map((backup) => (
                                <div
                                    key={backup.id}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <FileJson className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{backup.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(backup.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadBackup(backup)}
                                            title="Download JSON"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowRestoreDialog(backup.id)}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Restore
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(backup.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!showRestoreDialog} onOpenChange={() => setShowRestoreDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Restore Backup?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will overwrite all current site data with the data from this backup. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => showRestoreDialog && handleRestore(showRestoreDialog)}>
                            Restore
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Import Backup?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to import a backup file. This will overwrite all current site data. Are you sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setImportFile(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleImport}>
                            Import & Restore
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
