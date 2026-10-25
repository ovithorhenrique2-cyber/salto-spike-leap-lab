import { describe, expect, it } from "vitest";
import { activityStreak, formatPrice, verticalJump } from "@/lib/format";

describe("regras do Salto Pro", () => {
  it("impulsão = alcance no salto - alcance em pé", () => {
    expect(verticalJump(240, 295)).toBe(55);
  });
  it("sem impulsão quando falta uma medida", () => {
    expect(verticalJump(240, null)).toBeNull();
  });
  it("preço do premium em reais", () => {
    expect(formatPrice(4900).replace(/\s/g, " ")).toBe("R$ 49");
  });
  it("preço nulo é sob consulta", () => {
    expect(formatPrice(null)).toBe("Sob consulta");
  });
  it("dias de descanso não zeram a sequência", () => {
    const now = new Date("2026-10-25T12:00:00Z");
    expect(activityStreak(["2026-10-25T10:00:00Z", "2026-10-23T10:00:00Z"], now)).toBe(2);
  });
});
