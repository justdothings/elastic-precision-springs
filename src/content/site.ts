import type { AppMessages } from "@/i18n/messages";

const defaultCompanyEmails = ["stevini@abv.bg", "stevinisprings@gmail.com"];
const configuredCompanyEmails = process.env.NEXT_PUBLIC_COMPANY_EMAILS?.split(",")
  .map((email) => email.trim())
  .filter(Boolean);
const companyEmails = configuredCompanyEmails?.length
  ? configuredCompanyEmails
  : Array.from(new Set([process.env.NEXT_PUBLIC_COMPANY_EMAIL?.trim() || defaultCompanyEmails[0], defaultCompanyEmails[1]]));

export {
  defaultLocale,
  isLocale,
  localeFlags,
  localeNames,
  locales,
  type Locale,
  type Localized,
} from "@/i18n/locales";

export const company = {
  brand: "Stevini Springs",
  legalName: "Stevini",
  claim: "Ø0.2–4.5 mm",
  email: companyEmails[0],
  emails: companyEmails,
  emailList: companyEmails.join(", "),
  emailHref: `mailto:${companyEmails.join(",")}`,
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+359 88 883 7305",
  country: "Bulgaria",
  city: process.env.NEXT_PUBLIC_COMPANY_CITY ?? "Plovdiv",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? 'ЕТ "СТЕВИНИ", ET "STEVINI", 277-В, жк. Тракия 277В, 4023 Plovdiv, Bulgaria',
  latitude: process.env.NEXT_PUBLIC_COMPANY_LATITUDE ?? "42.1461372",
  longitude: process.env.NEXT_PUBLIC_COMPANY_LONGITUDE ?? "24.7997916",
  workingHours: process.env.NEXT_PUBLIC_COMPANY_WORKING_HOURS ?? "09:00-19:00",
  mapUrl: process.env.NEXT_PUBLIC_COMPANY_MAP_URL ?? 'https://www.google.com/maps/place/%D0%95%D0%A2+%22%D0%A1%D0%A2%D0%95%D0%92%D0%98%D0%9D%D0%98%22,+ET+%22STEVINI%22/@42.1461372,24.7972167,17z/data=!3m1!4b1!4m6!3m5!1s0x14acd14f0500ddcf:0x61d0d5ce798c6268!8m2!3d42.1461372!4d24.7997916!16s%2Fg%2F11c5_t5n2g?entry=ttu',
  mapEmbedUrl: process.env.NEXT_PUBLIC_COMPANY_MAP_EMBED_URL ?? "https://maps.google.com/maps?cid=7048368499614048872&ll=42.1461372,24.7997916&z=17&output=embed",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stevini.org",
};

export type SectionKey =
  | "products"
  | "applications"
  | "capabilities"
  | "about"
  | "contacts"
  | "contact"
  | "privacy"
  | "terms";

export type SpringKind = "compression" | "extension" | "torsion";

export type ProductGalleryImage = {
  src: string;
  alt: string;
};

const compressionSpringImages = [
  {
    src: "/images/gallery/springs/Compression/compression-spring-assortment-different-sizes.png",
    alt: "Compression spring assortment in different wire sizes",
  },
  {
    src: "/images/gallery/springs/Compression/mixed-industrial-compression-springs.png",
    alt: "Mixed industrial compression springs in steel and coated finishes",
  },
  {
    src: "/images/gallery/springs/Compression/upright-stainless-compression-springs.jpg",
    alt: "Upright stainless steel compression springs",
  },
  {
    src: "/images/gallery/springs/Compression/single-zinc-plated-compression-spring.jpg",
    alt: "Single zinc plated compression spring",
  },
  {
    src: "/images/gallery/springs/Compression/single-polished-compression-spring.png",
    alt: "Single polished compression spring close up",
  },
  {
    src: "/images/gallery/springs/Compression/large-polished-compression-spring-pair.png",
    alt: "Large polished compression spring pair",
  },
] satisfies ProductGalleryImage[];

