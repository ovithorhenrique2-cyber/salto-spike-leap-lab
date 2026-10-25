import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/public-layout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de uso — Salto Pro" },
      { name: "description", content: "Termos de uso da plataforma Salto Pro." },
      { property: "og:title", content: "Termos de uso — Salto Pro" },
      { property: "og:description", content: "Termos de uso da plataforma Salto Pro." },
    ],
  }),
  component: () => (
    <PublicPage>
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-muted-foreground">
        <h1 className="text-4xl font-bold uppercase text-foreground">Termos de uso</h1>
        <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">Documento provisório. Deve ser revisado por um profissional jurídico antes da publicação oficial do serviço.</p>
        <h2 className="text-xl font-semibold text-foreground">1. O serviço</h2>
        <p>O Salto Pro oferece programas de treino, conteúdos educativos e ferramentas de registro para atletas de vôlei. O conteúdo tem caráter educativo e não substitui avaliação ou acompanhamento de profissional de educação física ou de saúde.</p>
        <h2 className="text-xl font-semibold text-foreground">2. Responsabilidade do usuário</h2>
        <p>Antes de realizar os exercícios, informe restrições relevantes ao profissional responsável. Interrompa qualquer exercício em caso de dor ou desconforto.</p>
        <h2 className="text-xl font-semibold text-foreground">3. Conta</h2>
        <p>Você é responsável por manter a confidencialidade da sua senha e pelas informações fornecidas.</p>
        <h2 className="text-xl font-semibold text-foreground">4. Planos e pagamentos</h2>
        <p>Os valores e condições dos planos são definidos pela administração. No momento, não há cobrança online pela plataforma.</p>
        <h2 className="text-xl font-semibold text-foreground">5. Idade</h2>
        <p>O uso por menores de 18 anos depende de regras de consentimento dos responsáveis, a serem definidas antes da abertura a esse público.</p>
      </article>
    </PublicPage>
  ),
});
