"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, apiPost, setToken, getToken } from "@/lib/api";
import type { User, LoginResponse } from "@/types/portfolio";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await apiFetch<User>("/auth/me");
      setUser(u);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiPost<LoginResponse>("/auth/login", { email, password }, { skipAuth: true });
      setToken(res.token);
      setUser(res.user);
      if (res.user.hasPortfolio) router.push("/dashboard");
      else router.push("/onboarding");
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      await apiPost<User>("/auth/register", { name, email, password, password_confirmation: passwordConfirmation }, { skipAuth: true });
      const res = await apiPost<LoginResponse>("/auth/login", { email, password }, { skipAuth: true });
      setToken(res.token);
      setUser(res.user);
      if (res.user.hasPortfolio) router.push("/dashboard");
      else router.push("/onboarding");
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
