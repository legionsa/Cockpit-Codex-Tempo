import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@/lib/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = storage.getAuthToken();
    const tokenExpiry = storage.getAuthTokenExpiry();
    
    if (token && tokenExpiry) {
      const now = Date.now();
      if (now < parseInt(tokenExpiry)) {
        setIsAuthenticated(true);
      } else {
        // Token expired, clear it
        storage.clearAuthToken();
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple mock authentication - in production use bcrypt
    if (username === 'admin' && password === 'admin') {
      const token = 'mock-token-' + Date.now();
      const expiry = Date.now() + SESSION_DURATION;
      storage.setAuthToken(token, expiry.toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.clearAuthToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}