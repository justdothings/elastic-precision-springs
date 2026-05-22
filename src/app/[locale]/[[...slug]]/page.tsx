import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, Cpu, FileUp, Globe2, Mail, MapPin, Navigation, Phone, ShieldCheck } from "lucide-react";
import {
  buildProduct,
  buildProducts,
  company,
  isLocale,
  type CatalogProducts,
  type Locale,
  type Product,
} from "@/content/site";
import type { AppMessages } from "@/i18n/messages";
import { Header, Footer } from "@/components/layout/SiteChrome";
import { LinkButton } from "@/components/ui/Button";
import { Badge, SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImageLightbox } from "@/components/gallery/ProductImageLightbox";
import { QuoteTypeSelector } from "@/components/quote/QuoteTypeSelector";
import { SpringConfigurator } from "@/components/configurator/SpringConfigurator";
import { MotionReveal } from "@/components/visuals/MotionReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  offerCatalogSchema,
  organizationSchema,
  productSchema,
  webPageSchema,
  websiteSchema,
} from "@/lib/seo";
import { withBasePath } from "@/lib/base-path";
import { getAllStaticParams, getPath, resolvePath, type PageDescriptor } from "@/lib/routes";

type SiteMessages = AppMessages["Site"];
type ContentMessages = AppMessages["Content"];
type CatalogFilters = AppMessages["Catalog"]["filters"];

export async function generateStaticParams() {
  return getAllStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug?: string[] }> }): Promise<Metadata> {
  const { locale: rawLocale, slug = [] } = await params;
  if (!isLocale(rawLocale)) return {};
  const descriptor = await resolvePath(rawLocale, slug);
  if (!descriptor) return {};
  return buildMetadata(rawLocale, descriptor);
}

export default async function LocalizedPage({ params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale: rawLocale, slug = [] } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const descriptor = await resolvePath(locale, slug);
  if (!descriptor) notFound();

  const [organization, website, webpage, breadcrumb, faq, offerCatalog, product] = await Promise.all([
    organizationSchema(locale),
    websiteSchema(locale),
    webPageSchema(locale, descriptor),
    breadcrumbSchema(locale, descriptor),
    descriptor.type === "home" || descriptor.type === "springManufacturer" ? faqSchema(locale, descriptor) : Promise.resolve(null),
    descriptor.type === "home" || descriptor.type === "products" ? offerCatalogSchema(locale) : Promise.resolve(null),
    descriptor.type === "product" ? productSchema(locale, descriptor.productId) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Header locale={locale} descriptor={descriptor} />
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd data={webpage} />
      <JsonLd data={breadcrumb} />
      {faq ? <JsonLd data={faq} /> : null}
      {offerCatalog ? <JsonLd data={offerCatalog} /> : null}
      {product ? <JsonLd data={product} /> : null}
      <main>{await renderPage(locale, descriptor)}</main>
      <Footer locale={locale} />
    </div>
  );
}

async function getSiteCopy(locale: Locale): Promise<SiteMessages> {
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    nav: t.raw("nav"),
    cta: t.raw("cta"),
    home: t.raw("home"),
    pages: t.raw("pages"),
    seo: t.raw("seo"),
    form: t.raw("form"),
    formPlaceholders: t.raw("formPlaceholders"),
    quoteInstructions: t.raw("quoteInstructions"),
    ui: t.raw("ui"),
    legal: t.raw("legal"),
    faq: t.raw("faq"),
    springManufacturer: t.raw("springManufacturer"),
  } as SiteMessages;
}

async function getCatalog(locale: Locale): Promise<{ filters: CatalogFilters; products: Product[] }> {
  const t = await getTranslations({ locale, namespace: "Catalog" });
  const catalogProducts = t.raw("products") as CatalogProducts;

  return {
    filters: t.raw("filters") as CatalogFilters,
    products: buildProducts(catalogProducts),
  };
}

async function getContent(locale: Locale): Promise<ContentMessages> {
  const t = await getTranslations({ locale, namespace: "Content" });
  return {
    applications: t.raw("applications"),
    about: t.raw("about"),
    capabilities: t.raw("capabilities"),
    geoFacts: t.raw("geoFacts"),
    faqs: t.raw("faqs"),
  } as ContentMessages;
}

