import type { MetadataRoute } from "next";
import { buildProduct, defaultLocale, isLocale } from "@/content/site";
import { getMessagesForLocale } from "@/i18n/messages";
import { absoluteUrl, getAllStaticParams, getAlternateLinks, getPath, resolvePath } from "@/lib/routes";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const { locale, slug = [] } of await getAllStaticParams()) {
    if (!isLocale(locale)) continue;
    const descriptor = await resolvePath(locale, slug);
    if (!descriptor) continue;
    const path = await getPath(locale, descriptor);
    const alternateLinks = await getAlternateLinks(descriptor);
    const languages = Object.fromEntries([
      ...Object.entries(alternateLinks).map(([language, href]) => [language, absoluteUrl(href)]),
      ["x-default", absoluteUrl(await getPath(defaultLocale, descriptor))],
    ]);

    const entry: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: descriptor.type === "home" ? "weekly" : "monthly",
      priority: descriptor.type === "home" ? 1 : descriptor.type === "product" ? 0.85 : 0.75,
      alternates: {
        languages,
      },
    };

    if (descriptor.type === "product") {
      const messages = await getMessagesForLocale(locale);
      const product = buildProduct(messages.Catalog.products, descriptor.productId);
      entry.images = [...new Set(product.galleryImages.slice(0, 3).map((image) => absoluteUrl(image.src)))];
    }

    entries.push(entry);
  }

  entries.push(
    {
      url: absoluteUrl("/llms.txt"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: absoluteUrl("/llms-full.txt"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  );

  return entries;
}
