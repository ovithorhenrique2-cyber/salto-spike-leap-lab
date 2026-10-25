import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorBox, Loading } from "@/components/brand";
import { formatPrice } from "@/lib/format";
import { usePlans, useSettings, useUser } from "@/lib/session";

type Plan = NonNullable<ReturnType<typeof usePlans>["data"]>[number];

export function PlansGrid() {
  const { data: plans, isLoading, error } = usePlans();
  const { data: settings } = useSettings();
  const { user } = useUser();
  const [open, setOpen] = useState<Plan | null>(null);
  const c = (settings?.contact ?? {}) as Record<string, string>;
  const contactUrl = c.coaching_url || c.whatsapp_url || (c.email ? `mailto:${c.email}` : "");

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  if (!plans?.length) return <p className="text-sm text-muted-foreground">Nenhum plano disponível no momento.</p>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => {
          const featured = p.slug === "premium";
          return (
            <div key={p.id} className={`flex flex-col rounded-2xl border p-6 ${featured ? "border-primary/60 bg-accent/30 shadow-glow" : "bg-card"}`}>
              <h3 className="text-2xl font-bold uppercase">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-4 font-display text-4xl font-extrabold">
                {formatPrice(p.price_cents, p.price_label)}
                {p.price_cents ? <span className="ml-1 text-sm font-medium text-muted-foreground">/ {p.billing_period}</span> : null}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
                ))}
              </ul>
              {p.slug === "free" ? (
                <Button asChild className="mt-6" variant="outline"><Link to={user ? "/painel" : "/cadastro"}>{user ? "Ir para o painel" : p.cta_label}</Link></Button>
              ) : (
                <Button className="mt-6" variant={featured ? "hero" : "default"} onClick={() => setOpen(p)}>{p.cta_label}</Button>
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.name}</DialogTitle>
            <DialogDescription>
              {open?.slug === "coaching"
                ? "Fale diretamente com o treinador para combinar o acompanhamento."
                : "O pagamento online ainda não está disponível. Nenhuma cobrança é feita por aqui. Fale com a equipe para contratar — o acesso é liberado manualmente após a confirmação."}
            </DialogDescription>
          </DialogHeader>
          {contactUrl ? (
            <Button asChild variant="hero"><a href={contactUrl} target="_blank" rel="noreferrer">Solicitar contato</a></Button>
          ) : (
            <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">O link de contato ainda não foi configurado pelo administrador.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
