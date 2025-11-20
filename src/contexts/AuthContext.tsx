import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/indexedDB';
import { hashPassword, verifyPassword, createSession, isSessionValid } from '@/lib/crypto';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await db.getSetting('current_session');
      if (session && isSessionValid(session)) {
        setIsAuthenticated(true);
      } else {
        // Clear expired session
        await db.deleteSetting('current_session');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get stored credentials
      const storedUsername = await db.getSetting<string>('admin_username');
      const storedPasswordHash = await db.getSetting<string>('admin_password_hash');

      // First time setup OR migration from plain text
      if (!storedPasswordHash) {
        console.log('First time setup - creating admin account');
        const hash = await hashPassword(password);
        await db.setSetting('admin_username', username);
        await db.setSetting('admin_password_hash', hash);

        // Create session
        const session = createSession(username, 24); // 24h expiry
        await db.setSetting('current_session', session);
        setIsAuthenticated(true);
        return true;
      }

      // Verify credentials
      const usernameMatch = username === storedUsername;
      const passwordMatch = await verifyPassword(password, storedPasswordHash);

      if (usernameMatch && passwordMatch) {
        // Create new session
        const session = createSession(username, 24); // 24h expiry
        await db.setSetting('current_session', session);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await db.deleteSetting('current_session');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state briefly during initial check
  if (isLoading) {
    return null; // or a loading spinner
  }

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