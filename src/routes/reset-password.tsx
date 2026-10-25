import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/public-layout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Salto Pro" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { property: "og:title", content: "Nova senha — Salto Pro" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password") ?? "");
    if (pw.length < 8) return setErr("Mínimo de 8 caracteres");
    if (pw !== fd.get("confirm")) return setErr("As senhas não coincidem");
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error("Link inválido ou expirado. Solicite um novo.");
    toast.success("Senha atualizada.");
    navigate({ to: "/painel" });
  }

  return (
    <AuthCard title="Nova senha">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5"><Label htmlFor="password">Nova senha</Label><Input id="password" name="password" type="password" autoComplete="new-password" /></div>
        <div className="space-y-1.5"><Label htmlFor="confirm">Confirmar senha</Label><Input id="confirm" name="confirm" type="password" autoComplete="new-password" /></div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</Button>
      </form>
    </AuthCard>
  );
}
