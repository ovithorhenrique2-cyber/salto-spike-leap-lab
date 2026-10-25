import { Link } from "@tanstack/react-router";
import { Loader2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Logo({ to = "/" }: { to?: "/" | "/painel" }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-gradient text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M4 18 L12 6 L20 18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        Salto <span className="text-primary">Pro</span>
      </span>
    </Link>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold uppercase md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground" role="status">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

export function ErrorBox({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : "Não foi possível carregar os dados.";
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
      Algo deu errado: {msg}. Tente recarregar a página.
    </div>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "lime" | "warn" }) {
  const cls =
    tone === "lime"
      ? "bg-accent text-accent-foreground"
      : tone === "warn"
        ? "bg-warning/15 text-warning"
        : "bg-secondary text-secondary-foreground";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

export function SafetyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
      <p className="font-semibold text-warning">Segurança</p>
      <div className="mt-1 whitespace-pre-line text-muted-foreground">{children}</div>
    </div>
  );
}
