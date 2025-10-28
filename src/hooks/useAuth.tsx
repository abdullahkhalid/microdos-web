import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  // Query to get current user
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user state when data changes
  useEffect(() => {
    if (userData) {
      setUser(userData.user);
    } else {
      setUser(null);
    }
  }, [userData]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login({ email, password }),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['user'], { user: data.user });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      apiClient.signup({ email, password, name }),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['user'], { user: data.user });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (email: string, password: string, name: string) => {
    await signupMutation.mutateAsync({ email, password, name });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
