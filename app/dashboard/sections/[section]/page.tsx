"use client";

import { useParams } from "next/navigation";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardPageCard from "@/components/dashboard/DashboardPageCard";
import SectionProfile from "@/components/dashboard/SectionProfile";
import SectionSkills from "@/components/dashboard/SectionSkills";
import SectionContact from "@/components/dashboard/SectionContact";
import SectionItems from "@/components/dashboard/SectionItems";

const SECTION_LABELS: Record<string, string> = {
  profile: "Profil",
  skills: "Compétences",
  experiences: "Expériences",
  projects: "Projets",
  education: "Formation",
  testimonials: "Témoignages",
  services: "Services / Tarifs",
  contact: "Contact",
};

export default function SectionPage() {
  const params = useParams();
  const section = (params.section as string) ?? "";
  const { portfolio, loading } = useDashboard();

  if (loading || !portfolio) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-10 rounded bg-white/10 animate-pulse" />
          <div className="h-10 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  const label = SECTION_LABELS[section] ?? section;
  const isProfile = section === "profile";
  const isSkills = section === "skills";
  const isContact = section === "contact";
  const isItems = ["experiences", "projects", "education", "testimonials", "services"].includes(section);

  return (
    <DashboardPageCard title={label}>
      {isProfile && <SectionProfile />}
      {isSkills && <SectionSkills />}
      {isContact && <SectionContact />}
      {isItems && (
        <SectionItems
          section={section as "experiences" | "projects" | "education" | "testimonials" | "services"}
        />
      )}
      {!isProfile && !isSkills && !isContact && !isItems && (
        <p className="text-white/50">Section inconnue.</p>
      )}
    </DashboardPageCard>
  );
}
