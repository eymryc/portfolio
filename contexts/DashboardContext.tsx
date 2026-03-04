"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, apiPut, apiPost, apiPatch, apiDelete, apiUpload, apiExtractFromCv } from "@/lib/api";
import type { PortfolioData, PortfolioContent } from "@/types/portfolio";

type Schema = Record<string, unknown>;

interface DashboardContextValue {
  portfolio: PortfolioData | null;
  schema: Schema | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  replaceSection: (section: string, data: unknown) => Promise<void>;
  addItem: (section: string, item: Record<string, unknown>) => Promise<{ id: string } & Record<string, unknown>>;
  updateItem: (section: string, itemId: string, data: Record<string, unknown>) => Promise<unknown>;
  destroyItem: (section: string, itemId: string) => Promise<void>;
  uploadFile: (file: File) => Promise<{ url: string }>;
  /** Upload CV (PDF), retourne l'URL à stocker dans profile.cv ou profile.links.cv */
  uploadCv: (file: File) => Promise<{ url: string }>;
  /** Envoie un PDF de CV, extrait les sections et optionnellement les applique au portfolio */
  extractFromCv: (file: File, apply?: boolean) => Promise<{ success: boolean; extracted?: unknown; applied?: boolean }>;
  updateTemplate: (templateId: string, templateVersion: string | null) => Promise<void>;
  updateVisibility: (isPublic: boolean) => Promise<{ isPublic: boolean; slug: string; publicUrl: string | null }>;
  getPreviewUrl: () => Promise<string>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const SECTIONS = ["profile", "skills", "experiences", "projects", "education", "testimonials", "services", "contact"] as const;

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, refreshMe } = useAuth();
  const router = useRouter();
  const triedRefreshForPortfolio = useRef(false);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [schema, setSchema] = useState<Schema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user?.hasPortfolio) return;
    setLoading(true);
    setError(null);
    try {
      const p = await apiFetch<PortfolioData>("/me/portfolio");
      setPortfolio(p);
      const s = await apiFetch<Schema>(`/templates/${p.templateId}/schema`).catch(() => null);
      setSchema(s);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user?.hasPortfolio]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!user.hasPortfolio) {
      if (!triedRefreshForPortfolio.current) {
        triedRefreshForPortfolio.current = true;
        refreshMe();
        return;
      }
      router.push("/onboarding");
      return;
    }
    triedRefreshForPortfolio.current = false;
    refresh();
  }, [user, authLoading, router, refresh, refreshMe]);

  const replaceSection = useCallback(
    async (section: string, data: unknown) => {
      await apiPut(`/me/portfolio/sections/${section}`, { data });
      await refresh();
    },
    [refresh]
  );

  const addItem = useCallback(
    async (section: string, item: Record<string, unknown>) => {
      const result = await apiPost<{ id: string } & Record<string, unknown>>(
        `/me/portfolio/sections/${section}/items`,
        item
      );
      await refresh();
      return result;
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (section: string, itemId: string, data: Record<string, unknown>) => {
      const result = await apiPut(`/me/portfolio/sections/${section}/items/${itemId}`, data);
      await refresh();
      return result;
    },
    [refresh]
  );

  const destroyItem = useCallback(
    async (section: string, itemId: string) => {
      await apiDelete(`/me/portfolio/sections/${section}/items/${itemId}`);
      await refresh();
    },
    [refresh]
  );

  const uploadFile = useCallback(async (file: File) => {
    const res = await apiUpload<{ url: string }>("/me/portfolio/upload", file);
    return res;
  }, []);

  const uploadCv = useCallback(async (file: File) => {
    const res = await apiUpload<{ url: string }>("/me/portfolio/upload-cv", file);
    return res;
  }, []);

  const extractFromCv = useCallback(async (file: File, apply = false) => {
    const data = await apiExtractFromCv(file, apply);
    if (apply && data.success) await refresh();
    return data;
  }, [refresh]);

  const updateTemplate = useCallback(
    async (templateId: string, templateVersion: string | null) => {
      await apiPatch("/me/portfolio/template", { template_id: templateId, template_version: templateVersion });
      await refresh();
    },
    [refresh]
  );

  const updateVisibility = useCallback(
    async (isPublic: boolean) => {
      const res = await apiPatch<{ isPublic: boolean; slug: string; publicUrl: string | null }>(
        "/me/portfolio/visibility",
        { is_public: isPublic }
      );
      await refresh();
      return res;
    },
    [refresh]
  );

  const getPreviewUrl = useCallback(async () => {
    const res = await apiPost<{ previewUrl: string }>("/me/portfolio/preview", {});
    return res.previewUrl;
  }, []);

  const value: DashboardContextValue = {
    portfolio,
    schema,
    loading,
    error,
    refresh,
    replaceSection,
    addItem,
    updateItem,
    destroyItem,
    uploadFile,
    uploadCv,
    extractFromCv,
    updateTemplate,
    updateVisibility,
    getPreviewUrl,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export { SECTIONS };
