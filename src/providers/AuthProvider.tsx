"use client";
import React, { createContext, useContext, useEffect } from "react";
import type { IAdminUser } from "@/features/admins";
import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "../lib/store/authStore";
export interface AuthContextType { user: IAdminUser | null; isLoading: boolean; login: (email: string, password: string) => Promise<IAdminUser>; logout: () => Promise<void>; refreshUser: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  useEffect(() => { let mounted = true; (async () => { setLoading(true); try { const current = await authService.initialize(); if (mounted) setUser(current); } catch { if (mounted) setUser(null); } finally { if (mounted) setLoading(false); } })(); return () => { mounted = false; }; }, [setLoading, setUser]);
  const login = async (email: string, password: string) => { setLoading(true); try { const admin = await authService.login({ email, password }); setUser(admin); return admin; } catch (error) { setUser(null); throw error; } finally { setLoading(false); } };
  const logout = async () => { setLoading(true); try { await authService.logout(); setUser(null); } finally { setLoading(false); } };
  const refreshUser = async () => { try { setUser(await authService.getCurrentUser()); } catch { setUser(null); } };
  return <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextType { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; }
export default AuthProvider;
