import OnlyTheEssentialsBoard from "./OnlyTheEssentialsBoard";

type Template = {
  businessName: string;
  type?: string;
};

type Props = {
  template: Template;
};

export default function TemplateLiveBoard({ template }: Props) {
  // 🔥 Route template types to real systems
  if (template.type === "cleaning") {
    return <OnlyTheEssentialsBoard />;
  }

  // fallback
  return (
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black">{template.businessName}</h1>
        <p className="mt-3 text-white/60">
          Template connected, but no system mapped yet.
        </p>
      </div>
    </main>
  );
}