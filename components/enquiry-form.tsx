"use client";
import { requestUuid } from "@/lib/id";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { normalizePhone } from "@/lib/phone";
import { whatsapp } from "@/lib/content/site";
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
export function EnquiryForm({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState(initialCategory);
  const [challenge, setChallenge] = useState(false);
  const [fallback, setFallback] = useState(whatsapp());
  const started = useRef(0);
  const requestId = useRef("");
  const token = useRef("");
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    requestId.current = requestUuid();
    started.current = Date.now();
  }, []);
  useEffect(() => {
    if (status) statusRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (!challenge || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    const render = () => {
      if (!cancelled && widget.current && window.turnstile) {
        widgetId.current = window.turnstile.render(widget.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          action: "enquiry",
          callback: (v: string) => {
            token.current = v;
          },
          "expired-callback": () => {
            token.current = "";
          },
          "error-callback": () => {
            token.current = "";
          },
        });
      }
    };
    let script: HTMLScriptElement | null = null;
    if (window.turnstile) render();
    else {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile)
        window.turnstile.remove(widgetId.current);
      script?.remove();
    };
  }, [challenge]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setStatus(null);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "");
    const message = String(fd.get("message") || "").trim();
    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = "Please enter your name.";
    if (!normalizePhone(phone))
      nextErrors.phone = "Enter a Sri Lankan number, e.g. 077 717 3041.";
    if (message.length > 1500)
      nextErrors.message = "Keep your message under 1,500 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form
        .querySelector<HTMLInputElement>(
          `[name="${Object.keys(nextErrors)[0]}"]`,
        )
        ?.focus();
      return;
    }
    setFallback(
      whatsapp(
        `Hello NICE Roofing & Flooring. My name is ${name}. I’m interested in ${category || "your materials"}.${message ? " " + message : ""}`,
      ),
    );
    setPending(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          category,
          message,
          website: String(fd.get("website") || ""),
          requestId: requestId.current,
          startedAt: started.current,
          challengeToken: token.current || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        fields?: Record<string, string[]>;
        challengeRequired?: boolean;
      };
      if (data.fields)
        setErrors(
          Object.fromEntries(
            Object.entries(data.fields).map(([k, v]) => [k, v[0]]),
          ),
        );
      if (data.challengeRequired) {
        setChallenge(true);
        if (widgetId.current) window.turnstile?.reset(widgetId.current);
        token.current = "";
      }
      if (res.ok && data.ok) {
        setStatus({
          ok: true,
          message: data.message || "Your enquiry was accepted for delivery.",
        });
        form.reset();
        setCategory("");
        requestId.current = requestUuid();
        started.current = Date.now();
      } else
        setStatus({
          ok: false,
          message:
            data.error ||
            "Delivery could not be confirmed. Please call or use WhatsApp.",
        });
    } catch {
      setStatus({
        ok: false,
        message:
          "We could not reach the enquiry service. Your message has not been confirmed as sent. Please call or continue on WhatsApp.",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      className="enquiry-form"
      method="post"
      action="/api/enquiries"
      onSubmit={submit}
      noValidate
    >
      <h2>Tell us a little.</h2>
      <p>Just your name and number to get started.</p>
      {status && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={status.ok ? "status" : "alert"}
          className={`form-status ${status.ok ? "success" : ""}`}
        >
          {status.message}
          {!status.ok && (
            <a href={fallback} target="_blank" rel="noopener noreferrer">
              Continue on WhatsApp ↗
            </a>
          )}
        </div>
      )}
      <div className="field">
        <label htmlFor="enquiry-name">Your name</label>
        <input
          name="name"
          id="enquiry-name"
          autoComplete="name"
          required
          maxLength={80}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Your name"
        />
        {errors.name && (
          <span className="field-error" id="name-error">
            {errors.name}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="enquiry-phone">Phone / WhatsApp number</label>
        <input
          name="phone"
          type="tel"
          id="enquiry-phone"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={30}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          placeholder="e.g. 077 123 4567"
        />
        {errors.phone && (
          <span className="field-error" id="phone-error">
            {errors.phone}
          </span>
        )}
      </div>
      <fieldset>
        <legend>
          What can we help with? <span>(optional)</span>
        </legend>
        <div className="category-chips">
          {["Roofing tiles", "Flooring", "Wall tiles", "Paving", "Other"].map(
            (c) => (
              <label key={c}>
                <input
                  type="radio"
                  name="interest"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                />
                {c}
              </label>
            ),
          )}
        </div>
        {category &&
          ![
            "Roofing tiles",
            "Flooring",
            "Wall tiles",
            "Paving",
            "Other",
          ].includes(category) && (
            <p className="privacy-note">Enquiring about: {category}</p>
          )}
      </fieldset>
      <div className="field">
        <label htmlFor="enquiry-message">
          Anything else? <span>(optional)</span>
        </label>
        <textarea
          name="message"
          id="enquiry-message"
          maxLength={1500}
          rows={3}
          placeholder="A few words about your project…"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <span className="field-error">{errors.message}</span>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {challenge && <div ref={widget} />}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
        {pending ? <LoaderCircle size={17} /> : <ArrowUpRight size={17} />}
      </button>
      <p className="privacy-note">
        By sending, you ask NICE to contact you about this enquiry. See our{" "}
        <Link href="/privacy">privacy notice</Link>.
      </p>
      <a
        className="form-footer-link"
        href={whatsapp()}
        target="_blank"
        rel="noopener noreferrer"
      >
        Prefer WhatsApp? Start a conversation ↗
      </a>
    </form>
  );
}
