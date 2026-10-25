import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public-layout";
import { PlansGrid } from "@/components/plans-grid";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e acompanhamento — Salto Pro" },
      { name: "description", content: "Planos gratuito, premium e acompanhamento individual." },
      { property: "og:title", content: "Planos — Salto Pro" },
      { property: "og:description", content: "Planos gratuito, premium e acompanhamento individual." },
    ],
  }),
  component: () => (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl font-bold uppercase">Planos e acompanhamento</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">Nenhuma cobrança é feita online por enquanto.</p>
        <PlansGrid />
      </section>
    </PublicPage>
  ),
});
