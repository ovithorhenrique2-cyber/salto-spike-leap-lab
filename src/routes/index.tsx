import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, CheckCircle2, ClipboardList, ListChecks, UserRound } from "lucide-react";
import heroImg from "@/assets/hero-salto.jpg";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicPage } from "@/components/public-layout";
import { PlansGrid } from "@/components/plans-grid";
import { useSettings } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salto Pro — Treine com propósito. Evolua a cada salto." },
      { name: "description", content: "Treinos de impulsão, técnica de ataque e acompanhamento da evolução para atletas de vôlei." },
      { property: "og:title", content: "Salto Pro — Treine com propósito" },
      { property: "og:description", content: "Treine impulsão, desenvolva sua técnica e acompanhe sua evolução no vôlei." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const benefits = [
  { icon: ClipboardList, t: "Treinos organizados por objetivo", d: "Programas separados por salto, ataque, coordenação e preparação." },
  { icon: ListChecks, t: "Exercícios passo a passo", d: "Instruções, séries, repetições, descanso e pontos técnicos." },
  { icon: CheckCircle2, t: "Registro de treinos", d: "Marque séries e salve cada sessão concluída." },
  { icon: BarChart3, t: "Acompanhamento da evolução", d: "Registre suas medições de salto e veja o histórico." },
  { icon: BookOpen, t: "Conteúdo técnico de vôlei", d: "Aproximação, tempo de salto, aterrissagem e mais." },
];

const steps = ["Crie seu perfil.", "Escolha ou receba um programa adequado ao seu nível.", "Execute e registre seus treinos.", "Acompanhe seus resultados."];

const faq: [string, string][] = [
  ["Para quem é o Salto Pro?", "Para jogadores iniciantes e intermediários e atletas recreativos de quadra ou praia que querem melhorar o salto e a técnica."],
  ["Preciso ter experiência no vôlei?", "Não. No cadastro você informa seu nível e encontra programas indicados para iniciantes."],
  ["Como acompanho minha evolução?", "Você registra os treinos concluídos e suas medições de alcance. O painel mostra seu histórico e gráficos com os dados que você registrou."],
  ["Posso treinar em casa ou na academia?", "Sim. Cada programa informa o local de execução e os equipamentos necessários, e você pode filtrar por isso."],
  ["Como funciona o acompanhamento individual?", "É um serviço à parte, oferecido pelo criador da plataforma. Na página de planos você encontra o que está incluído e o botão para solicitar contato."],
];

function Landing() {
  const { data: settings } = useSettings();
  const landing = (settings?.landing ?? {}) as Record<string, string>;
  const coach = (settings?.coach ?? {}) as Record<string, string>;

  return (
    <PublicPage>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 md:grid-cols-2 md:py-20">
          <div className="order-2 md:order-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Treine com propósito. Evolua a cada salto.</p>
            <h1 className="text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
              {landing.hero_title || "Seu próximo salto começa com o treino certo."}
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              {landing.hero_subtitle || "Treine impulsão, desenvolva sua técnica e acompanhe sua evolução no vôlei com um plano organizado."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg"><Link to="/cadastro">Começar minha evolução</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/treinos">Conhecer os treinos</Link></Button>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <img src={heroImg} alt="Atleta de vôlei saltando para atacar" width={1280} height={1600} className="aspect-[4/5] max-h-[560px] w-full rounded-3xl object-cover" />
            <div className="absolute inset-0 rounded-3xl bg-hero-fade md:hidden" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold uppercase md:text-4xl">O que você encontra</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b) => (
            <div key={b.t} className="rounded-2xl border bg-card p-5">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold leading-tight">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold uppercase md:text-4xl">Como funciona</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="rounded-2xl border bg-card p-5">
                <span className="font-display text-5xl font-extrabold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-medium">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 rounded-3xl border bg-card p-6 md:grid-cols-[200px_1fr] md:p-10">
          <div className="grid aspect-square w-32 place-items-center overflow-hidden rounded-2xl bg-secondary md:w-full">
            {coach.photo_url ? <img src={coach.photo_url} alt={coach.name} className="h-full w-full object-cover" loading="lazy" /> : <UserRound className="h-12 w-12 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">O treinador</p>
            <h2 className="mt-2 text-3xl font-bold uppercase">{coach.name}</h2>
            <p className="mt-1 font-medium">{coach.headline}</p>
            <p className="mt-4 whitespace-pre-line text-muted-foreground">{coach.bio}</p>
            {coach.methodology && <p className="mt-4 whitespace-pre-line text-muted-foreground">{coach.methodology}</p>}
          </div>
        </div>
      </section>

      <section className="border-y bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold uppercase md:text-4xl">Planos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ofertas configuradas pelo administrador da plataforma.</p>
          <div className="mt-8"><PlansGrid /></div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-3xl font-bold uppercase md:text-4xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faq.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PublicPage>
  );
}
