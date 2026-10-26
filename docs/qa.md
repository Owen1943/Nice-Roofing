# Validation report — 25 October 2026

## Completed checks

- TypeScript: `pnpm typecheck` passed.
- ESLint: `pnpm lint` passed with no errors or warnings.
- Vitest: 32 tests passed across validation/content/helpers and enquiry integration/abuse controls. Provider responses and shared storage are mocked; this does not claim a live email was delivered.
- Standard Next.js 16.4.3 production build passed, including route generation and proxy compilation.
- Dependency audit returned zero known vulnerabilities at the time checked. This is not a guarantee against future advisories.
- Browser QA in cloud Chrome: dark and light desktop layouts, persistent theme across reload/navigation, responsive 390px iframe layout (375px document area plus scrollbar), no observed horizontal overflow, mobile menu/navigation/theme control, hero scroll transform, centre-out gallery reveal, gallery opening/zoom/navigation/Escape/focus restoration, client form validation and actual unconfigured-provider fallback. All submitted QA data was synthetic and no email provider was configured.
- Browser error review showed no application runtime exception in the final inspected flows; browser-extension metadata messages are unrelated to the application. The expected unavailable enquiry response is handled in the UI.
- Original logo plate now blends into the dark header. Mobile decorative badge overlap and non-secure-preview UUID generation were corrected. Synthetic product image captions no longer link to nonexistent project detail URLs. Magnification is capped to available source detail.

## Reproducible screenshots

- `qa/nice-home-dark.jpg`: default desktop appearance.
- `qa/nice-home-light.jpg`: optional light appearance; same brand masthead.
- `qa/nice-home-mobile.jpg`: responsive layout inside a 390px-wide test iframe, with surrounding browser canvas retained. This is a layout check, not physical-device testing.
- `qa/nice-gallery-dark.jpg`: scroll-revealed image gallery. Lower cards are partly revealed at the recorded scroll position by design.

## Verification limits and launch dependencies

The Playwright test suite includes Chromium, Firefox, WebKit and mobile layouts, enquiry states, axe accessibility checks, metadata, 404s, theme persistence and reduced motion. Browser installation in this environment failed because its downloaded Chromium archive was truncated/empty. The suite is configured in CI but is not reported as locally passed. Actual Safari/Firefox, full WCAG auditing, Lighthouse scores and field Core Web Vitals remain unmeasured.

Docker is unavailable in this execution environment, so container build/run, Nginx/Redis compose integration and Trivy container scans are configured in CI but have not been executed locally. Dependency audit covers application packages, not the eventual host or container base image.

Higgsfield generation was attempted and retried after the user requested it again. Both attempts returned `Requires basic plan or higher`; no job or image was produced. Included AI-enhanced imagery comes from the supplied pack and is explicitly marked illustrative. It is not a verified NICE project portfolio.

Live email still requires an approved recipient, verified sender domain, provider credentials and shared Redis configuration. Business hours, service territory, final privacy practices, image permissions and official logo master require owner confirmation. Public indexing is deliberately off for the private preview and has a documented production switch. No public custom domain deployment, search ranking, successful live email, penetration test or perfect score is claimed.
