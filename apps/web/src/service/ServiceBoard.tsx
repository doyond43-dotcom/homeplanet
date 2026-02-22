import { useParams } from "react-router-dom";

export default function ServiceBoard() {
  const { shopSlug } = useParams();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="text-3xl font-bold mb-4">
        New Service System
      </div>

      <div className="text-lg">
        Shop: <span className="font-semibold">{shopSlug}</span>
      </div>

      <div className="mt-6 text-slate-400">
        If you see this screen, the new route namespace is working.
      </div>
    </div>
  );
}