import React, { createContext, useEffect, type ReactNode } from "react";

import type { IAdminUser } from "@/features/admins";
import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/lib/store/authStore";

export interface AuthContextType {
  user: IAdminUser | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<IAdminUser>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setLoading, setUser]);

  const login = async (
    email: string,
    password: string,
  ): Promise<IAdminUser> => {
    setLoading(true);

    try {
      const adminUser = await authService.login({
        email,
        password,
      });

      setUser(adminUser);
      return adminUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
