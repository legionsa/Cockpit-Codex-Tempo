import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from './indexedDB';
import { injectFavicon, injectGoogleFont } from './assetInjector';

export interface SiteSettings {
    siteName: string;
    dashboardTitle: string;
    brandIconSvg: string;
    faviconSvg: string;
    fontFamily: string;
    fontImportUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: "Cockpit Design System",
    dashboardTitle: "Dashboard",
    brandIconSvg: "",
    faviconSvg: "",
    fontFamily: "Inter",
    fontImportUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
};

interface SettingsContextType {
    settings: SiteSettings;
    updateSettings: (partial: Partial<SiteSettings>) => Promise<void>;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Apply favicon when it changes
    useEffect(() => {
        if (settings.faviconSvg) {
            injectFavicon(settings.faviconSvg);
        }
    }, [settings.faviconSvg]);

    // Apply font when it changes
    useEffect(() => {
        if (settings.fontImportUrl && settings.fontFamily) {
            injectGoogleFont(settings.fontImportUrl, settings.fontFamily);
        }
    }, [settings.fontImportUrl, settings.fontFamily]);

    // Update document title
    useEffect(() => {
        document.title = `${settings.siteName} - Admin Dashboard`;
    }, [settings.siteName]);

    async function loadSettings() {
        try {
            const stored = await db.getSetting<SiteSettings>('site_settings');
            if (stored) {
                setSettings(stored);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateSettings(partial: Partial<SiteSettings>) {
        try {
            const updated = { ...settings, ...partial };
            await db.setSetting('site_settings', updated);
            setSettings(updated);
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}
