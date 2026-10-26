# Security boundaries

## Threats and controls

| Threat                                   | Implemented control                                                                                                            | Remaining host/owner responsibility                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Enquiry spam/cost abuse                  | 8 KiB streaming body limit, strict schema, length limits, honeypot, timing and link checks, shared per-IP/per-telephone limits | Edge WAF; monitor false positives and abuse                |
| Spoofed proxy identity                   | Explicit trusted ingress mode; no arbitrary X-Forwarded-For trust; fail closed if trusted header absent                        | Firewall direct origin, configure real trusted proxy chain |
| Forged cross-site POST                   | Exact Origin check, cross-site rejection, JSON-only endpoint                                                                   | Correct canonical origin; no permissive CORS               |
| Duplicate delivery                       | Atomic Redis claim, 24h sent marker bound to content, Resend idempotency key                                                   | Provider outage/retention monitoring                       |
| Script injection                         | Text-only email, strict name/schema, React output encoding, safe JSON-LD serialization, nonce CSP                              | Re-audit if CMS/rich text is introduced                    |
| PII leakage                              | No form payload in app logs/analytics; HMAC identifiers; no customer database                                                  | Review provider/mailbox logs and retention                 |
| Dependency compromise                    | Lockfile, audits, Dependabot, CI scan, non-root container, SBOM/provenance                                                     | Keep patches and action pins reviewed                      |
| Clickjacking/unsafe browser capabilities | Production CSP frame-ancestors none, DENY, nosniff, referrer and permissions policies                                          | TLS ingress/HSTS enforcement on final domain               |

The development-only CSP permits same-origin framing for isolated mobile viewport QA. Production denies framing. Inline styles are allowed because React style props and image positioning require them; scripts use per-request nonces, no production unsafe-eval. The JSON-LD serializer escapes `<`, `>` and `&`; only typed local content is emitted. The script nonce uses hydration suppression only for the browser's nonce-hiding behaviour.

## API policy

`POST /api/enquiries`: 200 only after provider acceptance or a verified duplicate of an accepted request. 400 malformed input, 403 origin/challenge, 413 body too large, 415 wrong media type, 422 field/spam rejection, 429 rate limit, 502 provider refusal, 503 missing configuration/storage/network failure. Failure messages do not expose upstream details or stack traces.

Hard limits: ten attempts per network and five per normalized telephone per hour. A configured Turnstile challenge applies above three network attempts or two identity attempts. Hash records expire after one hour, successful request markers after 24 hours, in-flight lock after sixty seconds. Redis expiry is atomic; all replicas share the same store. Outages fail closed with call/WhatsApp fallback.

Provider timeout can be ambiguous: the UI says delivery is not confirmed. Retrying uses the same UUID so the provider can deduplicate. Changed payload under a successful UUID is rejected. User-origin data is never used as an email header; email body is plain text. No actual email was sent during development.

## Observability

Application log events contain only `event`, HTTP status and duration. Suggested alerts: elevated 5xx submission ratio, 429 spikes, health failures, Redis timeouts and provider rejection counts. Do not add raw phone, IP, name, message or payload to dashboards. Nginx uses a minimal status/timing access log; the hosting provider's own logs must be reviewed separately.

## Boundaries

This is not a penetration test or a claim of legal/privacy certification. The business must confirm its privacy notice, mailbox retention and image rights. No administration interface, accounts, payments or uploads have been added. If uploads are added later, enforce MIME magic bytes, byte/pixel caps, EXIF removal, isolated storage and authenticated owner access.
