"use client";

import { useEffect } from "react";
import { getApiUrl } from "@/lib/api";

/** Appel POST /portfolios/{slug}/view une fois au montage (enregistre une vue + referrer). */
export default function RecordView({ slug }: { slug: string }) {
  useEffect(() => {
    const url = `${getApiUrl()}/portfolios/${slug}/view`;
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: referrer ? JSON.stringify({ referrer }) : "{}",
    }).catch(() => {});
  }, [slug]);
  return null;
}
