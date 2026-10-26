import { describe, expect, it } from "vitest";
import { isValidCpf, pixPayload } from "@/lib/pix";

describe("pagamento Pix manual", () => {
  it("CPF incompleto é recusado", () => {
    expect(isValidCpf("123.456.789")).toBe(false);
  });
  it("CPF com dígito verificador errado é recusado", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
  });
  it("CPF válido é aceito", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });
  it("Pix cobra R$ 15,00", () => {
    const p = pixPayload({ key: "52998224725", name: "Fulano", city: "Sao Paulo", amountCents: 1500 });
    expect(p).toContain("540515.00");
  });
  it("CRC do código Pix bate com o exemplo oficial do BCB", () => {
    const p = pixPayload({ key: "123e4567-e12b-12d1-a456-426655440000", name: "Fulano de Tal", city: "BRASILIA", amountCents: 100 });
    expect(p).toBe(
      "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-42665544000052040000530398654041.005802BR5913FULANO DE TAL5908BRASILIA62070503***63048B4F",
    );
  });
});