const extensionSpringImages = [
  {
    src: "/images/gallery/springs/Extension/extension-spring-assortment-hook-loops.png",
    alt: "Extension spring assortment with hooks and loop ends",
  },
  {
    src: "/images/gallery/springs/Extension/extension-spring-product-assortment-grid.png",
    alt: "Product grid of extension springs with different hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/assorted-extension-springs-loop-ends.jpg",
    alt: "Assorted extension springs with loop ends",
  },
  {
    src: "/images/gallery/springs/Extension/stainless-extension-springs-various-sizes.jpg",
    alt: "Stainless extension springs in various sizes",
  },
  {
    src: "/images/gallery/springs/Extension/extension-springs-mixed-metal-hook-ends.jpg",
    alt: "Mixed metal extension springs with hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/extension-springs-open-hook-ends.jpg",
    alt: "Extension springs with open hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/extension-springs-open-loop-hook-ends.jpg",
    alt: "Extension springs with open loop hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/short-extension-springs-oval-loop-ends.jpg",
    alt: "Short extension springs with oval loop ends",
  },
  {
    src: "/images/gallery/springs/Extension/short-extension-spring-pair-round-loops.jpg",
    alt: "Short extension spring pair with round loops",
  },
  {
    src: "/images/gallery/springs/Extension/small-extension-springs-loop-and-pin-ends.jpg",
    alt: "Small extension springs with loop and pin ends",
  },
  {
    src: "/images/gallery/springs/Extension/silver-extension-spring-pair-loop-ends.jpg",
    alt: "Silver extension spring pair with loop ends",
  },
  {
    src: "/images/gallery/springs/Extension/single-extension-spring-round-loop-end.jpg",
    alt: "Single extension spring with round loop end",
  },
  {
    src: "/images/gallery/springs/Extension/compact-extension-spring-round-loops.jpg",
    alt: "Compact extension spring with round loops",
  },
  {
    src: "/images/gallery/springs/Extension/long-silver-extension-spring-loop-hook.jpg",
    alt: "Long silver extension spring with loop hook",
  },
  {
    src: "/images/gallery/springs/Extension/long-extension-spring-loop-ends.jpg",
    alt: "Long extension spring with loop ends",
  },
  {
    src: "/images/gallery/springs/Extension/long-extension-spring-open-hook-ends.png",
    alt: "Long extension spring with open hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/gold-plated-extension-spring-long-hook.png",
    alt: "Gold plated extension spring with long hook",
  },
  {
    src: "/images/gallery/springs/Extension/heavy-duty-extension-spring-open-hooks.png",
    alt: "Heavy duty extension spring with open hooks",
  },
  {
    src: "/images/gallery/springs/Extension/large-extension-springs-round-hook-ends.avif",
    alt: "Large extension springs with round hook ends",
  },
  {
    src: "/images/gallery/springs/Extension/black-extension-spring-open-hooks.jpg",
    alt: "Black extension spring with open hooks",
  },
  {
    src: "/images/gallery/springs/Extension/linked-extension-springs-with-rings.jpg",
    alt: "Linked extension springs connected with rings",
  },
  {
    src: "/images/gallery/springs/Extension/extension-spring-pair-side-loop-hooks.jpg",
    alt: "Extension spring pair with side loop hooks",
  },
] satisfies ProductGalleryImage[];

