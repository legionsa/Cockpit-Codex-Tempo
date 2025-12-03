import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, LogOut, Settings, ArrowLeft, Image } from 'lucide-react';
import { IconLibraryManager } from '@/components/icon-explorer/IconLibraryManager';

export function IconLibraryPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/admindash/login');
    };

    const handlePreview = () => {
        window.open('/', '_blank');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navbar */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Icon Library</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePreview}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admindash/icons')}>
                            <Image className="w-4 h-4 mr-2" />
                            Icons
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/admindash/settings')}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-3">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start mb-4 text-muted-foreground hover:text-foreground"
                                onClick={() => navigate('/admindash')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>

                            <div className="space-y-1">
                                <div className="text-sm font-semibold mb-2 px-2">Library</div>
                                <Button variant="secondary" className="w-full justify-start">
                                    <Image className="w-4 h-4 mr-2" />
                                    All Icons
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9">
                        <div className="flex-1 border border-border rounded-lg bg-card overflow-hidden h-[calc(100vh-140px)]">
                            <IconLibraryManager mode="page" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
