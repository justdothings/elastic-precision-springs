import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildProduct, buildProducts, company, defaultLocale, type CatalogProducts, type Locale, type ProductId } from "@/content/site";
import { absoluteUrl, getAlternateLinks, getPath, type PageDescriptor } from "@/lib/routes";

const localeLanguage: Record<Locale, string> = {
  bg: "bg-BG",
  en: "en",
  de: "de",
  it: "it",
};

async function getSite(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    pages: t.raw("pages") as Record<string, { title: string; intro: string }>,
    seo: t.raw("seo") as { homeTitle: string; homeDescription: string },
    ui: t.raw("ui") as Record<string, string>,
  };
}

async function getCatalogProducts(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Catalog" });
  return t.raw("products") as CatalogProducts;
}

async function pageImage(locale: Locale, descriptor: PageDescriptor) {
  if (descriptor.type === "product") {
    const product = buildProduct(await getCatalogProducts(locale), descriptor.productId);
    return {
      url: absoluteUrl(product.image),
      width: 1200,
      height: 900,
      alt: product.title,
    };
  }

  return {
    url: absoluteUrl("/images/gallery/springs/Compression/compression-spring-assortment-different-sizes.png"),
    width: 1200,
    height: 900,
    alt: await pageTitle(locale, descriptor),
  };
}

export async function pageTitle(locale: Locale, descriptor: PageDescriptor): Promise<string> {
  const site = await getSite(locale);
  if (descriptor.type === "home") return site.seo.homeTitle;
  if (descriptor.type === "product") {
    const products = await getCatalogProducts(locale);
    return products[descriptor.productId].seoTitle;
  }
  return site.pages[descriptor.type].title;
}

export async function pageDescription(locale: Locale, descriptor: PageDescriptor): Promise<string> {
  const site = await getSite(locale);
  if (descriptor.type === "home") return site.seo.homeDescription;
  if (descriptor.type === "product") {
    const products = await getCatalogProducts(locale);
    return products[descriptor.productId].seoDescription;
  }
  return site.pages[descriptor.type].intro;
}

export async function buildMetadata(locale: Locale, descriptor: PageDescriptor): Promise<Metadata> {
  const title = await pageTitle(locale, descriptor);
  const description = await pageDescription(locale, descriptor);
  const path = await getPath(locale, descriptor);
  const alternates = await getAlternateLinks(descriptor);
  const image = await pageImage(locale, descriptor);
  const alternateLocale = Object.keys(alternates)
    .filter((language): language is Locale => language !== locale && language in localeLanguage)
    .map((language) => localeLanguage[language]);

  return {
    title,
    description,
    category: "industrial manufacturing",
    publisher: company.brand,
    creator: company.brand,
    alternates: {
      canonical: path,
      languages: {
        ...alternates,
        "x-default": await getPath(defaultLocale, descriptor),
      },
    },
    openGraph: {
      type: "website",
      locale: localeLanguage[locale],
      alternateLocale,
      url: absoluteUrl(path),
      siteName: company.brand,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    other: {
      "geo.region": "BG",
      "geo.placename": company.city,
      "geo.position": `${company.latitude};${company.longitude}`,
      ICBM: `${company.latitude}, ${company.longitude}`,
      "llms.txt": absoluteUrl("/llms.txt"),
    },
  };
}

export async function organizationSchema(locale: Locale) {
  const content = await getTranslations({ locale, namespace: "Content" });
  const homeUrl = absoluteUrl(await getPath(locale, { type: "home" }));
  const organizationId = `${homeUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": organizationId,
    name: company.brand,
    legalName: company.legalName,
    description: await pageDescription(locale, { type: "home" }),
    url: homeUrl,
    image: [
      absoluteUrl("/images/gallery/springs/Compression/compression-spring-assortment-different-sizes.png"),
      absoluteUrl("/images/gallery/springs/Extension/extension-spring-assortment-hook-loops.png"),
    ],
    email: company.emails,
    telephone: company.phone,
    sameAs: [company.mapUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressCountry: "BG",
      addressLocality: company.city,
      postalCode: "4023",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.latitude,
      longitude: company.longitude,
    },
    openingHours: company.workingHours,
    hasMap: company.mapUrl,
    priceRange: "Custom quotation",
    currenciesAccepted: "BGN, EUR",
    areaServed: [
      { "@type": "Country", name: "Bulgaria" },
      { "@type": "Place", name: "European Union" },
    ],
    knowsLanguage: ["bg", "en", "de", "it"],
    knowsAbout: content.raw("capabilities") as string[],
    contactPoint: company.emails.map((email) => ({
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        telephone: company.phone,
        availableLanguage: ["Bulgarian", "English", "German", "Italian"],
        areaServed: ["BG", "EU"],
      })),
    makesOffer: [
      "technical springs",
      "wire forms",
      "precision turned parts",
      "wire conveyor belts",
    ],
  };
}

export async function websiteSchema(locale: Locale) {
  const homeUrl = absoluteUrl(await getPath(locale, { type: "home" }));

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: company.brand,
    url: homeUrl,
    inLanguage: localeLanguage[locale],
    publisher: { "@id": `${homeUrl}#organization` },
  };
}

