# Stevini Industrial Springs Website

Production-ready multilingual industrial website starter for a Bulgarian spring manufacturer.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4
- next-intl provider
- Motion for React
- React Three Fiber + three.js
- Radix Dialog
- Static quote-request instructions with optional Zod RFQ route for future integrations

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/bg`.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run build:pages # static export for GitHub Pages
```

## Environment Variables

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SITE_URL` — real production canonical URL. This must not remain `example.com`; it drives canonical links, sitemap URLs, robots.txt, Open Graph images, and JSON-LD entity IDs.
- `NEXT_PUBLIC_BASE_PATH` — optional base path for GitHub Pages project sites, e.g. `/stevini-industrial-springs`.
- `NEXT_PUBLIC_STATIC_EXPORT` — set to `true` for static export builds.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — optional Google Search Console verification token.
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` — optional Bing Webmaster Tools verification token.
- `NEXT_PUBLIC_COMPANY_EMAILS` — comma-separated public RFQ/contact emails. `NEXT_PUBLIC_COMPANY_EMAIL` is still supported for the primary email.
- `NEXT_PUBLIC_COMPANY_PHONE` — public phone.
- `NEXT_PUBLIC_COMPANY_CITY` — city/locality for metadata.
- `NEXT_PUBLIC_COMPANY_ADDRESS` — full public address shown on the contacts page and used by the Google Maps embed.
- `NEXT_PUBLIC_COMPANY_LATITUDE` / `NEXT_PUBLIC_COMPANY_LONGITUDE` — exact map coordinates for the Google Maps embed.
- `NEXT_PUBLIC_COMPANY_WORKING_HOURS` — public working hours shown in the footer and LocalBusiness schema.
- `NEXT_PUBLIC_COMPANY_MAP_URL` — exact public Google Maps place URL used by the contacts page map link.
- `NEXT_PUBLIC_COMPANY_MAP_EMBED_URL` — CID-based Google Maps embed URL for the contacts page iframe.
- `RFQ_WEBHOOK_URL` — optional endpoint receiving validated RFQ JSON if the API form route is reused.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. On pushes to `main` it builds a static export with:

- `GITHUB_PAGES=true`
- `NEXT_PUBLIC_STATIC_EXPORT=true`
- `NEXT_PUBLIC_BASE_PATH=/${repoName}`
- `NEXT_PUBLIC_SITE_URL=https://${owner}.github.io/${repoName}`

The quote page is static-friendly and guides buyers to send a structured email with drawings, photos, or sample information. The server-capable deployment path still includes `/api/rfq` for a future form or CRM integration, but the live quote page does not require file upload handling.

## Localized Routes

- Bulgarian: `/bg`
- English: `/en`
- German: `/de`
- Italian: `/it`

Product URLs use translated/transliterated slugs, for example:

- `/bg/produkti/natiskovi-pruzhini`
- `/en/products/compression-springs`
- `/de/produkte/druckfedern`
- `/it/prodotti/molle-a-compressione`
- `/bg/kontakti`
- `/en/contacts`
- `/de/kontakt`
- `/it/contatti`
- `/bg/zapitvane`
- `/en/request-quote`
- `/de/anfrage`
- `/it/richiesta-preventivo`
- `/llms.txt`
- `/llms-full.txt`

## Localization Model

- `messages/{locale}.json` is the source of truth for translated UI, page, catalog, configurator, legal, FAQ, GEO, and form text.
- `src/i18n/locales.ts` owns locale constants and type guards.
- `src/i18n/messages.ts` lazy-loads only the requested locale for `next-intl`, route generation, metadata, and static text endpoints.
- `src/content/site.ts` keeps structural config only: company defaults, product IDs, product images, filter IDs, helper builders, and non-locale glossary rows.
- Localized route slugs live under `Routes.sections` in each locale file; product slugs live with their product copy under `Catalog.products`.

## Important Launch Notes

1. Replace placeholder brand/contact details in `src/content/site.ts`.
2. Replace all placeholder/gallery images with company-owned product photography or properly licensed stock.
3. Confirm real material, finish, tolerance, and certification claims before adding them.
4. Keep the email-first quote flow, or connect `RFQ_WEBHOOK_URL` / replace `/api/rfq` with an SMTP/CRM integration if a full form is reintroduced.
5. Set `NEXT_PUBLIC_SITE_URL` before deployment so canonical URLs, sitemap, robots.txt, Open Graph images, and schema are correct.
6. Add Google Search Console and Bing Webmaster Tools verification tokens through the public verification environment variables before launch.

## Documentation

- `docs/implementation-plan.md`
- `docs/seo-geo-plan.md`
- `docs/i18n-glossary.md`
- `docs/photography-brief.md`
- `docs/image-credits.md`
