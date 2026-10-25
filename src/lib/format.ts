export const LEVELS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
] as const;

export const levelLabel = (v?: string | null) => LEVELS.find((l) => l.value === v)?.label ?? "—";

export const GOALS = [
  { value: "salto", label: "Salto" },
  { value: "ataque", label: "Ataque" },
  { value: "fundamentos", label: "Fundamentos" },
  { value: "desempenho", label: "Desempenho geral" },
];
export const goalLabel = (v?: string | null) => GOALS.find((g) => g.value === v)?.label ?? v ?? "—";

export const LOCATIONS = [
  { value: "casa", label: "Casa" },
  { value: "academia", label: "Academia" },
  { value: "quadra", label: "Quadra" },
  { value: "qualquer", label: "Qualquer local" },
];
export const locationLabel = (v?: string | null) => LOCATIONS.find((l) => l.value === v)?.label ?? v ?? "—";

export const PROGRAM_CATEGORIES = [
  "Fundamentos de salto",
  "Força e potência",
  "Coordenação e aproximação",
  "Técnica de ataque",
  "Mobilidade e preparação",
  "Vôlei de praia",
];

export const CONTENT_CATEGORIES = [
  "Aproximação para o ataque",
  "Coordenação dos braços",
  "Tempo de salto",
  "Mecânica de aterrissagem",
  "Posicionamento e deslocamento",
  "Fundamentos de vôlei de praia",
  "Erros técnicos comuns",
  "Preparação para os treinos",
];

export const EQUIPMENT = ["Nenhum", "Halteres", "Barra e anilhas", "Elásticos", "Caixa/step", "Corda", "Bola", "Cones"];

export const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function formatPrice(cents: number | null, label?: string | null) {
  if (label) return label;
  if (cents == null) return "Sob consulta";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDuration(sec?: number | null) {
  if (!sec) return "—";
  const m = Math.round(sec / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
}

/** Vertical jump estimate = jump reach - standing reach (both cm). Null when not computable. */
export function verticalJump(standing?: number | null, jump?: number | null) {
  if (standing == null || jump == null) return null;
  const v = jump - standing;
  return v > 0 ? Math.round(v * 10) / 10 : null;
}

/** Days with activity in a row ending today or yesterday (rest days don't break if within 2 days gap). */
export function activityStreak(dates: string[], now = new Date()) {
  const days = new Set(dates.map((d) => new Date(d).toISOString().slice(0, 10)));
  if (!days.size) return 0;
  let count = 0;
  let gap = 0;
  const cur = new Date(now);
  for (let i = 0; i < 365; i++) {
    const k = cur.toISOString().slice(0, 10);
    if (days.has(k)) {
      count++;
      gap = 0;
    } else {
      gap++;
      if (gap > 2) break;
    }
    cur.setDate(cur.getDate() - 1);
  }
  return count;
}

export function startOfWeek(now = new Date()) {
  const d = new Date(now);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}
