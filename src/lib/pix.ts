/** Validates a full CPF (11 digits + check digits). Never completes partial input. */
export function isValidCpf(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let s = 0;
    for (let i = 0; i < len; i++) s += Number(d[i]) * (len + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

export function formatCpf(d: string) {
  return d.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function crc16(s: string) {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const tlv = (id: string, v: string) => id + String(v.length).padStart(2, "0") + v;
const clean = (s: string, max: number) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().slice(0, max).trim();

/** Static Pix "copia e cola" (BR Code / EMV) payload. */
export function pixPayload(o: { key: string; name: string; city: string; amountCents: number; txid?: string }) {
  const body =
    tlv("00", "01") +
    tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", o.key)) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", (o.amountCents / 100).toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", clean(o.name, 25)) +
    tlv("60", clean(o.city, 15)) +
    tlv("62", tlv("05", (o.txid || "***").replace(/[^A-Za-z0-9*]/g, "").slice(0, 25) || "***")) +
    "6304";
  return body + crc16(body);
}