const torsionSpringImages = [
  {
    src: "/images/gallery/springs/Torsion/assorted-torsion-springs-and-wire-forms.jpg",
    alt: "Assorted torsion springs and custom wire forms",
  },
  {
    src: "/images/gallery/springs/Torsion/black-torsion-springs-assorted-legs.jpg",
    alt: "Black torsion springs with assorted leg forms",
  },
  {
    src: "/images/gallery/springs/Torsion/large-torsion-spring-pair-u-shaped-legs.jpg",
    alt: "Large torsion spring pair with U shaped legs",
  },
  {
    src: "/images/gallery/springs/Torsion/torsion-spring-square-bent-arms.jpg",
    alt: "Torsion spring with square bent arms",
  },
  {
    src: "/images/gallery/springs/Torsion/small-black-torsion-springs-bent-legs.jpg",
    alt: "Small black torsion springs with bent legs",
  },
  {
    src: "/images/gallery/springs/Torsion/small-torsion-spring-pair-straight-legs.jpg",
    alt: "Small torsion spring pair with straight legs",
  },
  {
    src: "/images/gallery/springs/Torsion/custom-torsion-spring-assortment.png",
    alt: "Custom torsion spring assortment with varied leg geometry",
  },
  {
    src: "/images/gallery/springs/Torsion/torsion-spring-long-straight-leg.png",
    alt: "Torsion spring with long straight leg",
  },
  {
    src: "/images/gallery/springs/Torsion/custom-torsion-spring-long-straight-leg.png",
    alt: "Custom torsion spring with long straight leg",
  },
  {
    src: "/images/gallery/springs/Torsion/blue-zinc-torsion-spring-pair.png",
    alt: "Blue zinc plated torsion spring pair",
  },
  {
    src: "/images/gallery/springs/Torsion/blue-zinc-torsion-spring-straight-legs.png",
    alt: "Blue zinc plated torsion spring with straight legs",
  },
  {
    src: "/images/gallery/springs/Torsion/torsion-spring-pair-right-angle-legs.png",
    alt: "Torsion spring pair with right angle legs",
  },
  {
    src: "/images/gallery/springs/Torsion/long-torsion-springs-parallel-bent-legs.png",
    alt: "Long torsion springs with parallel bent legs",
  },
  {
    src: "/images/gallery/springs/Torsion/black-torsion-spring-long-bent-leg.png",
    alt: "Black torsion spring with long bent leg",
  },
  {
    src: "/images/gallery/springs/Torsion/black-torsion-spring-hooked-leg.png",
    alt: "Black torsion spring with hooked leg",
  },
  {
    src: "/images/gallery/springs/Torsion/single-torsion-spring-angled-legs.png",
    alt: "Single torsion spring with angled legs",
  },
  {
    src: "/images/gallery/springs/Torsion/polished-torsion-spring-close-up.png",
    alt: "Polished torsion spring close up",
  },
] satisfies ProductGalleryImage[];

const wireFormImages = [
  {
    src: "/images/gallery/springs/Wire-Forms/wire-form-assortment.jpg",
    alt: "Assortment of custom wire forms and shaped clips",
  },
  {
    src: "/images/gallery/springs/Wire-Forms/black-wire-form-spring-clips.jpg",
    alt: "Black wire form spring clips with shaped bends",
  },
] satisfies ProductGalleryImage[];

const precisionTurnedPartImages = [
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-component-assortment.png",
    alt: "Assortment of precision turned metal components",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/lathe-thread-cutting-close-up.png",
    alt: "Thread cutting operation on a turned metal part",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-grooved-bushings.png",
    alt: "Precision turned grooved bushings",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-flanged-pins.png",
    alt: "Precision turned flanged pins",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/high-precision-metric-dowel-pins.avif",
    alt: "High precision metric dowel pins",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-flanged-bushings.jpg",
    alt: "Precision turned flanged bushings",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-bushing-assortment.webp",
    alt: "Assortment of precision turned bushings",
  },
  {
    src: "/images/gallery/springs/Precision-Turned-Parts/precision-turned-stepped-pins.png",
    alt: "Precision turned stepped pins",
  },
] satisfies ProductGalleryImage[];

