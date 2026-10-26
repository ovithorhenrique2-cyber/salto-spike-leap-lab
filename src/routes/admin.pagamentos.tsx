import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PublicPage } from "@/components/public-layout";
import { Loading, Pill } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatPrice } from "@/lib/format";
import { formatCpf, isValidCpf } from "@/lib/pix";
import { useAccess, useUser } from "@/lib/session";

export const Route = createFileRoute("/admin/pagamentos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Pagamentos Pix — Admin Salto Pro" },
      { name: "description", content: "Configuração da chave Pix e conferência manual de pagamentos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPayments,
});

function AdminPayments() {
  const { user, loading } = useUser();
  const { data: access, isLoading } = useAccess();
  if (loading || (user && isLoading)) return <PublicPage><Loading /></PublicPage>;
  if (!user || !access?.isAdmin)
    return (
      <PublicPage>
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-3xl font-bold uppercase">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">Esta área é exclusiva da administração.</p>
          {!user && <Button asChild className="mt-6"><Link to="/entrar">Entrar</Link></Button>}
        </section>
      </PublicPage>
    );
  return (
    <PublicPage>
      <section className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <PixSettings />
        <Requests />
      </section>
    </PublicPage>
  );
}

function PixSettings() {
  const qc = useQueryClient();
  const { data: cfg } = useQuery({
    queryKey: ["pix-admin"],
    queryFn: async () => (await supabase.from("pix_config").select("*").eq("id", 1).single()).data,
  });
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    if (cfg) { setKey(cfg.pix_key ?? ""); setName(cfg.receiver_name); setCity(cfg.receiver_city); }
  }, [cfg]);
  const digits = key.replace(/\D/g, "");
  const valid = isValidCpf(digits);

  const save = useMutation({
    mutationFn: async (verified: boolean) => {
      const { error } = await supabase.from("pix_config").update({ pix_key: digits || null, receiver_name: name, receiver_city: city, verified }).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Configuração salva"); setConfirmed(false); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold uppercase">Pix — Banco do Brasil</h1>
      <p className="text-sm text-muted-foreground">Valor: R$ 15,00 · Chave do tipo CPF. A chave só aparece para os atletas depois que você conferir e publicar.</p>
      <div className="flex items-center gap-2">Status: {cfg?.verified ? <Pill tone="lime">Publicada</Pill> : <Pill tone="warn">Oculta</Pill>}</div>
      <label className="block text-sm">CPF (chave Pix)
        <Input inputMode="numeric" value={key} onChange={(e) => { setKey(e.target.value); setConfirmed(false); }} placeholder="Digite os 11 dígitos" />
      </label>
      {digits && !valid && <p className="text-sm text-destructive">{digits.length !== 11 ? `CPF incompleto: ${digits.length} de 11 dígitos.` : "CPF inválido: os dígitos verificadores não conferem."}</p>}
      <label className="block text-sm">Nome do recebedor (para o QR Code)
        <Input value={name} maxLength={25} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">Cidade do recebedor (para o QR Code)
        <Input value={city} maxLength={15} onChange={(e) => setCity(e.target.value)} />
      </label>
      {valid && (
        <label className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
          Conferi todos os dígitos: <strong className="font-mono">{formatCpf(digits)}</strong>
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate(false)}>Salvar sem publicar</Button>
        <Button variant="hero" disabled={!valid || !confirmed || save.isPending} onClick={() => save.mutate(true)}>Salvar e publicar</Button>
      </div>
    </div>
  );
}

function Requests() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["payment-requests"],
    queryFn: async () => (await supabase.from("payment_requests").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,name,email")).data ?? [],
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "paid" | "rejected" }) => {
      const { error } = await supabase.from("payment_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Atualizado"); qc.invalidateQueries({ queryKey: ["payment-requests"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold uppercase">Avisos de pagamento</h2>
      <p className="text-sm text-muted-foreground">Só marque como pago depois de conferir o crédito no extrato do Banco do Brasil.</p>
      {isLoading ? <Loading /> : !data?.length ? <p className="text-sm text-muted-foreground">Nenhum aviso ainda.</p> : data.map((r) => {
        const p = profiles?.find((x) => x.id === r.user_id);
        return (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3 text-sm">
            <div>
              <p className="font-semibold">{p?.name || p?.email || r.user_id}</p>
              <p className="text-muted-foreground">{formatPrice(r.amount_cents)} · {formatDate(r.created_at)} · {r.status === "paid" ? "Pago" : r.status === "rejected" ? "Recusado" : "Aguardando conferência"}</p>
            </div>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: r.id, status: "rejected" })}>Não encontrado</Button>
                <Button size="sm" onClick={() => confirm("Confirmou o crédito no extrato?") && setStatus.mutate({ id: r.id, status: "paid" })}>Marcar como pago</Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
