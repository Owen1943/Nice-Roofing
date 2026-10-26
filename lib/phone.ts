export function normalizePhone(input: string) {
  const n = input.replace(/[\s().-]/g, "");
  if (/^0[1-9]\d{8}$/.test(n)) return "+94" + n.slice(1);
  if (/^94[1-9]\d{8}$/.test(n)) return "+" + n;
  if (/^0094[1-9]\d{8}$/.test(n)) return "+" + n.slice(2);
  if (/^\+94[1-9]\d{8}$/.test(n)) return n;
  return null;
}
