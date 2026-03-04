import type { Metadata } from "next";
import { Rajdhani, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Portfolio as a Service – Créez votre portfolio professionnel sans coder",
  description:
    "Créez et publiez votre portfolio web en quelques minutes. Templates modernes, profil, projets, témoignages et contact. Pour développeurs, designers, créatifs et tous les profils.",
  keywords: [
    "portfolio",
    "portfolio en ligne",
    "créer un portfolio",
    "portfolio professionnel",
    "CV en ligne",
    "développeur",
    "designer",
    "créatif",
  ],
  authors: [{ name: "Portfolio as a Service" }],
  creator: "Portfolio as a Service",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://romaric-ouangni.vercel.app"),
  openGraph: {
    title: "Portfolio as a Service – Votre portfolio web en quelques minutes",
    description: "Inscription, choix du template, personnalisation : publiez un site qui vous représente. Sans coder.",
    type: "website",
    locale: "fr_FR",
    siteName: "Portfolio as a Service",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio as a Service – Créez votre portfolio sans coder",
    description: "Templates, profil, projets, contact. Pour tous les profils.",
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
  icons: {
    icon: "/assets/logo-pas.png",
    apple: "/assets/logo-pas.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${rajdhani.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className={`${rajdhani.className} antialiased`}>
        <ToastProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
