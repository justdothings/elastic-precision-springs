# Elastic Precision Industrial Website Implementation Plan

> **For Hermes:** This project is implemented directly in this repository. The plan documents the strategy, architecture, SEO/GEO model, and build order.

**Goal:** Build a production-ready multilingual Next.js website for a Bulgarian manufacturer of technical springs, wire forms, precision turned parts, and wire conveyor belts, with Bulgarian as the default language and English, German, and Italian as supported locales.

**Architecture:** Next.js App Router renders localized static pages from a typed content model. Product/category/gallery/industry data is centralized in TypeScript so the company name, real photography, materials, and finishing capabilities can be updated safely. Advanced visuals are progressive-enhancement client components: CSS/SVG first, Motion for scroll/hover transitions, and React Three Fiber for the hero spring.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, next-intl provider, Motion for React, React Three Fiber, three.js, Radix Dialog, Zod, lucide-react.

---

## Design Direction: Elastic Precision

- Dark graphite and blackened-steel interface inspired by premium engineering sites, not generic factory templates.
- Precise typography, technical labels, measurement ticks, schematic overlays, glowing coil paths, sharp industrial geometry.
- Springs become the brand language: hero coil, animated dividers, loading/hover effects, gallery overlays, configurator visualization.
- Tone: engineering credibility + futuristic motion + real manufacturing proof.

## Primary Positioning

**BG:** Производство и продажба на технически пружини, огъвки, автоматни детайли и пружинни транспортни ленти за индустрията.

**EN:** Manufacturing and supply of technical springs, wire forms, precision turned parts, and wire conveyor belts for industrial applications.

**Critical claim:** Пружини от тел до Ø4.5 mm / Springs from wire up to Ø4.5 mm.

This claim appears in the hero, capabilities, product pages, and schema.

## Site Map

- `/bg`, `/en`, `/de`, `/it` — localized homepages
- `/bg/produkti`, `/en/products`, `/de/produkte`, `/it/prodotti` — product overview
- Localized product detail pages:
  - compression springs
  - extension springs
  - torsion springs
  - wire forms
  - precision turned parts
  - wire conveyor belts
- Localized gallery
- Localized industries
- Localized capabilities
- Localized about page
- Localized RFQ/contact page

## Build Tasks

### Task 1 — Foundation

**Files:** package.json, next.config.ts, src/app/*, src/lib/*

1. Install production dependencies.
2. Configure metadata base, images, and typed app structure.
3. Add locale configuration and translated route map.
4. Add design tokens and global CSS.
5. Add utilities for routes, metadata, JSON-LD, and class names.

**Verification:** `npm run lint`, `npx tsc --noEmit`.

### Task 2 — Content Model

**Files:** src/content/site.ts, src/content/locales.ts, src/lib/routes.ts

1. Define locales: bg, en, de, it.
2. Define products, industries, capabilities, glossary, gallery items, FAQ, and SEO copy.
3. Create localized slugs and titles.
4. Centralize placeholder image metadata and licensing notes.
5. Add structured data helpers.

**Verification:** TypeScript checks catch missing translations or slugs.

### Task 3 — Core UI System

**Files:** src/components/ui/*, src/components/layout/*

1. Build button, badge, card, section heading, language switcher, nav, footer.
2. Use sharp industrial styling with accessible contrast and focus states.
3. Ensure mobile navigation and touch targets.

**Verification:** Build and manually inspect responsive behavior.

### Task 4 — Advanced Visual System

**Files:** src/components/visuals/*

1. Build CSS/SVG spring dividers for lightweight everywhere use.
2. Build React Three Fiber hero coil with reduced-motion fallback.
3. Build animated conveyor mesh visual with CSS/SVG.
4. Build configurator visual that changes wire diameter, coil diameter, coils, length, and spring type.

**Verification:** Build should pass without requiring WebGL at SSR time; client visuals lazy-load safely.

### Task 5 — Pages

**Files:** src/app/[locale]/[[...slug]]/page.tsx, src/components/sections/*

1. Homepage with hero, categories, capabilities, industries, process, gallery preview, RFQ CTA.
2. Product overview and individual product detail pages.
3. Gallery with filters, modal, technical overlays, and “request similar part” CTA.
4. Industries page.
5. Capabilities page.
6. About page.
7. RFQ/contact page with upload-capable form and validation-ready API route.

**Verification:** Generate all static params and test localized route matching.

### Task 6 — SEO/GEO Production Layer

**Files:** src/app/sitemap.ts, src/app/robots.ts, src/lib/seo.ts

1. Localized metadata for every page.
2. Canonical URLs and hreflang alternates.
3. Product/service schema, organization schema, FAQ schema, breadcrumbs.
4. Robots and sitemap with all localized URLs.
5. GEO-friendly answer blocks, FAQs, technical glossary, and buyer-intent copy.
6. Open Graph/Twitter metadata.

**Verification:** Build output includes pages and routes; schema is valid JSON-LD.

### Task 7 — Quality and Launch Prep

**Files:** README.md, docs/*, .env.example

1. Add deployment instructions.
2. Add real-photography brief and stock-image replacement warning.
3. Add contact/RFQ environment variables.
4. Run lint, typecheck, production build, audit review.
5. Commit, create private GitHub repository, push, and verify remote.

## Outstanding Ideas for Future Differentiation

1. Engineering-grade spring configurator that exports the RFQ as JSON/PDF.
2. Real product macro photography shot on graphite background with calipers and drawings.
3. Scroll sequence: wire → coil → end forming → measurement → finished part → RFQ card.
4. Animated conveyor belt mesh for food/cooking/cooling/drying applications.
5. Downloadable PDFs: inquiry sheet, conveyor belt inquiry form, spring measurement guide, product catalog.
6. Customer portal later: repeat orders, drawings library, quote status.
7. CMS later: Sanity with localized product and gallery schema if frequent editing is needed.

## Production Constraints

- Do not overclaim capabilities. Materials and finishes marked as examples must be confirmed by the company before launch.
- Placeholder internet images must be replaced with company-owned photography or licensed stock before public production launch.
- Heavy 3D is progressive enhancement only and respects reduced-motion preferences.
- Contact form transport must be connected to SMTP/CRM/webhook before production launch.
