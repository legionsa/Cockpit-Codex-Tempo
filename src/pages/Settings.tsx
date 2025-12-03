import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, LogOut, Settings as SettingsIcon, ArrowLeft, Paintbrush, Type, User, Database } from 'lucide-react';
import { BrandingSettings } from '@/components/settings/BrandingSettings';
import { TypographySettings } from '@/components/settings/TypographySettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { BackupSettings } from '@/components/settings/BackupSettings';

type SettingsTab = 'branding' | 'typography' | 'account' | 'backup';

export function Settings() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('branding');

    const handleLogout = () => {
        logout();
        navigate('/admindash/login');
    };

    const handlePreview = () => {
        window.open('/', '_blank');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navbar - Same as AdminDashboard */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePreview}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admindash/icons')}>
                            <Database className="w-4 h-4 mr-2" />
                            Icons
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admindash/settings')}>
                            <SettingsIcon className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - Same structure as AdminDashboard */}
                    <div className="col-span-3">
                        <div className="bg-card border border-border rounded-lg p-4">
                            {/* Back to Dashboard */}
                            <Button
                                variant="ghost"
                                className="w-full justify-start mb-4 text-muted-foreground hover:text-foreground"
                                onClick={() => navigate('/admindash')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>

                            <div className="space-y-1">
                                <div className="text-sm font-semibold mb-2 px-2">Settings</div>

                                <Button
                                    variant={activeTab === 'branding' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('branding')}
                                >
                                    <Paintbrush className="w-4 h-4 mr-2" />
                                    Branding
                                </Button>

                                <Button
                                    variant={activeTab === 'typography' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('typography')}
                                >
                                    <Type className="w-4 h-4 mr-2" />
                                    Typography
                                </Button>

                                <Button
                                    variant={activeTab === 'account' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('account')}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Account
                                </Button>

                                <Button
                                    variant={activeTab === 'backup' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab('backup')}
                                >
                                    <Database className="w-4 h-4 mr-2" />
                                    Backup & Restore
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="col-span-9">
                        <div className="bg-card border border-border rounded-lg p-6">
                            {activeTab === 'branding' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Branding</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Configure your website name, logo, and visual identity
                                    </p>
                                    <BrandingSettings />
                                </div>
                            )}

                            {activeTab === 'typography' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Typography</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Select and customize fonts for your website
                                    </p>
                                    <TypographySettings />
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Account</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Manage your admin credentials and security
                                    </p>
                                    <AccountSettings />
                                </div>
                            )}

                            {activeTab === 'backup' && (
                                <div>
                                    <BackupSettings />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
