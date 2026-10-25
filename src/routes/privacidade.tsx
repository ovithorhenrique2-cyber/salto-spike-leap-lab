import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public-layout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Salto Pro" },
      { name: "description", content: "Como o Salto Pro trata seus dados pessoais." },
      { property: "og:title", content: "Política de privacidade — Salto Pro" },
      { property: "og:description", content: "Como o Salto Pro trata seus dados pessoais." },
    ],
  }),
  component: () => (
    <PublicPage>
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-muted-foreground">
        <h1 className="text-4xl font-bold uppercase text-foreground">Política de privacidade</h1>
        <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">Documento provisório. Deve ser revisado à luz da LGPD por um profissional jurídico antes da publicação oficial.</p>
        <h2 className="text-xl font-semibold text-foreground">Dados coletados</h2>
        <p>Nome, e-mail, perfil esportivo informado no onboarding (nível, modalidade, objetivos, rotina e equipamentos), treinos registrados e medições de salto. Não solicitamos dados médicos.</p>
        <h2 className="text-xl font-semibold text-foreground">Uso dos dados</h2>
        <p>Os dados são usados para exibir seu painel, histórico e progresso. Seus registros são visíveis apenas para você e para a administração da plataforma, que os utiliza para suporte e métricas agregadas.</p>
        <h2 className="text-xl font-semibold text-foreground">Seus direitos</h2>
        <p>Você pode editar seu perfil a qualquer momento e solicitar a exclusão da conta pelos canais de contato.</p>
      </article>
    </PublicPage>
  ),
});
