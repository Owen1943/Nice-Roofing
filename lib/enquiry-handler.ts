import { enquirySchema, normalizePhone } from "./validation";
import type { AbuseStore } from "./abuse-store";
type Config = {
  origin: string;
  secret?: string;
  recipient?: string;
  sender?: string;
  emailKey?: string;
  turnstileSecret?: string;
  trustedProxy: "cloudflare" | "nginx" | "none";
  test?: boolean;
};
type Deps = {
  store: () => Promise<AbuseStore>;
  fetcher: typeof fetch;
  now: () => number;
  log: (data: Record<string, unknown>) => void;
};
const reply = (
  status: number,
  data: Record<string, unknown>,
  extra: Record<string, string> = {},
) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
async function digest(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
async function boundedJson(req: Request) {
  if (Number(req.headers.get("content-length")) > 8192)
    throw Error("too_large");
  if (!req.body) return {};
  const reader = req.body.getReader();
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 8192) {
      await reader.cancel();
      throw Error("too_large");
    }
    chunks.push(value);
  }
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    combined.set(c, offset);
    offset += c.length;
  }
  return JSON.parse(new TextDecoder().decode(combined));
}
export function createEnquiryHandler(config: Config, deps: Deps) {
  return async (req: Request) => {
    const started = deps.now();
    let status = 500;
    const done = (
      s: number,
      d: Record<string, unknown>,
      h: Record<string, string> = {},
    ) => {
      status = s;
      return reply(s, d, h);
    };
    try {
      if (req.method !== "POST")
        return done(405, { error: "Method not allowed." }, { Allow: "POST" });
      if (
        req.headers.get("origin") !== config.origin ||
        req.headers.get("sec-fetch-site") === "cross-site"
      )
        return done(403, {
          error: "Please send your enquiry from this website.",
        });
      if (
        !req.headers
          .get("content-type")
          ?.toLowerCase()
          .startsWith("application/json")
      )
        return done(415, { error: "Unsupported request format." });
      let raw: unknown;
      try {
        raw = await boundedJson(req);
      } catch (e) {
        return done((e as Error).message === "too_large" ? 413 : 400, {
          error: "Please check your enquiry and try again.",
        });
      }
      const parsed = enquirySchema.safeParse(raw);
      if (!parsed.success)
        return done(422, {
          error: "Please check the highlighted fields.",
          fields: parsed.error.flatten().fieldErrors,
        });
      const data = parsed.data;
      if (data.website)
        return done(422, {
          error: "We could not accept this enquiry. Please call us instead.",
        });
      if (
        deps.now() - data.startedAt < 1500 ||
        deps.now() - data.startedAt > 86400000
      )
        return done(422, {
          error:
            "Please take a moment to check your details, then try again. Refresh the page if it has been open since yesterday.",
        });
      if ((data.message.match(/https?:\/\//gi) || []).length > 3)
        return done(422, {
          error: "Please remove extra links from your message.",
        });
      if (
        !config.secret ||
        !config.recipient ||
        !config.sender ||
        !config.emailKey
      )
        return done(503, {
          error:
            "Online email enquiries are not available yet. Please call or continue on WhatsApp.",
        });
      const phone = normalizePhone(data.phone)!;
      const ip =
        config.trustedProxy === "cloudflare"
          ? req.headers.get("cf-connecting-ip")
          : config.trustedProxy === "nginx"
            ? req.headers.get("x-real-ip")
            : null;
      if (!ip)
        return done(503, {
          error:
            "Online enquiries are temporarily unavailable. Please call or use WhatsApp.",
        });
      const store = await deps.store();
      const identity = await digest(config.secret, phone);
      const network = await digest(config.secret, ip);
      const content = await digest(
        config.secret,
        JSON.stringify([data.name, phone, data.category, data.message]),
      );
      const key = `nice:request:${data.requestId}`;
      const previous = await store.get(key);
      if (previous?.startsWith("sent:"))
        return previous === `sent:${content}`
          ? done(200, {
              ok: true,
              message: "Your enquiry was accepted for email delivery.",
            })
          : done(409, {
              error:
                "This enquiry reference has already been used. Refresh to begin a new enquiry.",
            });
      const [ipCount, phoneCount] = await Promise.all([
        store.count(`nice:ip:${network}`, 3600),
        store.count(`nice:phone:${identity}`, 3600),
      ]);
      if (ipCount > 10 || phoneCount > 5)
        return done(
          429,
          {
            error:
              "Please wait before sending another enquiry, or call us directly.",
          },
          { "Retry-After": "3600" },
        );
      if ((ipCount > 3 || phoneCount > 2) && config.turnstileSecret) {
        if (!data.challengeToken)
          return done(403, {
            error: "Please complete the security check.",
            challengeRequired: true,
          });
        const verification = await deps.fetcher(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: new URLSearchParams({
              secret: config.turnstileSecret,
              response: data.challengeToken,
            }),
            signal: AbortSignal.timeout(6000),
          },
        );
        const v = (await verification.json()) as {
          success: boolean;
          hostname: string;
          action: string;
        };
        if (
          !v.success ||
          v.hostname !== new URL(config.origin).hostname ||
          v.action !== "enquiry"
        )
          return done(403, {
            error: "The security check expired. Please try again.",
            challengeRequired: true,
          });
      }
      if (!(await store.claim(key, 60)))
        return done(409, {
          error:
            "This enquiry is already being processed. Please wait a moment before retrying.",
        });
      const result = await deps.fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.emailKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `nice-${data.requestId}`,
        },
        body: JSON.stringify({
          from: config.sender,
          to: [config.recipient],
          subject: "New NICE website enquiry",
          text: `Name: ${data.name}\nPhone: ${phone}\nInterest: ${data.category || "Not specified"}\n\n${data.message || "No additional message."}`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      const provider = (await result.json()) as { id?: string };
      if (!result.ok || !provider.id) {
        await store.remove(key);
        return done(502, {
          error:
            "Email delivery could not be confirmed. Please retry or continue on WhatsApp.",
        });
      }
      await store.set(key, `sent:${content}`, 86400);
      return done(200, {
        ok: true,
        message:
          "Thank you. Your enquiry was accepted for email delivery. The team can contact you using your number.",
      });
    } catch {
      return done(503, {
        error:
          "We could not confirm delivery. Please retry in a moment or use WhatsApp.",
      });
    } finally {
      deps.log({ event: "enquiry", status, durationMs: deps.now() - started });
    }
  };
}
