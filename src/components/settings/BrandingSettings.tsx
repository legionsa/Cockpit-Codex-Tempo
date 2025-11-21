import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/settingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sanitizeSvg, validateSvgSize, readFileAsText } from '@/lib/svgSanitizer';
import { Upload, ImageIcon, Trash2, RotateCcw } from 'lucide-react';

export function BrandingSettings() {
    const { settings, updateSettings } = useSettings();
    const [siteName, setSiteName] = useState(settings.siteName);
    const [dashboardTitle, setDashboardTitle] = useState(settings.dashboardTitle);
    const [brandIconPreview, setBrandIconPreview] = useState(settings.brandIconSvg);
    const [faviconPreview, setFaviconPreview] = useState(settings.faviconSvg);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state with settings when they change (e.g., after loading from IndexedDB)
    useEffect(() => {
        setSiteName(settings.siteName);
        setDashboardTitle(settings.dashboardTitle);
        setBrandIconPreview(settings.brandIconSvg);
        setFaviconPreview(settings.faviconSvg);
    }, [settings]);

    async function handleSvgUpload(
        file: File,
        type: 'brandIcon' | 'favicon'
    ) {
        try {
            console.log(`[BrandingSettings] Starting SVG upload for ${type}:`, file.name);
            const text = await readFileAsText(file);
            console.log(`[BrandingSettings] SVG text read, length: ${text.length}`);

            // Validate
            if (!validateSvgSize(text, 50)) {
                alert('❌ SVG file too large (max 50KB)');
                return;
            }

            const sanitized = sanitizeSvg(text);
            console.log(`[BrandingSettings] SVG sanitized, length: ${sanitized.length}`);
            console.log(`[BrandingSettings] Sanitized SVG:`, sanitized);

            if (type === 'brandIcon') {
                setBrandIconPreview(sanitized);
                console.log('[BrandingSettings] Brand icon preview set');
            } else {
                setFaviconPreview(sanitized);
                console.log('[BrandingSettings] Favicon preview set');
            }
        } catch (error) {
            console.error('Error uploading SVG:', error);
            alert('❌ Error uploading SVG file');
        }
    }

    async function handleSave() {
        setIsSaving(true);
        try {
            console.log('[BrandingSettings] Saving settings...');
            console.log('[BrandingSettings] Brand icon length:', brandIconPreview.length);
            console.log('[BrandingSettings] Favicon length:', faviconPreview.length);

            await updateSettings({
                siteName,
                dashboardTitle,
                brandIconSvg: brandIconPreview,
                faviconSvg: faviconPreview
            });

            console.log('[BrandingSettings] Settings saved successfully');
            alert('✅ Branding settings saved!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('❌ Error saving settings');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Site Identity</h3>

                {/* Site Name */}
                <div className="space-y-2 mb-4">
                    <Label htmlFor="siteName">Website Name</Label>
                    <Input
                        id="siteName"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="Cockpit Design System"
                    />
                    <p className="text-sm text-muted-foreground">
                        Appears in header and browser title
                    </p>
                </div>

                {/* Dashboard Title */}
                <div className="space-y-2">
                    <Label htmlFor="dashboardTitle">Dashboard Title</Label>
                    <Input
                        id="dashboardTitle"
                        value={dashboardTitle}
                        onChange={(e) => setDashboardTitle(e.target.value)}
                        placeholder="Dashboard"
                    />
                    <p className="text-sm text-muted-foreground">
                        Shown in admin header
                    </p>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Brand Assets</h3>

                {/* Brand Icon Upload */}
                <div className="space-y-2 mb-6">
                    <Label>Brand Icon (SVG, 1:1 ratio)</Label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <Input
                                type="file"
                                accept=".svg"
                                onChange={(e) => e.target.files?.[0] && handleSvgUpload(e.target.files[0], 'brandIcon')}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Max 50KB • Square (1:1) recommended
                            </p>
                        </div>
                        {brandIconPreview ? (
                            <div className="flex flex-col gap-2 items-center">
                                <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-muted p-1 overflow-hidden">
                                    <div
                                        className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                        style={{ maxWidth: '32px', maxHeight: '32px' }}
                                        dangerouslySetInnerHTML={{ __html: brandIconPreview }}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setBrandIconPreview('')}
                                    className="text-xs"
                                >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    Restore Default
                                </Button>
                            </div>
                        ) : (
                            <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                    <Label>Favicon (SVG)</Label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <Input
                                type="file"
                                accept=".svg"
                                onChange={(e) => e.target.files?.[0] && handleSvgUpload(e.target.files[0], 'favicon')}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Max 50KB • Appears in browser tab
                            </p>
                        </div>
                        {faviconPreview ? (
                            <div className="flex flex-col gap-2 items-center">
                                <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-muted p-1 overflow-hidden">
                                    <div
                                        className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                        style={{ maxWidth: '32px', maxHeight: '32px' }}
                                        dangerouslySetInnerHTML={{ __html: faviconPreview }}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFaviconPreview('')}
                                    className="text-xs"
                                >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    Restore Default
                                </Button>
                            </div>
                        ) : (
                            <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save Branding Settings'}
            </Button>
        </div>
    );
}
