import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/lib/settingsContext';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const DocPage = React.lazy(() => import('@/pages/DocPage').then(module => ({ default: module.DocPage })));
const LoginPage = React.lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const Settings = React.lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Admin routes */}
                <Route path="/admindash/login" element={<LoginPage />} />
                <Route path="/admindash" element={<AdminDashboard />} />
                <Route path="/admindash/settings" element={<Settings />} />

                {/* Public documentation routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                  path="/*"
                  element={<DocPage />}
                />
              </Routes>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;