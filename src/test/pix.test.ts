import { describe, expect, it } from "vitest";
import { crc16, isValidCpf, pixPayload } from "@/lib/pix";

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
    const body = "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304";
    expect(crc16(body)).toBe("1D3D");
  });
});
