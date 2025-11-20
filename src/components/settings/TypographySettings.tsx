import { useState } from 'react';
import { useSettings } from '@/lib/settingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GOOGLE_FONTS, getGoogleFontUrl } from '@/lib/assetInjector';

export function TypographySettings() {
    const { settings, updateSettings } = useSettings();
    const [selectedFont, setSelectedFont] = useState(settings.fontFamily);
    const [isSaving, setIsSaving] = useState(false);

    async function handleApply() {
        setIsSaving(true);
        try {
            const fontUrl = getGoogleFontUrl(selectedFont);
            await updateSettings({
                fontFamily: selectedFont,
                fontImportUrl: fontUrl
            });
            alert('✅ Font applied successfully!');
        } catch (error) {
            console.error('Error applying font:', error);
            alert('❌ Error applying font');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Font Family</h3>

                <div className="space-y-2">
                    <Label>Select Font</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {GOOGLE_FONTS.map(font => (
                                <SelectItem key={font.name} value={font.name}>
                                    <span style={{ fontFamily: `"${font.name}", sans-serif` }}>
                                        {font.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        Font will be loaded from Google Fonts
                    </p>
                </div>
            </Card>

            {/* Preview */}
            <Card className="p-8 bg-muted/30" style={{ fontFamily: `"${selectedFont}", sans-serif` }}>
                <h3 className="text-3xl font-bold mb-4">Preview</h3>
                <h4 className="text-2xl font-semibold mb-2">Heading Level 2</h4>
                <h5 className="text-xl font-medium mb-4">Heading Level 3</h5>
                <p className="text-base mb-4">
                    The quick brown fox jumps over the lazy dog. This is a sample paragraph
                    to demonstrate how the selected font looks in regular text.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    1234567890 • ABCDEFGHIJKLMNOPQRSTUVWXYZ • abcdefghijklmnopqrstuvwxyz
                </p>

                {/* Weight Preview */}
                <div className="grid grid-cols-5 gap-4 text-center">
                    <div>
                        <div className="font-light text-lg mb-1">Aa</div>
                        <div className="text-xs text-muted-foreground">Light (300)</div>
                    </div>
                    <div>
                        <div className="font-normal text-lg mb-1">Aa</div>
                        <div className="text-xs text-muted-foreground">Regular (400)</div>
                    </div>
                    <div>
                        <div className="font-medium text-lg mb-1">Aa</div>
                        <div className="text-xs text-muted-foreground">Medium (500)</div>
                    </div>
                    <div>
                        <div className="font-semibold text-lg mb-1">Aa</div>
                        <div className="text-xs text-muted-foreground">Semibold (600)</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg mb-1">Aa</div>
                        <div className="text-xs text-muted-foreground">Bold (700)</div>
                    </div>
                </div>
            </Card>

            <Button onClick={handleApply} disabled={isSaving} className="w-full">
                {isSaving ? 'Applying...' : 'Apply Font'}
            </Button>
        </div>
    );
}
