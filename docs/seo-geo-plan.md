# SEO and GEO Plan

## SEO Goals

- Rank for Bulgarian and EU buyer-intent searches around technical springs, wire forms, precision turned parts, custom springs, and wire conveyor belts.
- Make the Ø4.5 mm wire capability visible in page titles, headings, product copy, structured data, and RFQ CTAs.
- Build topical authority in Bulgarian first, then expand with professional translations for English, German, and Italian.

## GEO Goals

GEO here means generative engine optimization: make content easy for AI answer engines to cite, summarize, and route to the company.

Implementation patterns:

- Direct answer blocks near the top of pages.
- Clear product taxonomies and translated technical terms.
- Short FAQ answers with buyer-intent language.
- Structured data for Organization, WebSite, Product/Service pages, BreadcrumbList, and FAQPage.
- Localized hreflang alternates and canonical URLs.
- Consistent NAP placeholders ready for the real address/phone/email.

## Localized Keyword Themes

### Bulgarian

- технически пружини
- производство на пружини
- пружини от тел до 4.5 мм
- натискови пружини
- опънови пружини
- торсионни пружини
- огъвки от тел
- автоматни детайли
- пружинни транспортни ленти
- пружини по чертеж

### English

- technical springs manufacturer
- custom springs up to 4.5 mm wire
- compression springs
- extension springs
- torsion springs
- wire forms
- precision turned parts
- wire conveyor belts

### German

- Hersteller technischer Federn
- Federn aus Draht bis 4,5 mm
- Druckfedern
- Zugfedern
- Torsionsfedern / Schenkelfedern
- Drahtbiegeteile
- Federförderband / Drahtförderband

### Italian

- produttore molle tecniche
- molle con filo fino a 4,5 mm
- molle a compressione
- molle a trazione
- molle a torsione
- elementi piegati in filo
- nastri trasportatori a rete metallica

## Technical SEO Checklist

- [x] Static localized routes under `/bg`, `/en`, `/de`, `/it`.
- [x] Localized page titles and descriptions.
- [x] Canonical URL per page.
- [x] hreflang alternates for all localized pages.
- [x] Sitemap generated from route map.
- [x] Robots config.
- [x] Open Graph and Twitter metadata.
- [x] Local business and organization schema.
- [x] Product/service schema on product pages.
- [x] FAQ schema on main buyer pages.
- [x] Image alt text in each language.
- [x] Accessible headings and semantic sections.
- [x] Performance-first animation strategy.

## Content Rules

- Bulgarian is the source-of-truth language.
- German and Italian should be reviewed by a native/professional translator before launch.
- Avoid unsupported claims like ISO certifications, tolerances, material certificates, CNC inventory, heat treatment, or specific coatings unless confirmed.
- Use “according to drawing, sample, or specification” repeatedly because it matches buyer intent.

## Image SEO Rules

- Use real company product photography for the launch version.
- Placeholder images are documented and isolated for easy replacement.
- Each gallery item includes alt text, product category, material/context labels, and RFQ prefill value.

## Launch Validation

Run before deployment:

```bash
npm run lint
npm run typecheck
npm run build
```

Then validate:

- Lighthouse performance and SEO scores.
- Rich results test for JSON-LD.
- Sitemap and robots accessible.
- hreflang self-referencing and cross-referencing.
- Contact/RFQ workflow connected to the real business inbox or CRM.
