"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";
import { company, localeFlags, localeNames, productCatalog, type ProductId, type Locale } from "@/content/site";
import { withBasePath } from "@/lib/base-path";
import { Button } from "@/components/ui/Button";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const rfqSchema = z.object({
  productType: z.string().min(1),
  quantity: z.string().optional(),
  wireDiameter: z.string().optional(),
  outerDiameter: z.string().optional(),
  windingDirection: z.string().optional(),
  lengthWidth: z.string().optional(),
  material: z.string().optional(),
  application: z.string().min(4),
  companyName: z.string().min(2),
  country: z.string().min(2),
  contactName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredLanguage: z.string().min(2),
  message: z.string().optional(),
  consent: z.literal("true"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof rfqSchema>, string>>;

export function RFQForm({ locale }: { locale: Locale }) {
  const tSite = useTranslations("Site");
  const tCatalog = useTranslations("Catalog");
  const formCopy = tSite.raw("form") as Record<string, string>;
  const placeholders = tSite.raw("formPlaceholders") as Record<string, string>;
  const ui = tSite.raw("ui") as Record<string, string>;
  const cta = tSite.raw("cta") as Record<string, string>;
  const pages = tSite.raw("pages") as Record<string, { intro: string }>;
  const productCopy = tCatalog.raw("products") as Record<ProductId, { title: string }>;
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("locale", locale);
    formData.set("consent", formData.get("consent") === "on" ? "true" : "false");

    const raw = Object.fromEntries(Array.from(formData.entries()).filter(([key]) => key !== "file"));
    const parsed = rfqSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] ?? ui.formRequired])) as FormErrors);
      setStatus("error");
      return;
    }

    if (isStaticExport) {
      const body = Array.from(formData.entries())
        .map(([key, value]) => `${key}: ${value instanceof File ? value.name : value}`)
        .join("\n");
      window.location.href = `${company.emailHref}?subject=${encodeURIComponent(`${formCopy.mailSubject ?? "RFQ request"} - ${company.brand}`)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
      return;
    }

    const response = await fetch(withBasePath("/api/rfq"), { method: "POST", body: formData });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[.035] p-5 shadow-[inset_0_0_80px_rgba(101,216,255,.06)] md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={formCopy.productType} error={errors.productType}>
          <select name="productType" defaultValue={initialProduct} required className="field">
            <option value="">-</option>
            {productCatalog.map((product) => (
              <option key={product.id} value={product.id}>{productCopy[product.id].title}</option>
            ))}
          </select>
        </Field>
        <Field label={formCopy.quantity}><input name="quantity" className="field" placeholder={placeholders.quantity} /></Field>
        <Field label={formCopy.wireDiameter}><input name="wireDiameter" className="field" placeholder={placeholders.wireDiameter} /></Field>
        <Field label={formCopy.outerDiameter}><input name="outerDiameter" className="field" placeholder={placeholders.outerDiameter} /></Field>
        <Field label={formCopy.windingDirection}>
          <select name="windingDirection" defaultValue="" className="field">
            <option value="">{formCopy.windingDirectionUnspecified}</option>
            <option value="left">{formCopy.windingDirectionLeft}</option>
            <option value="right">{formCopy.windingDirectionRight}</option>
          </select>
        </Field>
        <Field label={formCopy.lengthWidth}><input name="lengthWidth" className="field" placeholder={placeholders.lengthWidth} /></Field>
        <Field label={formCopy.material}><input name="material" className="field" placeholder={placeholders.material} /></Field>
        <Field label={formCopy.application} error={errors.application} full>
          <textarea name="application" rows={3} className="field" placeholder={placeholders.application} required />
        </Field>
        <Field label={formCopy.company} error={errors.companyName}><input name="companyName" className="field" required /></Field>
        <Field label={formCopy.country} error={errors.country}><input name="country" className="field" required /></Field>
        <Field label={formCopy.contactName}><input name="contactName" className="field" /></Field>
        <Field label={formCopy.email} error={errors.email}><input name="email" type="email" className="field" required /></Field>
        <Field label={formCopy.phone}><input name="phone" className="field" /></Field>
        <Field label={formCopy.language} error={errors.preferredLanguage}>
          <select name="preferredLanguage" defaultValue={locale} className="field">
            {Object.entries(localeNames).map(([key, value]) => <option key={key} value={key}>{localeFlags[key as Locale]} {value}</option>)}
          </select>
        </Field>
        <Field label={formCopy.file}>
          <input name="file" type="file" multiple className="field file:mr-4 file:rounded-full file:border-0 file:bg-cyan-200 file:px-4 file:py-2 file:text-slate-950" accept=".pdf,.jpg,.jpeg,.png,.zip" />
        </Field>
        <Field label={formCopy.message} full>
          <textarea name="message" rows={5} className="field" placeholder={pages.contact.intro} />
        </Field>
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm leading-6 text-slate-300">
        <input name="consent" type="checkbox" className="mt-1 accent-cyan-300" required />
        <span>
          {formCopy.consent}
          {errors.consent ? <span className="mt-1 block text-red-200">{errors.consent}</span> : null}
        </span>
      </label>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-400">{cta.upload}</p>
        <Button disabled={status === "loading"} className="min-w-48">
          {status === "loading" ? ui.formLoading : formCopy.submit}
        </Button>
      </div>
      {status === "success" ? <p className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{formCopy.success}</p> : null}
      {status === "error" ? <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">{formCopy.error}</p> : null}
      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
        }
        .field:focus {
          border-color: rgba(101, 216, 255, 0.65);
          box-shadow: 0 0 0 3px rgba(101, 216, 255, 0.12);
        }
        option { color: #0f172a; }
      `}</style>
    </form>
  );
}

function Field({ label, children, error, full = false }: { label: string; children: React.ReactNode; error?: string; full?: boolean }) {
  return (
    <label className={full ? "block md:col-span-2" : "block"}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red-200">{error}</span> : null}
    </label>
  );
}
