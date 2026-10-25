import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/public-layout";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Salto Pro" },
      { name: "description", content: "Receba um link para redefinir sua senha." },
      { property: "og:title", content: "Recuperar senha — Salto Pro" },
      { property: "og:description", content: "Receba um link para redefinir sua senha." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const p = z.string().trim().email().safeParse(email);
    if (!p.success) return setErr("E-mail inválido");
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(p.data, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) return toast.error("Não foi possível enviar o e-mail. Tente novamente.");
    setSent(true);
  }

  return (
    <AuthCard title="Recuperar senha" subtitle="Enviaremos um link para você criar uma nova senha.">
      {sent ? (
        <p className="text-sm text-muted-foreground">Se houver uma conta com esse e-mail, você receberá o link em instantes. Verifique também a caixa de spam.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Enviar link"}</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/entrar" className="text-primary hover:underline">Voltar ao login</Link></p>
    </AuthCard>
  );
}
