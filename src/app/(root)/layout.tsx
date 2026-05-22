import type { Metadata, Viewport } from "next";
import { company, defaultLocale } from "@/content/site";
import { getMessagesForLocale } from "@/i18n/messages";
import "../globals.css";

const siteUrl = company.siteUrl;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessagesForLocale(defaultLocale);
  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    };
  }

  return {
    metadataBase: new URL(siteUrl),
    applicationName: company.brand,
    title: {
      default: `${company.brand} — ${messages.Site.seo.homeTitle}`,
      template: `%s | ${company.brand}`,
    },
    description: messages.Site.seo.homeDescription,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070a",
};

export default function RootRedirectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
