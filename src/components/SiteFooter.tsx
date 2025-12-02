import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/lib/settingsContext';

export function SiteFooter() {
    const { settings } = useSettings();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card py-12 mt-auto">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            {settings.brandIconSvg ? (
                                <div
                                    className="w-6 h-6 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-primary"
                                    dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
                                />
                            ) : (
                                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xs">
                                    C
                                </div>
                            )}
                            {settings.siteName || 'Cockpit'}
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            A modern documentation platform for your design system and engineering guidelines.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                            <li><Link to="/components" className="hover:text-foreground transition-colors">Components</Link></li>
                            <li><Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link></li>
                            <li><Link to="/api" className="hover:text-foreground transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} {settings.siteName || 'Cockpit'}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-muted-foreground">Built with Cockpit Codex</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
