/**
 * Layout minimal pour les pages de prévisualisation de template (/templates/[id]).
 * Pas de header ni footer du site principal — uniquement le rendu du template.
 */
export default function TemplatePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
