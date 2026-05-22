import { NextResponse } from "next/server";
import { z } from "zod";

const rfqSchema = z.object({
  locale: z.string().default("bg"),
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

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData
    .getAll("file")
    .filter((value): value is File => value instanceof File && value.size > 0)
    .map((file) => ({ name: file.name, size: file.size, type: file.type }));
  const raw: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (key !== "file" && typeof value === "string") raw[key] = value;
  });

  const parsed = rfqSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    file: files[0] ?? null,
    files,
  };

  const webhookUrl = process.env.RFQ_WEBHOOK_URL;
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, message: "RFQ webhook failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, payload });
}
