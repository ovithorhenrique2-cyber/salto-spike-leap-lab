import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicPage } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/session";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Meu painel — Salto Pro" }, { name: "description", content: "Painel do atleta." }] }),
  component: Painel,
});

function Painel() {
  const { user, loading } = useUser();
  return (
    <PublicPage>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold uppercase">Meu painel</h1>
        {loading ? null : user ? (
          <p className="mt-3 text-muted-foreground">Você está conectado. O painel completo está em construção.</p>
        ) : (
          <Button asChild className="mt-6"><Link to="/entrar">Entrar</Link></Button>
        )}
      </section>
    </PublicPage>
  );
}