async function renderPage(locale: Locale, descriptor: PageDescriptor) {
  if (descriptor.type === "home") return <HomePage locale={locale} />;
  if (descriptor.type === "springManufacturer") return <SpringManufacturerPage locale={locale} />;
  if (descriptor.type === "products") return <ProductsPage locale={locale} />;
  if (descriptor.type === "applications") return <ApplicationsPage locale={locale} />;
  if (descriptor.type === "capabilities") return <ApplicationsPage locale={locale} />;
  if (descriptor.type === "about") return <AboutPage locale={locale} />;
  if (descriptor.type === "contacts") return <ContactsPage locale={locale} />;
  if (descriptor.type === "contact") return <RFQPage locale={locale} />;
  if (descriptor.type === "privacy") return <LegalPage locale={locale} type="privacy" />;
  if (descriptor.type === "terms") return <LegalPage locale={locale} type="terms" />;
  if (descriptor.type === "product") {
    const t = await getTranslations({ locale, namespace: "Catalog" });
    return <ProductPage locale={locale} product={buildProduct(t.raw("products") as CatalogProducts, descriptor.productId)} />;
  }
  notFound();
}

async function HomePage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const content = await getContent(locale);
  const { products } = await getCatalog(locale);
  const contactPath = await getPath(locale, { type: "contact" });
  const productsPath = await getPath(locale, { type: "products" });

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="technical-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
          <div className="max-w-4xl">
            <Badge>{copy.home.eyebrow}</Badge>
            <h1 className="mt-5 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-normal text-white md:text-4xl lg:text-5xl">
              {copy.home.headline}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-slate-300 md:text-lg">{copy.home.subhead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={contactPath}>{copy.cta.quote}<ArrowRight className="h-4 w-4" /></LinkButton>
              <LinkButton href={productsPath} variant="secondary">{copy.cta.products}</LinkButton>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {copy.home.proof.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-slate-200">
                  <Check className="h-4 w-4 text-cyan-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Badge>{copy.home.configuratorTitle}</Badge>
              <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100">
                Ø0.2–4.5 {copy.ui.millimeterWire}
              </span>
            </div>
            <SpringConfigurator />
          </div>
        </div>
      </section>

      <Section className="pt-20">
        <SectionHeading title={copy.home.productTitle} />
        <ProductCards locale={locale} products={products} openLabel={copy.ui.open} />
      </Section>

      <Section>
        <SectionHeading eyebrow={copy.nav.applications} title={copy.pages.applications.title}>{copy.pages.applications.intro}</SectionHeading>
        <ApplicationsCapabilities content={content} capabilityTitle={copy.pages.capabilities.title} />
      </Section>

      <Section>
        <SectionHeading title={copy.home.processTitle}>{copy.pages.contact.intro}</SectionHeading>
        <ProcessSteps steps={copy.home.process} />
      </Section>

      <Section className="pb-20">
        <FAQ copy={copy} faqs={content.faqs} />
      </Section>
    </>
  );
}

