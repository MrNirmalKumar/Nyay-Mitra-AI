'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  sessionToken: string | null;
  phoneNumber: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (token: string, phone: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nyay_session');
    const phone = localStorage.getItem('nyay_phone');
    if (token && phone) {
      setSessionToken(token);
      setPhoneNumber(phone);
    }
  }, []);

  const login = (token: string, phone: string) => {
    localStorage.setItem('nyay_session', token);
    localStorage.setItem('nyay_phone', phone);
    setSessionToken(token);
    setPhoneNumber(phone);
  };

  const logout = () => {
    localStorage.removeItem('nyay_session');
    localStorage.removeItem('nyay_phone');
    setSessionToken(null);
    setPhoneNumber(null);
  };

  return (
    <AuthContext.Provider value={{
      sessionToken,
      phoneNumber,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
