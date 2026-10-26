# Search and AI answer discoverability

## Implemented

Every page has a unique title and description, canonical URL, Open Graph and Twitter metadata. Primary content is server rendered. The category pages answer specific material-selection and availability questions; `/about` provides a concise business fact panel. Consistent name, address and telephone are supplied from one typed source. BreadcrumbList, HomeAndConstructionBusiness and FAQPage JSON-LD reflect visible facts. No fabricated rating, price, opening hours, dealer status or service territory is included.

There are 19 content routes: home, products, six product categories, inspiration, five inspiration details, about, services, contact, FAQ and privacy. Unknown slugs return a real 404. XML sitemap entries and clean internal links cover these routes. Images use descriptive alt text and explicit illustrative provenance. Uploaded reference assets are preserved separately from public website assets.

Query intent is mapped naturally: roofing tiles Kurunegala → roofing category; terracotta floor tiles Kurunegala → floor category; wall cladding/ventilation blocks → their categories; paving bricks Kurunegala → paving category; showroom/directions/quote → contact. These are relevant search intents, not claimed search-volume measurements.

## Public launch configuration

The private preview deliberately has `noindex` and robots disallow. Before public launch, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and `NEXT_PUBLIC_INDEXABLE=true`, rebuild, and verify both rendered robots metadata and `/robots.txt`. Update `SITE_ORIGIN` to the same origin for form CSRF protection. Do not allow a preview domain and a production domain to compete for indexing.

1. Confirm business facts, photography permissions, email delivery and privacy notice with the owner.
2. Verify the final domain in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml`.
3. Inspect the home, category, contact and FAQ URLs using rendered HTML and Google URL Inspection. Test JSON-LD with Rich Results Test and Schema.org validator. Eligibility does not guarantee a rich result.
4. Confirm Google Business Profile name, address, phone, directions and opening hours with the business. Add an approved profile URL only when available. Do not create a fabricated map pin.
5. Confirm CDN/WAF allows legitimate search crawling; keep enquiry API and preview environments excluded.
6. Measure Lighthouse on the production origin and real-user Core Web Vitals over time. Target p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; these targets are not measured scores.
7. Track relevant query impressions, indexed pages and enquiry conversions. Add analytics only after choosing an appropriate consent/privacy approach. Keep names, phone numbers and message contents out of analytics.
8. Add original, approved project photographs and useful product data as they become available. Keep facts and FAQ answers current rather than adding thin location pages.

## GEO approach

The site makes the business entity, offered categories, actual location, contact methods and evidence limitations easy to understand in visible text. The same facts appear in structured data. It uses meaningful pages and answers rather than keyword repetition or hidden AI instructions. No special AI markup or `llms.txt` is needed to promise inclusion, and no ranking or AI citation outcome is guaranteed.

References reviewed on 25 October 2026: [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Roofmart](https://www.roofmartlk.com/) for competitor information architecture only. Google recommends normal crawlable, helpful, text-accessible content and structured data that agrees with what visitors see.
