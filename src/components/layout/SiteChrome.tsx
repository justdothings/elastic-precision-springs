import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, localeFlags, localeNames, locales, type Locale } from "@/content/site";
import { getAlternateLinks, getPath, type PageDescriptor } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { LinkButton } from "@/components/ui/Button";

const nav = ["home", "products", "applications", "about", "contacts"] as const;
const mobileNav = [...nav, "contact"] as const;

export async function Header({ locale, descriptor }: { locale: Locale; descriptor: PageDescriptor }) {
  const t = await getTranslations({ locale, namespace: "Site" });
  const navLabels = t.raw("nav") as Record<(typeof mobileNav)[number], string>;
  const ui = t.raw("ui") as Record<string, string>;
  const alternates = await getAlternateLinks(descriptor);
  const availableLocales = locales.filter((item) => alternates[item]);
  const homePath = await getPath(locale, { type: "home" });
  const contactPath = await getPath(locale, { type: "contact" });
  const navPaths = Object.fromEntries(await Promise.all(nav.map(async (key) => [key, await getPath(locale, { type: key })] as const)));
  const mobileNavPaths = Object.fromEntries(await Promise.all(mobileNav.map(async (key) => [key, await getPath(locale, { type: key })] as const)));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070a]/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href={homePath} className="focus-ring group flex items-center gap-1 rounded-full">
          <Image src={withBasePath("/logo.png")} alt="Stevini logo" width={40} height={40} className="rounded-full" />
          <span className="leading-none">
            <span className="block text-sm font-semibold tracking-[0.24em] text-white">STEVINI</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-200/70">{ui.brandKicker}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={ui.primaryNavigation}>
          {nav.map((key) => (
            <Link
              key={key}
              href={navPaths[key]}
              className={cn(
                "focus-ring rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[.06] hover:text-white",
                (descriptor.type === key || (descriptor.type === "capabilities" && key === "applications")) && "bg-white/[.08] text-white",
              )}
            >
              {navLabels[key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="group relative">
            <button className="focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-200/40 hover:bg-white/[.07] hover:text-white">
              <span className="text-sm" aria-hidden="true">{localeFlags[locale]}</span>
              <span>{locale.toUpperCase()}</span>
            </button>
            <div className="invisible absolute right-0 top-full w-44 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-[#0b1016] p-2 shadow-2xl">
                {availableLocales.map((item) => (
                  <Link key={item} href={alternates[item]} className="focus-ring flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/[.06] hover:text-white">
                    <span className="text-base" aria-hidden="true">{localeFlags[item]}</span>
                    <span>{localeNames[item]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <LinkButton href={contactPath} className="px-4 py-2 text-sm font-medium shadow-none">{navLabels.contact}</LinkButton>
        </div>

        <details className="group lg:hidden">
          <summary className="focus-ring list-none rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm font-semibold text-white">
            {ui.menu}
          </summary>
          <div className="absolute left-4 right-4 top-[4.5rem] rounded-3xl border border-white/10 bg-[#0b1016] p-3 shadow-2xl">
            {mobileNav.map((key) => (
              <Link key={key} href={mobileNavPaths[key]} className="block rounded-2xl px-4 py-3 text-slate-200 hover:bg-white/[.06]">
                {navLabels[key]}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              {availableLocales.map((item) => (
                <Link key={item} href={alternates[item]} className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  <span aria-hidden="true">{localeFlags[item]}</span>
                  <span>{item.toUpperCase()}</span>
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Site" });
  const navLabels = t.raw("nav") as Record<string, string>;
  const cta = t.raw("cta") as Record<string, string>;
  const pages = t.raw("pages") as Record<string, { title: string; intro: string }>;
  const productsPath = await getPath(locale, { type: "products" });
  const applicationsPath = await getPath(locale, { type: "applications" });
  const aboutPath = await getPath(locale, { type: "about" });
  const contactsPath = await getPath(locale, { type: "contacts" });
  const contactPath = await getPath(locale, { type: "contact" });
  const springManufacturerPath = await getPath(locale, { type: "springManufacturer" });
  const privacyPath = await getPath(locale, { type: "privacy" });
  const termsPath = await getPath(locale, { type: "terms" });

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="text-lg font-semibold tracking-[0.2em] text-white">{company.brand.toUpperCase()}</div>
          <Link href={springManufacturerPath} className="mt-3 block text-sm font-medium text-slate-200 transition hover:text-white">
            {t("ui.localBusinessLine")}
          </Link>
          <div className="mt-5 grid gap-2 text-sm text-slate-300">
            <a
              href={company.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <MapPin className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
              <span>{company.address}</span>
            </a>
            <a href={company.emailHref} className="flex items-start gap-2 transition hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
              <span className="min-w-0 break-words">{company.emailList}</span>
            </a>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
              <span>{company.phone}</span>
            </a>
            <p>{t("ui.workingHours")}: {company.workingHours}</p>
          </div>
        </div>
        <div>
          <div className="grid gap-2 text-sm text-slate-400">
            <Link href={productsPath}>{navLabels.products}</Link>
            <Link href={applicationsPath}>{navLabels.applications}</Link>
            <Link href={aboutPath}>{navLabels.about}</Link>
            <Link href={contactsPath}>{navLabels.contacts}</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">{navLabels.contact}</h3>
          <LinkButton href={contactPath} className="mt-5" variant="secondary">
            {cta.quote}
          </LinkButton>
          <div className="mt-5 flex gap-4 text-xs text-slate-500">
            <Link href={privacyPath}>{pages.privacy.title}</Link>
            <Link href={termsPath}>{pages.terms.title}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