const wireConveyorBeltImages = [
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/chain-driven-wire-conveyor-belt.jpg",
    alt: "Chain driven wire conveyor belt close up",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/heat-resistant-wire-mesh-conveyor-belt.webp",
    alt: "Heat resistant wire mesh conveyor belt",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/rounded-edge-balanced-weave-wire-conveyor-belt.png",
    alt: "Rounded edge balanced weave wire conveyor belt close up",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/open-grid-spring-rod-wire-conveyor-belt-with-side-bars.png",
    alt: "Open grid spring rod wire conveyor belt with side bars",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/spring-rod-wire-conveyor-belt-grid-detail.png",
    alt: "Spring rod wire conveyor belt grid detail",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/stainless-steel-balanced-weave-wire-mesh-belt.png",
    alt: "Stainless steel balanced weave wire mesh belt",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/dense-balanced-weave-wire-mesh-conveyor-belt.png",
    alt: "Dense balanced weave wire mesh conveyor belt",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/side-bar-spring-rod-wire-conveyor-belt-detail.png",
    alt: "Side bar spring rod wire conveyor belt detail",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/open-grid-spring-rod-wire-conveyor-belt-close-up.png",
    alt: "Open grid spring rod wire conveyor belt close up",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/rolled-open-grid-spring-rod-wire-conveyor-belt.png",
    alt: "Rolled open grid spring rod wire conveyor belt",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/open-grid-wire-conveyor-belt-with-button-rod-edge.png",
    alt: "Open grid wire conveyor belt with button rod edge",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/balanced-weave-wire-mesh-conveyor-belt-close-up.png",
    alt: "Balanced weave wire mesh conveyor belt close up",
  },
  {
    src: "/images/gallery/springs/Wire-Conveyor-Belt/balanced-weave-wire-conveyor-belt-with-ball-edge.png",
    alt: "Balanced weave wire conveyor belt with ball edge",
  },
] satisfies ProductGalleryImage[];

export const productCatalog = [
  {
    id: "compression-springs",
    image: compressionSpringImages[0].src,
    galleryImages: compressionSpringImages,
    filters: ["compression"],
  },
  {
    id: "extension-springs",
    image: extensionSpringImages[0].src,
    galleryImages: extensionSpringImages,
    filters: ["extension"],
  },
  {
    id: "torsion-springs",
    image: torsionSpringImages[0].src,
    galleryImages: torsionSpringImages,
    filters: ["torsion", "automation"],
  },
  {
    id: "wire-forms",
    image: wireFormImages[0].src,
    galleryImages: wireFormImages,
    filters: ["wire-forms"],
  },
  {
    id: "automatic-parts",
    image: precisionTurnedPartImages[0].src,
    galleryImages: precisionTurnedPartImages,
    filters: ["automatic-parts"],
  },
  {
    id: "spring-conveyor-belts",
    image: wireConveyorBeltImages[0].src,
    galleryImages: wireConveyorBeltImages,
    filters: ["conveyor-belts"],
  },
] as const;

export type ProductId = (typeof productCatalog)[number]["id"];
export type CatalogProducts = AppMessages["Catalog"]["products"];
export type ProductContent = CatalogProducts[ProductId];
export type Product = ProductContent & {
  id: ProductId;
  image: string;
  galleryImages: ProductGalleryImage[];
  filters: string[];
};

export function buildProducts(catalogProducts: CatalogProducts): Product[] {
  return productCatalog.map((product) => ({
    ...catalogProducts[product.id],
    id: product.id,
    image: product.image,
    galleryImages: product.galleryImages.map((image) => ({ ...image })),
    filters: [...product.filters],
  }));
}

export function buildProduct(catalogProducts: CatalogProducts, productId: ProductId): Product {
  const meta = productCatalog.find((product) => product.id === productId);
  if (!meta) throw new Error(`Unknown product id: ${productId}`);

  return {
    ...catalogProducts[productId],
    id: meta.id,
    image: meta.image,
    galleryImages: meta.galleryImages.map((image) => ({ ...image })),
    filters: [...meta.filters],
  };
}

export const glossary = [
  ["натискова пружина", "compression spring", "Druckfeder", "molla a compressione"],
  ["опънова пружина", "extension spring", "Zugfeder", "molla a trazione"],
  ["торсионна пружина", "torsion spring", "Schenkelfeder / Torsionsfeder", "molla a torsione"],
  ["огъвка от тел", "wire form", "Drahtbiegeteil", "elemento piegato in filo"],
  ["автоматен детайл", "precision turned part", "Präzisionsdrehteil / Automatendrehteil", "particolare tornito di precisione"],
  ["пружинна транспортна лента", "wire conveyor belt", "Drahtförderband / Federförderband", "nastro trasportatore a rete metallica"],
  ["тел Ø0.2–4.5 mm", "wire Ø0.2–4.5 mm", "Draht Ø0,2–4,5 mm", "filo Ø0,2–4,5 mm"],
] as const;
