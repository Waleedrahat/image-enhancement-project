import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  setDevRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'image_ai_auth';

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'admin@demo.com': {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date('2024-01-01'),
    status: 'active',
  },
  'user@demo.com': {
    id: 'user-1',
    email: 'user@demo.com',
    name: 'Demo User',
    role: 'user',
    password: 'user123',
    createdAt: new Date('2024-06-01'),
    status: 'active',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
          user: { ...parsed, createdAt: new Date(parsed.createdAt) },
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const saveUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = mockUsers[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...user } = mockUser;
      saveUser(user);
      return true;
    }
    return false;
  }, [saveUser]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    if (mockUsers[email.toLowerCase()]) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      createdAt: new Date(),
      status: 'active',
    };

    mockUsers[email.toLowerCase()] = { ...newUser, password };
    saveUser(newUser);
    return true;
  }, [saveUser]);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    // Simulate OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock Google login creates a user account
    const googleUser: User = {
      id: `google-${Date.now()}`,
      email: 'google.user@gmail.com',
      name: 'Google User',
      role: 'user',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      createdAt: new Date(),
      status: 'active',
    };

    saveUser(googleUser);
    return true;
  }, [saveUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  // Dev helper to switch roles
  const setDevRole = useCallback((role: UserRole) => {
    if (state.user) {
      const updatedUser = { ...state.user, role };
      saveUser(updatedUser);
    } else {
      // Create a guest with the specified role for demo purposes
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email: `${role}@demo.local`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        role,
        createdAt: new Date(),
        status: 'active',
      };
      saveUser(demoUser);
    }
  }, [state.user, saveUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        loginWithGoogle,
        logout,
        setDevRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
