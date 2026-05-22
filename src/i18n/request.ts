import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/i18n/locales";
import { getMessagesForLocale } from "@/i18n/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const candidate = requestedLocale ?? "";
  const locale = isLocale(candidate) ? candidate : defaultLocale;

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});
