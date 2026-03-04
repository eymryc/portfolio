"use client";

import { useEffect, useRef, useState } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Si true, les enfants directs ont un délai progressif (stagger) */
  stagger?: boolean;
  /** Root margin pour déclencher l’animation (ex: "-80px" pour plus tôt) */
  rootMargin?: string;
}

export default function RevealSection({
  children,
  className = "",
  stagger = false,
  rootMargin = "-40px 0px -40px 0px",
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`${stagger ? "reveal-stagger" : "reveal-on-scroll"} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
