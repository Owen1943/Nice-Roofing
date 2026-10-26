# NICE Roofing & Flooring

A complete, black-and-gold architectural materials website for NICE ROOFING AND FLOORING, Kurunegala. Built from the supplied business brief, original branding and clearly labelled illustrative imagery.

## Run

Requires Node 22.23.4+ and pnpm 11.25.0.

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

`pnpm dev` runs the Sites/Vinext development adapter. For the portable production Next.js runtime:

```sh
pnpm build:next
pnpm start:next
```

Set `SITE_ORIGIN` to the exact browser origin, including the port locally. The example uses the Docker proxy at `http://localhost:8080`; for `next start`, set it to `http://localhost:3000`. Use the existing managed preview daemon inside ChatGPT Work.

## What is implemented

- Server-rendered App Router pages: Home, Products, six category pages, Inspiration, five image-study pages, Services, About, Contact, FAQ, Privacy, loading, error and 404 states.
- TypeScript content, Tailwind integration and shadcn-compatible UI aliases; Radix dialog primitives for focus containment and Escape handling.
- Original supplied logo crop; local Cormorant Garamond and Manrope fonts; responsive black/charcoal/gold art direction.
- Product application/material filters with empty states.
- Adaptation of the supplied React Lens at `components/ui/lens.tsx`. The decorative magnifier uses pointer coordinates and matching object-fit geometry without duplicating interactive children. Touch users receive explicit enlargement controls.
- Full-screen viewer: captions, loading/error states, previous/next, keyboard navigation, focus restoration, zoom buttons, double-click/tap and drag panning. The original image remains the resolution limit.
- A short enquiry form, server validation, Sri Lankan phone normalization, honeypot, bounded request size, same-origin checks, spam-link limit, shared Redis limits, duplicate protection and Resend idempotency.
- Optional adaptive Cloudflare Turnstile after suspicious request frequency. Ordinary visitors see no challenge.
- Phone/WhatsApp links, canonical metadata, JSON-LD, sitemap, robots and contextual FAQs. No invented prices, reviews, delivery territory, certifications or opening hours.
- Production Next.js standalone build, Docker/Compose, reverse proxy, CI tests/audits and controlled container promotion workflow.

## Important launch state

The email destination in the source material is contradictory. **No live email credentials or verified recipient have been supplied.** The endpoint returns an honest unavailable state until configured. The UI retains entered details and offers an editable WhatsApp handoff. Tests use a mocked provider; no real customer message was sent.

The current gallery is **material inspiration**, not a verified completed-project portfolio. Original source screenshots and supplied AI-enhanced masters are preserved under `source-materials/`; they are not all published to visitors. Public derivatives are listed in `docs/asset-manifest.json`. Do not publish an installation as NICE work without attribution and image permission. Original photos of people remain reference-only.

The review build defaults to `NEXT_PUBLIC_INDEXABLE=false`. Change this only after owner approval and final domain configuration. The Sites review deployment is private; repository visibility does not change site access.

Higgsfield was requested during implementation. Its generation endpoint rejected the request with **“Requires basic plan or higher.”** No new image or video was generated or incorporated. All current visuals are supplied assets.

## Configuration

| Variable                                             | Exposure           | Purpose                                        |
| ---------------------------------------------------- | ------------------ | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                               | Public, build time | Canonical origin; rebuild after changing       |
| `NEXT_PUBLIC_INDEXABLE`                              | Public, build time | `true` only for approved public launch         |
| `SITE_ORIGIN`                                        | Server             | Exact allowed form origin; no wildcard         |
| `ENQUIRY_TO_EMAIL`                                   | Server secret      | Owner-confirmed delivery recipient             |
| `ENQUIRY_FROM_EMAIL`                                 | Server secret      | Resend-verified sender/domain                  |
| `RESEND_API_KEY`                                     | Server secret      | Restricted transactional send key              |
| `ABUSE_HASH_SECRET`                                  | Server secret      | Random 32+ byte HMAC secret for identifiers    |
| `TRUSTED_PROXY`                                      | Server             | `nginx`, `cloudflare`, or fail-closed `none`   |
| `REDIS_URL`                                          | Server secret      | Private Redis for Node/Docker                  |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Server secrets     | Shared Redis REST for Workers/managed hosting  |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`                     | Public, build time | Optional challenge widget site key             |
| `TURNSTILE_SECRET_KEY`                               | Server secret      | Optional server verifier, paired with site key |

Generate the hash secret with `openssl rand -hex 32`; put the value in the host secret manager, never Git. On Sites use runtime environment settings. Do not paste secrets into source or screenshots. With Turnstile, register the actual hostname and rebuild after setting the public key.

## Docker preview

```sh
cp .env.example .env
# Edit .env locally. It is gitignored.
docker compose up --build -d
docker compose logs --tail=50 app
curl http://localhost:8080/api/health
docker compose down
```

Compose provides Next.js, private Redis and Nginx on loopback port 8080. It is a **local preview configuration**, not an internet TLS terminator. Add the chosen platform's HTTPS ingress/certificate and follow [deployment.md](docs/deployment.md) before exposing it. Redis stores short-lived abuse hashes and replay markers, not enquiries. No persistent lead database is needed.

## Tests

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm audit --audit-level high
pnpm build:next
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm test:e2e
```

Playwright covers navigation, filters, viewer/focus, enquiry errors/success via mocks, accessibility with axe, mobile overflow, metadata and 404. It uses `next start` automatically; set `PLAYWRIGHT_BASE_URL` only for an existing test instance. Do not run form tests against a live email-enabled production instance.

See [the actual verification record](docs/qa.md) for what ran here and environment limits. A committed test suite is not a claim that every browser or Docker was executed locally.

## Content and assets

Edit `lib/content/site.ts` for the business facts, collections, descriptions and gallery entries. Keep canonical phone `+94777173041`. Owner must confirm address formatting and WhatsApp ownership. Product prices, dimensions, stock and technical performance are deliberately absent.

Use `scripts/prepare-images.py` to regenerate responsive WebP/AVIF derivatives and the manifest from the supplied masters. It removes EXIF by decoding pixels into fresh files. `next/image` supplies responsive image delivery; only the hero is eager. Low-resolution crops are labelled illustration and should be replaced with approved product photography. Preserve image dimensions, explicit alt text and provenance when replacing them.

An optional CMS can replace the exported typed arrays behind a validated adapter. Require authenticated editing, draft review and approved asset metadata; do not expose database writes or API keys to the browser.

## CI/CD and operations

[Quality workflow](.github/workflows/ci.yml) runs formatting, lint, types, unit/integration tests, audit, Next build, Chromium/mobile/Firefox/WebKit tests, Docker build and Trivy scanning. [Release workflow](.github/workflows/release.yml) builds an immutable GHCR image with SBOM and provenance, then optionally calls the configured deployment webhook. No hosting secrets or deployment endpoint are preconfigured. Protect `production` with required reviewers and require successful quality jobs on `main` before release.

Read [deployment](docs/deployment.md), [security](docs/security.md), [SEO and content approvals](docs/launch-checklist.md) and [design rationale](docs/design.md). This repository contains the complete editable project and supplied references; dependencies, secrets and disposable build outputs are excluded.

## Appearance and scroll interaction

The sun/moon button switches between default black-and-gold and warm limestone light mode, retaining the dark brand masthead. The choice is saved locally. The hero responds to scroll, while galleries reveal from the centre using Motion. Reduced-motion preferences keep images static and fully visible.

See [SEO/GEO launch guide](docs/seo-geo.md), [validation report](docs/qa.md), [screenshots](docs/qa/) and [deployment guide](docs/deployment.md).