async function SpringManufacturerPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const landing = copy.springManufacturer;
  const contactPath = await getPath(locale, { type: "contact" });
  const contactsPath = await getPath(locale, { type: "contacts" });
  const productDescriptors = [
    { type: "product" as const, productId: "compression-springs" as const },
    { type: "product" as const, productId: "extension-springs" as const },
    { type: "product" as const, productId: "torsion-springs" as const },
    { type: "product" as const, productId: "wire-forms" as const },
  ];
  const productLinks = await Promise.all(productDescriptors.map((descriptor) => getPath(locale, descriptor)));

  return (
    <>
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-4xl">
            <Badge>{landing.eyebrow}</Badge>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-normal text-white md:text-5xl">{landing.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{landing.intro}</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{landing.contactLink}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={contactPath}>
                {landing.quoteButton}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={contactsPath} variant="secondary">{landing.contactLinkCta}</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <Section className="pt-20">
        <SectionHeading title={landing.typesTitle}>{landing.typesIntro}</SectionHeading>
        <div className="grid gap-5 md:grid-cols-2">
          {landing.types.map((type, index) => (
            <Link
              key={type.title}
              href={productLinks[index]}
              className="group rounded-[1.25rem] border border-white/10 bg-white/[.035] p-6 transition hover:border-cyan-200/35 hover:bg-white/[.055]"
            >
              <h2 className="text-2xl font-semibold tracking-normal text-white">{type.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{type.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                {copy.ui.open} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <LandingList title={landing.industriesTitle} intro={landing.industriesIntro} items={landing.industries} />
          <LandingList title={landing.capabilitiesTitle} intro={landing.capabilitiesIntro} items={landing.capabilities} />
          <LandingList title={landing.whyTitle} intro={landing.whyIntro} items={landing.why} />
        </div>
      </Section>

      <Section>
        <div className="rounded-[1.5rem] border border-cyan-200/20 bg-cyan-200/[.06] p-8">
          <h2 className="text-3xl font-semibold tracking-normal text-white">{landing.quoteTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{landing.quoteBody}</p>
          <LinkButton href={contactPath} className="mt-6">
            {landing.quoteButton}
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>

      <Section className="pb-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title={landing.faqTitle} />
          <div className="grid gap-4">
            {landing.faqs.map((item) => (
              <details key={item.question} className="rounded-[1.25rem] border border-white/10 bg-white/[.035] p-5">
                <summary className="cursor-pointer text-lg font-semibold text-white">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

async function ProductsPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const { products } = await getCatalog(locale);
  return (
    <Section className="py-20">
      <SectionHeading title={copy.pages.products.title}>{copy.pages.products.intro}</SectionHeading>
      <ProductCards locale={locale} products={products} openLabel={copy.ui.open} />
    </Section>
  );
}

async function ApplicationsPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const content = await getContent(locale);
  return (
    <Section className="py-20">
      <SectionHeading title={copy.pages.applications.title}>{copy.pages.applications.intro}</SectionHeading>
      <ApplicationsCapabilities content={content} capabilityTitle={copy.pages.capabilities.title} />
    </Section>
  );
}

async function AboutPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const content = await getContent(locale);
  const about = content.about;
  return (
    <Section className="py-20">
      <div className="max-w-5xl">
        <Badge>{copy.nav.about}</Badge>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{copy.pages.about.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.pages.about.intro}</p>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <AboutInfoCard icon={ShieldCheck} title={about.focus.title}>
          <p className="text-base leading-8 text-slate-300">{about.focus.body}</p>
        </AboutInfoCard>
        <AboutInfoCard icon={FileUp} title={about.request.title} accent="amber">
          <ul className="grid gap-4">
            {about.request.items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-slate-200">
                <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AboutInfoCard>
      </div>
      <AboutFacts facts={content.geoFacts} />
    </Section>
  );
}

async function ContactsPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const googleMapsUrl = company.mapUrl;
  const googleMapsEmbedUrl = company.mapEmbedUrl;

  return (
    <Section className="py-20">
      <div className="max-w-5xl">
        <Badge>{copy.ui.contactBadge}</Badge>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{copy.pages.contacts.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.pages.contacts.intro}</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[.88fr_1.12fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[.035] p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-normal text-white">{copy.ui.contactDetails}</h2>
          <div className="mt-6 grid gap-4">
            <ContactMethod
              href={googleMapsUrl}
              icon={MapPin}
              label={copy.ui.address}
              value={company.address}
            />
            <ContactMethod
              href={company.emailHref}
              icon={Mail}
              label={copy.form.email}
              value={company.emailList}
            />
            <ContactMethod
              href={`tel:${company.phone.replace(/[\s()-]/g, "")}`}
              icon={Phone}
              label={copy.form.phone}
              value={company.phone}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.035]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">{copy.ui.mapTitle}</h2>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-200/15"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {copy.ui.openMap}
            </a>
          </div>
          <iframe
            src={googleMapsEmbedUrl}
            title={copy.ui.mapTitle}
            className="h-[22rem] w-full border-0 md:h-[28rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </Section>
  );
}

async function RFQPage({ locale }: { locale: Locale }) {
  const copy = await getSiteCopy(locale);
  const quote = copy.quoteInstructions;
  const emailBody = quote.template.join("\n");
  const mailtoHref = `${company.emailHref}?subject=${encodeURIComponent(quote.emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const phoneHref = `tel:${company.phone.replace(/[\s()-]/g, "")}`;

  return (
    <Section className="py-20">
      <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
        <div>
          <Badge>{copy.ui.rfqBadge}</Badge>
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{copy.pages.contact.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">{copy.pages.contact.intro}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[.035] p-5 md:p-6">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-white">{copy.ui.contactDetails}</h2>
          <div className="mt-5 grid gap-3">
            <a
              href={mailtoHref}
              className="focus-ring flex items-center gap-3 rounded-md border border-cyan-200/35 bg-cyan-200/10 px-4 py-3 text-sm text-cyan-50 transition hover:border-cyan-200/70 hover:bg-cyan-200/15 hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
              <span>
                <span className="block font-semibold">{quote.emailCta}</span>
                <span className="mt-1 block text-slate-300">{company.emailList}</span>
              </span>
            </a>
            <a
              href={phoneHref}
              className="focus-ring flex items-center gap-3 rounded-md border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-200/40 hover:bg-white/[.06] hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
              <span>
                <span className="block font-semibold">{quote.phoneCta}</span>
                <span className="mt-1 block text-slate-300">{company.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <SectionHeading title={quote.typeTitle} />
        <QuoteTypeSelector types={quote.types} neededLabel={quote.needed} optionalLabel={quote.optional} />
      </div>
    </Section>
  );
}

function ContactMethod({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="focus-ring group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 transition hover:border-cyan-200/35 hover:bg-white/[.055]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <span className="mt-2 block text-base leading-7 text-slate-100 transition group-hover:text-white">{value}</span>
      </span>
    </a>
  );
}

async function LegalPage({ locale, type }: { locale: Locale; type: "privacy" | "terms" }) {
  const copy = await getSiteCopy(locale);
  const page = type === "privacy" ? copy.pages.privacy : copy.pages.terms;
  const legal = copy.legal[type];

  return (
    <Section className="py-20">
      <SectionHeading title={page.title}>{page.intro}</SectionHeading>
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[.035] p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">{legal.heading}</h2>
        <p className="mt-4 text-base leading-7 text-slate-300">{legal.body.replace("{brand}", company.brand)}</p>
        <ul className="mt-6 grid gap-3 text-sm leading-6 text-slate-300">
          {legal.bullets.map((item) => (
            <li key={item} className="rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

async function ProductPage({ locale, product }: { locale: Locale; product: Product }) {
  const copy = await getSiteCopy(locale);
  const contactPath = await getPath(locale, { type: "contact" });

  return (
    <>
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <Badge>{product.specs[0]}</Badge>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white md:text-7xl">{product.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{product.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={`${contactPath}?product=${product.id}`}>{copy.cta.quote}</LinkButton>
            </div>
          </div>
          <ProductImageLightbox
            src={product.image}
            alt={product.title}
            closeLabel={copy.ui.close}
            priority
          />
        </div>
      </section>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <InfoCard title={copy.ui.productSpecs} items={product.specs} />
          <InfoCard title={copy.ui.productUseCases} items={product.useCases} />
          <InfoCard title={copy.ui.productMaterials} items={product.materials} />
        </div>
      </Section>
      {product.galleryImages.length > 1 ? (
        <Section>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="shrink-0 text-2xl font-semibold tracking-normal text-white">{copy.ui.productGallery}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-200/35 via-white/10 to-transparent" />
          </div>
          <ProductGallery images={product.galleryImages} closeLabel={copy.ui.close} />
        </Section>
      ) : null}
      <Section>
        <div className="rounded-[2rem] border border-cyan-200/20 bg-cyan-200/[.06] p-8 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">{copy.cta.quote}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{copy.pages.contact.intro}</p>
          <LinkButton href={`${contactPath}?product=${product.id}`} className="mt-6">{copy.cta.similar}</LinkButton>
        </div>
      </Section>
    </>
  );
}

function ProductGallery({ images, closeLabel }: { images: Product["galleryImages"]; closeLabel: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <ProductImageLightbox
          key={image.src}
          src={image.src}
          alt={image.alt}
          closeLabel={closeLabel}
          className="aspect-[4/3] h-auto rounded-[1.25rem] bg-white"
          imageClassName="object-contain"
        />
      ))}
    </div>
  );
}

async function ProductCards({ locale, products, openLabel }: { locale: Locale; products: Product[]; openLabel: string }) {
  const cards = await Promise.all(
    products.map(async (product, index) => ({
      product,
      index,
      href: await getPath(locale, { type: "product", productId: product.id }),
    })),
  );

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ product, index, href }) => (
        <MotionReveal key={product.id} delay={index * 0.04}>
          <Link href={href} className="group block h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.035] transition hover:-translate-y-1 hover:border-cyan-200/40">
            <div className="relative h-56 overflow-hidden">
              <Image src={withBasePath(product.image)} alt={product.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
            </div>
            <div className="p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100">{product.specs[0]}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{product.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{product.short}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">{openLabel} <ArrowRight className="h-4 w-4" /></div>
            </div>
          </Link>
        </MotionReveal>
      ))}
    </div>
  );
}

function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-5 md:gap-5">
      {steps.map((step, index) => (
        <MotionReveal key={step} delay={index * 0.05}>
          <div className="relative h-full">
            <div className="h-full min-h-32 rounded-[1.25rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.025))] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 font-mono text-xs text-cyan-100">
                0{index + 1}
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-7 text-white">{step}</h3>
            </div>
            {index < steps.length - 1 ? (
              <>
                <div className="absolute -right-7 top-1/2 z-10 hidden -translate-y-1/2 md:grid">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-200/25 bg-[#080c11] text-amber-100 shadow-[0_0_28px_rgba(244,195,95,.12)]">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="grid place-items-center py-1 md:hidden">
                  <ArrowRight className="h-5 w-5 rotate-90 text-amber-200" aria-hidden="true" />
                </div>
              </>
            ) : null}
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}

function ApplicationsCapabilities({ content, capabilityTitle }: { content: ContentMessages; capabilityTitle: string }) {
  return (
    <div className="grid gap-12">
      <ApplicationCards applications={content.applications} />
      <div className="border-t border-white/10 pt-8">
        <div className="mb-5 flex items-center gap-4">
          <h3 className="shrink-0 text-2xl font-semibold tracking-[-0.03em] text-white">{capabilityTitle}</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-200/35 via-white/10 to-transparent" />
        </div>
        <div className="mt-5">
          <CapabilityGrid capabilities={content.capabilities} />
        </div>
      </div>
    </div>
  );
}

function ApplicationCards({ applications }: { applications: ContentMessages["applications"] }) {
  const accents = [
    "border-cyan-200/20 bg-cyan-200/10 text-cyan-100",
    "border-amber-200/20 bg-amber-200/10 text-amber-100",
    "border-white/15 bg-white/[.06] text-slate-100",
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {applications.map((application, index) => (
        <MotionReveal key={application.title} delay={index * 0.04}>
          <div className="h-full rounded-[1.25rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,.055),rgba(255,255,255,.018))] p-5 transition hover:border-cyan-200/30 hover:bg-white/[.05]">
            <div className="flex items-start justify-between gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full border ${accents[index % accents.length]}`}>
                <Globe2 className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">{application.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{application.text}</p>
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}

function CapabilityGrid({ capabilities }: { capabilities: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {capabilities.map((item, index) => (
        <MotionReveal key={item} delay={index * 0.035}>
          <div className="flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/[.03] p-4">
            <Cpu className="mt-1 h-5 w-5 shrink-0 text-cyan-200" />
            <span className="text-sm leading-6 text-slate-200">{item}</span>
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}

function AboutFacts({ facts }: { facts: string[] }) {
  return (
    <div className="mt-10 grid gap-3 md:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact} className="h-full rounded-xl border border-white/10 bg-white/[.03] p-4">
          <p className="mt-3 text-sm leading-6 text-slate-300">{fact}</p>
        </div>
      ))}
    </div>
  );
}

function AboutInfoCard({
  accent = "cyan",
  children,
  icon: Icon,
  title,
}: {
  accent?: "amber" | "cyan";
  children: React.ReactNode;
  icon: typeof ShieldCheck;
  title: string;
}) {
  const iconClassName = accent === "amber" ? "text-amber-300" : "text-cyan-200";

  return (
    <div className="h-full rounded-[1.25rem] border border-white/10 bg-white/[.035] p-6 md:p-8">
      <Icon className={`h-8 w-8 ${iconClassName}`} aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[.035] p-6">
      <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-100">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />{item}</div>)}
      </div>
    </div>
  );
}

function LandingList({ title, intro, items }: { title: string; intro: string; items: string[] }) {
  return (
    <article className="h-full rounded-[1.25rem] border border-white/10 bg-white/[.035] p-6">
      <h2 className="text-2xl font-semibold tracking-normal text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{intro}</p>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
            <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FAQ({ copy, faqs }: { copy: SiteMessages; faqs: ContentMessages["faqs"] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading title={copy.faq.title}>{copy.faq.intro}</SectionHeading>
      <div className="grid gap-4">
        {faqs.map((item) => (
          <details key={item.question} className="rounded-[1.5rem] border border-white/10 bg-white/[.035] p-5">
            <summary className="cursor-pointer text-lg font-semibold text-white">{item.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-16 lg:px-8 ${className}`}>{children}</section>;
}
