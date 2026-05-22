import type bg from "../../messages/bg.json";
import type { Locale } from "./locales";

export type AppMessages = typeof bg;

const messageLoaders: Record<Locale, () => Promise<AppMessages>> = {
  bg: async () => (await import("../../messages/bg.json")).default,
  en: async () => (await import("../../messages/en.json")).default,
  de: async () => (await import("../../messages/de.json")).default,
  it: async () => (await import("../../messages/it.json")).default,
};

export function getMessagesForLocale(locale: Locale) {
  return messageLoaders[locale]();
}
