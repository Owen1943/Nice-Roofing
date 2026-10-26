import { createEnquiryHandler } from "@/lib/enquiry-handler";
import { getStore } from "@/lib/abuse-store";
import { origin } from "@/lib/content/site";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const handler = createEnquiryHandler(
    {
      origin:
        process.env.NODE_ENV === "development"
          ? new URL(request.url).origin
          : process.env.SITE_ORIGIN || origin,
      secret: process.env.ABUSE_HASH_SECRET,
      recipient: process.env.ENQUIRY_TO_EMAIL,
      sender: process.env.ENQUIRY_FROM_EMAIL,
      emailKey: process.env.RESEND_API_KEY,
      turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
      trustedProxy:
        process.env.TRUSTED_PROXY === "cloudflare"
          ? "cloudflare"
          : process.env.TRUSTED_PROXY === "nginx"
            ? "nginx"
            : "none",
    },
    {
      store: getStore,
      fetcher: fetch,
      now: Date.now,
      log: (data) => console.info(JSON.stringify(data)),
    },
  );
  return handler(request);
}