export async function webPageSchema(locale: Locale, descriptor: PageDescriptor) {
  const [title, description, path, image] = await Promise.all([
    pageTitle(locale, descriptor),
    pageDescription(locale, descriptor),
    getPath(locale, descriptor),
    pageImage(locale, descriptor),
  ]);
  const url = absoluteUrl(path);
  const type =
    descriptor.type === "contact" || descriptor.type === "contacts"
      ? "ContactPage"
      : descriptor.type === "products"
        ? "CollectionPage"
        : descriptor.type === "about"
          ? "AboutPage"
          : "WebPage";

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: localeLanguage[locale],
    isPartOf: { "@id": `${absoluteUrl(await getPath(locale, { type: "home" }))}#website` },
    about: { "@id": `${absoluteUrl(await getPath(locale, { type: "home" }))}#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image.url,
      caption: image.alt,
    },
  };
}

export async function offerCatalogSchema(locale: Locale) {
  const products = buildProducts(await getCatalogProducts(locale));
  const productsPath = await getPath(locale, { type: "products" });
  const homeUrl = absoluteUrl(await getPath(locale, { type: "home" }));

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${absoluteUrl(productsPath)}#offer-catalog`,
    name: `${company.brand} product and manufacturing capabilities`,
    url: absoluteUrl(productsPath),
    itemListElement: await Promise.all(
      products.map(async (product) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: product.title,
          description: product.description,
          areaServed: ["Bulgaria", "European Union"],
          provider: { "@id": `${homeUrl}#organization` },
          url: absoluteUrl(await getPath(locale, { type: "product", productId: product.id })),
        },
      })),
    ),
  };
}

export async function productSchema(locale: Locale, productId: ProductId) {
  const product = buildProduct(await getCatalogProducts(locale), productId);
  const url = absoluteUrl(await getPath(locale, { type: "product", productId: product.id }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.seoDescription,
    image: absoluteUrl(product.image),
    url,
    inLanguage: localeLanguage[locale],
    brand: { "@type": "Brand", name: company.brand },
    manufacturer: { "@id": `${absoluteUrl(await getPath(locale, { type: "home" }))}#organization` },
    category: "Industrial springs and wire products",
    material: product.materials,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "industrial buyers, engineers, procurement teams, maintenance teams",
    },
    additionalProperty: product.specs.map((value) => ({
      "@type": "PropertyValue",
      name: "Capability",
      value,
    })),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        description: "Quoted by drawing, sample, photo, or technical specification.",
      },
      areaServed: ["Bulgaria", "European Union"],
      url,
    },
  };
}

export async function faqSchema(locale: Locale, descriptor: PageDescriptor = { type: "home" }) {
  const faqs = descriptor.type === "springManufacturer"
    ? ((await getTranslations({ locale, namespace: "Site" })).raw("springManufacturer") as { faqs: { question: string; answer: string }[] }).faqs
    : (await getTranslations({ locale, namespace: "Content" })).raw("faqs") as { question: string; answer: string }[];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export async function breadcrumbSchema(locale: Locale, descriptor: PageDescriptor) {
  const site = await getSite(locale);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: site.ui.homeBreadcrumb,
      item: absoluteUrl(await getPath(locale, { type: "home" })),
    },
  ];

  if (descriptor.type !== "home") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: await pageTitle(locale, descriptor),
      item: absoluteUrl(await getPath(locale, descriptor)),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
