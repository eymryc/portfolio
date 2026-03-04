"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollAnimation from "./ScrollAnimation";

export default function Hero() {
  const [typeText, setTypeText] = useState("");
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  const phrases = ["Ingénieur Full Stack", "Expert Spring Boot", "Architecte DevOps", "Développeur Laravel"];

  useEffect(() => {
    const tick = () => {
      const phrase = phrases[phraseRef.current];
      if (!deletingRef.current) {
        charRef.current++;
        setTypeText(phrase.slice(0, charRef.current));
        if (charRef.current === phrase.length) {
          deletingRef.current = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charRef.current--;
        setTypeText(phrase.slice(0, charRef.current));
        if (charRef.current === 0) {
          deletingRef.current = false;
          phraseRef.current = (phraseRef.current + 1) % phrases.length;
        }
      }
      setTimeout(tick, deletingRef.current ? 50 : 90);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center hero-grid overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none pulse-slow blur-3xl" style={{ background: "radial-gradient(circle, #F59E0B22, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none pulse-slow blur-3xl" style={{ background: "radial-gradient(circle, #8B5CF622, transparent 70%)", animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none pulse-slow blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #EF444422, transparent 70%)", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollAnimation delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm" style={{ background: "#F59E0B18", border: "1px solid #F59E0B44" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" style={{ boxShadow: "0 0 6px #4ADE80" }} />
                <span className="text-amber-400 text-sm font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
                  Disponible pour des projets
                </span>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              <h1 className="mb-2 text-white" style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05 }}>
                Romaric<br />
                <span className="gradient-text">Ouangni</span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation delay={200}>
              <div className="mb-6 h-12 flex items-center">
                <span className="text-2xl md:text-3xl font-light text-slate-300" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {typeText}
                  <span className="cursor text-amber-400">|</span>
                </span>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={300}>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Ingénieur logiciel Full Stack avec <strong className="text-white">5 ans d&apos;expérience</strong>, spécialisé dans la conception
                d&apos;applications web robustes, sécurisées et scalables. Passionné par les architectures
                microservices, le DevOps et l&apos;innovation technologique.
              </p>
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="px-8 py-4 rounded-full font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 8px 30px #F59E0B44" }}
                >
                  Voir mes projets →
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
                >
                  Me contacter
                </Link>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={500}>
              <div className="flex flex-wrap gap-8 mt-16 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { n: "5+", label: "Ans d'expérience" },
                  { n: "25+", label: "Projets livrés" },
                  // { n: "10+", label: "Architectures conçues" },
                  { n: "15+", label: "Intégrations API" },
                  { n: "∞", label: "Passion & amélioration continue" },
                 ].map((s) => (
                  <div key={s.label} className="group">
                    <div className="text-3xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">{s.n}</div>
                    <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={600}>
              <div className="flex items-center gap-4 mt-8">
                <span className="text-slate-500 text-sm">Suivez-moi :</span>
                <a
                  href="https://www.linkedin.com/in/romaric-ouangni-7460972a5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/eymryc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation delay={200} direction="right">
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", opacity: 0.2, filter: "blur(40px)" }} />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                  <Image
                    src="/photo-profil.jpg"
                    alt="Romaric Ouangni"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm" style={{ background: "rgba(245,158,11,0.2)", border: "2px solid rgba(245,158,11,0.4)" }}>
                  👨‍💻
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
