import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/brand";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { formatCpf, isValidCpf, pixPayload } from "@/lib/pix";
import { useUser } from "@/lib/session";

export function PixCheckout({ planSlug }: { planSlug: string }) {
  const { user } = useUser();
  const qc = useQueryClient();
  const { data: cfg, isLoading } = useQuery({
    queryKey: ["pix-public"],
    queryFn: async () => {
      const { data } = await supabase.from("pix_config").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });
  const { data: mine } = useQuery({
    queryKey: ["my-payment", planSlug, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("payment_requests").select("*").eq("plan_slug", planSlug).order("created_at", { ascending: false }).limit(1);
      return data?.[0] ?? null;
    },
  });
  const notify = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payment_requests").insert({ plan_slug: planSlug });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Aviso enviado. A liberação ocorre após conferirmos o crédito no extrato.");
      qc.invalidateQueries({ queryKey: ["my-payment"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Loading />;
  const ready = cfg && cfg.verified && cfg.pix_key && isValidCpf(cfg.pix_key);
  if (!ready)
    return <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">O pagamento via Pix ainda não está disponível. Volte em breve.</p>;

  const canQr = cfg.receiver_name.trim() && cfg.receiver_city.trim();
  const code = canQr ? pixPayload({ key: cfg.pix_key!, name: cfg.receiver_name, city: cfg.receiver_city, amountCents: cfg.amount_cents }) : "";
  const copy = (t: string) => navigator.clipboard.writeText(t).then(() => toast.success("Copiado"));

  return (
    <div className="space-y-4 text-sm">
      <p className="font-display text-3xl font-extrabold">{formatPrice(cfg.amount_cents).replace(/\s/g, " ")},00</p>
      <div className="rounded-lg border p-3">
        <p className="text-muted-foreground">{cfg.bank} · Chave CPF</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-mono text-base">{formatCpf(cfg.pix_key!)}</span>
          <Button size="sm" variant="outline" onClick={() => copy(cfg.pix_key!)}><Copy className="mr-1 h-4 w-4" />Copiar chave</Button>
        </div>
      </div>
      {canQr && (
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg bg-foreground p-3"><QRCodeSVG value={code} size={180} /></div>
          <Button size="sm" variant="outline" onClick={() => copy(code)}><Copy className="mr-1 h-4 w-4" />Copiar Pix copia e cola</Button>
        </div>
      )}
      <p className="text-muted-foreground">A confirmação é manual: o acesso é liberado somente depois que conferirmos o crédito no extrato bancário.</p>
      {!user ? (
        <Button asChild variant="hero" className="w-full"><Link to="/entrar">Entre para avisar o pagamento</Link></Button>
      ) : mine?.status === "pending" ? (
        <p className="rounded-lg bg-secondary p-3">Pagamento aguardando conferência.</p>
      ) : mine?.status === "paid" ? (
        <p className="rounded-lg bg-secondary p-3">Pagamento confirmado. Acesso liberado.</p>
      ) : (
        <Button variant="hero" className="w-full" disabled={notify.isPending} onClick={() => notify.mutate()}>Já fiz o Pix</Button>
      )}
    </div>
  );
}
