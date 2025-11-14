import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DocsLayout } from '@/components/DocsLayout';
import { DocPage } from '@/pages/DocPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Admin routes */}
          <Route path="/admindash/login" element={<LoginPage />} />
          <Route path="/admindash" element={<AdminDashboard />} />
          
          {/* Public documentation routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/*"
            element={
              <DocsLayout>
                <DocPage />
              </DocsLayout>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;