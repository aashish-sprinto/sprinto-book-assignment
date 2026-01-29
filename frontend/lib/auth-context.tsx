'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  authorId?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = Cookies.get('user');
    const accessToken = Cookies.get('accessToken');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        
        if (!user.authorId && accessToken) {
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
            user.authorId = tokenPayload.authorId;
          } catch (tokenError) {
            console.error('Failed to decode token:', tokenError);
          }
        }
        
        setUser(user);
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const getAccessToken = () => {
    return Cookies.get('accessToken');
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken } = data;
      
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userWithAuthorId = {
        ...userData,
        authorId: tokenPayload.authorId,
      };

      // For HTTP, use secure: false and sameSite: 'lax'
      const cookieOptions = { secure: false, sameSite: 'lax' as const };

      Cookies.set('accessToken', accessToken, cookieOptions);
      Cookies.set('refreshToken', refreshToken, cookieOptions);
      Cookies.set('user', JSON.stringify(userWithAuthorId), cookieOptions);

      setUser(userWithAuthorId);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      const { user: userData, accessToken, refreshToken } = data;
      
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userWithAuthorId = {
        ...userData,
        authorId: tokenPayload.authorId,
      };

      // For HTTP, use secure: false and sameSite: 'lax'
      const cookieOptions = { secure: false, sameSite: 'lax' as const };

      Cookies.set('accessToken', accessToken, cookieOptions);
      Cookies.set('refreshToken', refreshToken, cookieOptions);
      Cookies.set('user', JSON.stringify(userWithAuthorId), cookieOptions);

      setUser(userWithAuthorId);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
