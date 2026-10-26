import { describe, it, expect } from "vitest";
import { normalizePhone, enquirySchema, escapeHtml } from "../lib/validation";
import { categories, gallery, site } from "../lib/content/site";
describe("Sri Lankan phone normalization", () => {
  it.each([
    "077 717 3041",
    "0777173041",
    "+94 77 717 3041",
    "94777173041",
    "0094777173041",
  ])("normalizes %s", (n) => expect(normalizePhone(n)).toBe("+94777173041"));
  it.each([
    "123",
    "0777<script>",
    "+15551234567",
    "077717304111",
    "0000000000",
  ])("rejects %s", (n) => expect(normalizePhone(n)).toBeNull());
});
it("requires only a name and phone as customer details", () => {
  expect(
    enquirySchema.safeParse({
      name: "Owen",
      phone: "0777173041",
      requestId: crypto.randomUUID(),
      startedAt: Date.now(),
    }).success,
  ).toBe(true);
});
it("rejects unexpected fields and script names", () => {
  const valid = {
    name: "Owen",
    phone: "0777173041",
    requestId: crypto.randomUUID(),
    startedAt: Date.now(),
  };
  expect(enquirySchema.safeParse({ ...valid, admin: true }).success).toBe(
    false,
  );
  expect(enquirySchema.safeParse({ ...valid, name: "<script>" }).success).toBe(
    false,
  );
});
it("encodes special HTML characters defensively", () =>
  expect(escapeHtml('<script>"x"&')).toBe("&lt;script&gt;&quot;x&quot;&amp;"));
it("content identifiers are unique and illustrations are never project claims", () => {
  expect(new Set(categories.map((c) => c.slug)).size).toBe(categories.length);
  expect(
    gallery.every(
      (g) =>
        (g.illustrative && g.caption.toLowerCase().includes("illustrat")) ||
        g.caption.includes("AI-enhanced"),
    ),
  ).toBe(true);
  expect(site.tel).toBe("+94777173041");
});
