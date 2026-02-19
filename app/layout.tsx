import type { Metadata } from "next";
import { Rajdhani, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Romaric Ouangni – Ingénieur Logiciel Full Stack",
  description:
    "Portfolio de Romaric Ouangni, Ingénieur Logiciel Full Stack spécialisé Spring Boot, Laravel, React, DevOps – Abidjan, Côte d'Ivoire.",
  keywords: ["Romaric Ouangni", "Ingénieur Logiciel", "Full Stack", "Spring Boot", "Laravel", "React", "Next.js", "Abidjan", "Développeur", "DevOps"],
  authors: [{ name: "Romaric Ouangni" }],
  creator: "Romaric Ouangni",
  publisher: "Romaric Ouangni",
  metadataBase: new URL("https://romaric-ouangni.vercel.app"),
  openGraph: {
    title: "Romaric Ouangni – Ingénieur Logiciel Full Stack",
    description: "5 ans d'expérience · Spring Boot · Laravel · React · DevOps · Abidjan CI",
    type: "website",
    locale: "fr_FR",
    siteName: "Romaric Ouangni Portfolio",
    images: [
      {
        url: "/photo-profil.jpg",
        width: 1200,
        height: 630,
        alt: "Romaric Ouangni",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Romaric Ouangni – Ingénieur Logiciel Full Stack",
    description: "5 ans d'expérience · Spring Boot · Laravel · React · DevOps",
    images: ["/photo-profil.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Ajoutez vos codes de vérification ici si nécessaire
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${rajdhani.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
