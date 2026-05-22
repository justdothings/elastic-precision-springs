import type { Metadata } from "next";
import Link from "next/link";
import { company, defaultLocale } from "@/content/site";
import { getMessagesForLocale } from "@/i18n/messages";
import { withBasePath } from "@/lib/base-path";

const defaultLocalePath = `/${defaultLocale}`;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: defaultLocalePath,
  },
};

export default async function RootPage() {
  const copy = (await getMessagesForLocale(defaultLocale)).Site;

  return (
    <main className="grid min-h-screen place-items-center bg-[#05070a] px-6 text-center text-white">
      <meta httpEquiv="refresh" content={`0; url=${withBasePath(defaultLocalePath)}`} />
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">{company.brand}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{copy.ui.rootRedirectTitle}</h1>
        <Link className="mt-8 inline-flex rounded-full border border-cyan-200/40 px-5 py-3 text-cyan-100" href={defaultLocalePath}>
          {copy.ui.rootRedirectLink}
        </Link>
      </div>
    </main>
  );
}
