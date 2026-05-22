import { company, defaultLocale, locales, productCatalog, type Locale, type ProductId, type SectionKey } from "@/content/site";
import { getMessagesForLocale } from "@/i18n/messages";

export type PageDescriptor =
  | { type: "home" }
  | { type: "springManufacturer" }
  | { type: SectionKey }
  | { type: "product"; productId: ProductId };

const springManufacturerPaths: Record<Locale, string> = {
  bg: "proizvoditel-na-pruzhini-plovdiv",
  en: "spring-manufacturer-plovdiv-bulgaria",
  de: "federhersteller-plovdiv-bulgarien",
  it: "produttore-molle-plovdiv-bulgaria",
};

export function isProductId(value: string): value is ProductId {
  return productCatalog.some((product) => product.id === value);
}

export async function getPath(locale: Locale, descriptor: PageDescriptor): Promise<string> {
  const messages = await getMessagesForLocale(locale);
  return getPathFromMessages(locale, descriptor, messages);
}

export function getPathFromMessages(locale: Locale, descriptor: PageDescriptor, messages: Awaited<ReturnType<typeof getMessagesForLocale>>): string {
  const sections = messages.Routes.sections;

  if (descriptor.type === "home") return `/${locale}`;
  if (descriptor.type === "springManufacturer") {
    return `/${locale}/${springManufacturerPaths[locale]}`;
  }
  if (descriptor.type === "product") {
    return `/${locale}/${sections.products}/${messages.Catalog.products[descriptor.productId].slug}`;
  }
  return `/${locale}/${sections[descriptor.type]}`;
}

export async function getAlternateLinks(descriptor: PageDescriptor): Promise<Record<string, string>> {
  const alternates = await Promise.all(
    locales.map(async (locale) => [locale, await getPath(locale, descriptor)] as const),
  );

  return Object.fromEntries(alternates);
}

export async function resolvePath(locale: Locale, slug: string[] = []): Promise<PageDescriptor | null> {
  if (slug.length === 0) return { type: "home" };
  if (slug.length === 1 && springManufacturerPaths[locale] === slug[0]) return { type: "springManufacturer" };

  const messages = await getMessagesForLocale(locale);
  const sectionMatch = (Object.entries(messages.Routes.sections) as [SectionKey, string][]).find(([, value]) => value === slug[0]);
  if (!sectionMatch) return null;

  const [section] = sectionMatch;
  if (section === "products" && slug.length === 2) {
    const product = productCatalog.find((item) => messages.Catalog.products[item.id].slug === slug[1]);
    return product ? { type: "product", productId: product.id } : null;
  }

  if (slug.length === 1) return { type: section };
  return null;
}

export async function getAllStaticParams() {
  const params: { locale: Locale; slug?: string[] }[] = [];

  for (const locale of locales) {
    const messages = await getMessagesForLocale(locale);
    const sections = messages.Routes.sections;

    params.push({ locale, slug: [] });
    (Object.keys(sections) as SectionKey[]).forEach((key) => {
      params.push({ locale, slug: [sections[key]] });
    });
    productCatalog.forEach((product) => {
      params.push({ locale, slug: [sections.products, messages.Catalog.products[product.id].slug] });
    });
    params.push({ locale, slug: [springManufacturerPaths[locale]] });
  }

  return params;
}

export function absoluteUrl(path: string): string {
  const base = company.siteUrl;
  const baseUrl = new URL(base);
  const basePath = baseUrl.pathname.endsWith("/") ? baseUrl.pathname : `${baseUrl.pathname}/`;
  return new URL(path.replace(/^\//, ""), `${baseUrl.origin}${basePath}`).toString();
}

export async function defaultPathFor(descriptor: PageDescriptor) {
  return getPath(defaultLocale, descriptor);
}
