export const locales = ["bg", "en", "de", "it"] as const;

export type Locale = (typeof locales)[number];
export type Localized<T = string> = Record<Locale, T>;

export const defaultLocale: Locale = "bg";

export const localeNames: Localized = {
  bg: "Български",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
};

export const localeFlags: Localized = {
  bg: "🇧🇬",
  en: "🇬🇧",
  de: "🇩🇪",
  it: "🇮🇹",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
