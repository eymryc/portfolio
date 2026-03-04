import SectionOutils from "@/components/dashboard/SectionOutils";

export default function OutilsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Outils & visibilité</h1>
      <p className="text-white/60 mb-8 text-sm">
        Statistiques, avis, QR code, signature email et plus.
      </p>
      <SectionOutils />
    </div>
  );
}
