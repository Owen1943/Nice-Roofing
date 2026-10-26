import { describe, it, expect, vi } from "vitest";
import { createEnquiryHandler } from "../lib/enquiry-handler";
import type { AbuseStore } from "../lib/abuse-store";
function setup(overrides: Record<string, unknown> = {}) {
  const records = new Map<string, string>();
  const counts = new Map<string, number>();
  const store: AbuseStore = {
    count: async (k) => {
      const n = (counts.get(k) || 0) + 1;
      counts.set(k, n);
      return n;
    },
    claim: async (k) => {
      if (records.has(k)) return false;
      records.set(k, "locked");
      return true;
    },
    get: async (k) => records.get(k) || null,
    set: async (k, v) => {
      records.set(k, v);
    },
    remove: async (k) => {
      records.delete(k);
    },
  };
  const fetcher = vi.fn(async () => Response.json({ id: "email_test_id" }));
  const log = vi.fn();
  const config = {
    origin: "https://nice.example",
    secret: "test-secret-not-production",
    recipient: "owner@example.com",
    sender: "NICE <web@example.com>",
    emailKey: "test-only",
    trustedProxy: "nginx" as const,
    ...overrides,
  };
  return {
    handler: createEnquiryHandler(config, {
      store: async () => store,
      fetcher: fetcher as typeof fetch,
      now: () => 200000,
      log,
    }),
    fetcher,
    log,
    records,
    counts,
  };
}
const body = () => ({
  name: "Test Person",
  phone: "0777173041",
  category: "Roofing tiles",
  message: "Please call about clay tiles.",
  website: "",
  requestId: crypto.randomUUID(),
  startedAt: 195000,
});
function request(data: unknown = body(), headers: Record<string, string> = {}) {
  return new Request("https://nice.example/api/enquiries", {
    method: "POST",
    headers: {
      origin: "https://nice.example",
      "content-type": "application/json",
      "x-real-ip": "192.0.2.10",
      ...headers,
    },
    body: JSON.stringify(data),
  });
}
describe("enquiry delivery and abuse handling", () => {
  it("sends normalized phone with provider idempotency, and no PII in logs", async () => {
    const s = setup();
    const res = await s.handler(request());
    expect(res.status).toBe(200);
    expect(s.fetcher).toHaveBeenCalledOnce();
    const call = s.fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(call[1].body as string).text).toContain("+94777173041");
    expect(JSON.stringify(s.log.mock.calls)).not.toContain("Test Person");
    expect(JSON.stringify(s.log.mock.calls)).not.toContain("0777173041");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
  it("does not resend a successful request", async () => {
    const s = setup();
    const data = body();
    await s.handler(request(data));
    expect((await s.handler(request(data))).status).toBe(200);
    expect(s.fetcher).toHaveBeenCalledOnce();
  });
  it("rejects reusing an id with changed content", async () => {
    const s = setup();
    const data = body();
    await s.handler(request(data));
    expect(
      (await s.handler(request({ ...data, message: "Changed" }))).status,
    ).toBe(409);
  });
  it("does not race duplicate concurrent submissions", async () => {
    const s = setup();
    const data = body();
    const responses = await Promise.all([
      s.handler(request(data)),
      s.handler(request(data)),
    ]);
    expect(responses.every((r) => [200, 409].includes(r.status))).toBe(true);
    expect(s.fetcher).toHaveBeenCalledOnce();
  });
  it("rejects cross-origin requests", async () => {
    const s = setup();
    expect(
      (await s.handler(request(body(), { origin: "https://attacker.example" })))
        .status,
    ).toBe(403);
    expect(s.fetcher).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON", async () => {
    const s = setup();
    const req = new Request("https://nice.example/api/enquiries", {
      method: "POST",
      headers: {
        origin: "https://nice.example",
        "content-type": "application/json",
      },
      body: "{",
    });
    expect((await s.handler(req)).status).toBe(400);
  });
  it("rejects oversized payloads even without Content-Length", async () => {
    const s = setup();
    expect(
      (await s.handler(request({ ...body(), message: "x".repeat(9000) })))
        .status,
    ).toBe(413);
  });
  it("rejects honeypot submissions without pretending to send", async () => {
    const s = setup();
    const res = await s.handler(
      request({ ...body(), website: "spam.example" }),
    );
    expect(res.status).toBe(422);
    expect(s.fetcher).not.toHaveBeenCalled();
  });
  it("rejects stale and immediate submissions", async () => {
    const s = setup();
    expect(
      (await s.handler(request({ ...body(), startedAt: 200000 }))).status,
    ).toBe(422);
  });
  it("rejects invalid field values before delivery", async () => {
    const s = setup();
    expect(
      (await s.handler(request({ ...body(), phone: "not a number" }))).status,
    ).toBe(422);
    expect(s.fetcher).not.toHaveBeenCalled();
  });
  it("provides honest unavailable state without provider configuration", async () => {
    const s = setup({ emailKey: undefined });
    const res = await s.handler(request());
    expect(res.status).toBe(503);
    expect(await res.json()).not.toHaveProperty("ok", true);
    expect(s.fetcher).not.toHaveBeenCalled();
  });
  it("never claims success for provider rejection", async () => {
    const s = setup();
    s.fetcher.mockResolvedValue(
      Response.json({ error: "bad sender" }, { status: 422 }),
    );
    expect((await s.handler(request())).status).toBe(502);
  });
  it("never claims success when provider response is ambiguous", async () => {
    const s = setup();
    s.fetcher.mockResolvedValue(Response.json({}));
    expect((await s.handler(request())).status).toBe(502);
  });
  it("limits repeated identities using a shared store", async () => {
    const s = setup();
    for (let i = 0; i < 5; i++) await s.handler(request());
    const res = await s.handler(request());
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("3600");
  });
  it("requires an adaptive challenge only after suspicious frequency", async () => {
    const s = setup({ turnstileSecret: "test-secret" });
    await s.handler(request());
    await s.handler(request());
    const res = await s.handler(request());
    expect(res.status).toBe(403);
    expect(
      ((await res.json()) as { challengeRequired: boolean }).challengeRequired,
    ).toBe(true);
  });
  it("fails closed if the trusted proxy header is absent", async () => {
    const s = setup({ trustedProxy: "cloudflare" });
    expect((await s.handler(request())).status).toBe(503);
  });
  it("does not trust arbitrary forwarded headers", async () => {
    const s = setup({ trustedProxy: "none" });
    expect(
      (await s.handler(request(body(), { "x-forwarded-for": "1.2.3.4" })))
        .status,
    ).toBe(503);
  });
  it("method policy rejects GET", async () => {
    const s = setup();
    expect(
      (await s.handler(new Request("https://nice.example/api/enquiries")))
        .status,
    ).toBe(405);
  });
});
