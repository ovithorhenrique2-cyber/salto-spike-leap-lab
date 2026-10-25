import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { useUser, useSettings } from "@/lib/session";

export function PublicHeader() {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link to="/planos" className="hidden px-3 text-sm text-muted-foreground hover:text-foreground sm:inline">
            Planos
          </Link>
          {user ? (
            <Button asChild size="sm">
              <Link to="/painel">Meu painel</Link>
            </Button>
          ) : (
            <>
              <Link to="/entrar" className="px-3 text-sm text-muted-foreground hover:text-foreground">
                Entrar
              </Link>
              <Button asChild size="sm">
                <Link to="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  const { data } = useSettings();
  const c = (data?.contact ?? {}) as Record<string, string>;
  return (
    <footer className="border-t bg-sidebar">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">Treine com propósito. Evolua a cada salto.</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Contato</p>
          <ul className="space-y-1 text-muted-foreground">
            {c.email && <li><a className="hover:text-foreground" href={`mailto:${c.email}`}>{c.email}</a></li>}
            {c.whatsapp_url && <li><a className="hover:text-foreground" href={c.whatsapp_url} target="_blank" rel="noreferrer">WhatsApp</a></li>}
            {c.instagram_url && <li><a className="hover:text-foreground" href={c.instagram_url} target="_blank" rel="noreferrer">Instagram</a></li>}
            {!c.email && !c.whatsapp_url && !c.instagram_url && <li>Canais de contato em configuração.</li>}
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Informações</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/termos" className="hover:text-foreground">Termos de uso</Link></li>
            <li><Link to="/privacidade" className="hover:text-foreground">Política de privacidade</Link></li>
            <li><Link to="/planos" className="hover:text-foreground">Planos</Link></li>
            <li>{c.company_info || "Informações da empresa em configuração."}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold uppercase">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
