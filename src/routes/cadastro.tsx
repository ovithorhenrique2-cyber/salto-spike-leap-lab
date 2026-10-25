import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/public-layout";
import { Divider, GoogleButton } from "@/components/google-button";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Salto Pro" },
      { name: "description", content: "Crie sua conta e comece a treinar seu salto no vôlei." },
      { property: "og:title", content: "Criar conta — Salto Pro" },
      { property: "og:description", content: "Crie sua conta e comece a treinar seu salto no vôlei." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(8, "Mínimo de 8 caracteres").max(72),
  terms: z.literal(true, { message: "É preciso aceitar os termos e a política" }),
});

function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password"), terms });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: window.location.origin + "/onboarding", data: { name: parsed.data.name, terms_accepted_at: new Date().toISOString() } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Este e-mail já está cadastrado." : "Não foi possível criar a conta. Tente novamente.");
      return;
    }
    if (data.session) window.location.assign("/onboarding");
    else setSent(parsed.data.email);
  }

  if (sent)
    return (
      <AuthCard title="Confirme seu e-mail">
        <div className="flex flex-col items-center text-center">
          <MailCheck className="h-10 w-10 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Enviamos um link de confirmação para <strong className="text-foreground">{sent}</strong>. Abra o e-mail para ativar sua conta e iniciar o onboarding.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/entrar">Ir para o login</Link></Button>
        </div>
      </AuthCard>
    );

  return (
    <AuthCard title="Criar conta" subtitle="Comece sua evolução no Salto Pro.">
      <GoogleButton />
      <p className="mt-2 text-center text-xs text-muted-foreground">Ao continuar com Google você concorda com os termos de uso e a política de privacidade.</p>
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" autoComplete="name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={terms} onCheckedChange={(v) => setTerms(v === true)} className="mt-0.5" />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
            Li e aceito os <Link to="/termos" className="text-primary hover:underline">termos de uso</Link> e a <Link to="/privacidade" className="text-primary hover:underline">política de privacidade</Link>.
          </Label>
        </div>
        {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Criando..." : "Criar conta"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta? <Link to="/entrar" className="text-primary hover:underline">Entrar</Link>
      </p>
    </AuthCard>
  );
}
