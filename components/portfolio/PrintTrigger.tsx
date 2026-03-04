"use client";

import { useEffect } from "react";

/** Si l’URL contient ?print=1, ouvre la boîte de dialogue d’impression (PDF). */
export default function PrintTrigger() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "1") {
      window.print();
    }
  }, []);
  return null;
}
