import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicPage } from "@/components/public-layout";
import { Loading, Pill } from "@/components/brand";
import { supabase } from "@/integrations/supabase/client";
import { levelLabel } from "@/lib/format";

export const Route = createFileRoute("/treinos")({
  head: () => ({ meta: [{ title: "Biblioteca de treinos — Salto Pro" }, { name: "description", content: "Programas de treino para atletas de vôlei." }] }),
  component: Treinos,
});

function Treinos() {
  const { data, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => (await supabase.from("training_programs").select("*").eq("status", "published")).data ?? [],
  });
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold uppercase">Biblioteca de treinos</h1>
        {isLoading ? <Loading /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {data?.map((p) => (
              <div key={p.id} className="rounded-2xl border bg-card p-5">
                <div className="flex gap-2"><Pill>{levelLabel(p.level)}</Pill><Pill tone={p.access === "premium" ? "warn" : "lime"}>{p.access === "premium" ? "Premium" : "Gratuito"}</Pill></div>
                <h2 className="mt-3 text-2xl font-bold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PublicPage>
  );
}
