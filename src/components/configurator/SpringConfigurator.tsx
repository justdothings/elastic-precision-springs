"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { SpringKind } from "@/content/site";

const ParametricSpringCanvas = dynamic(() => import("@/components/visuals/ParametricSpringCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(101,216,255,.18),transparent_45%)]" />,
});

type SpringDirection = "left" | "right";
type ExtensionHook = "english" | "german";

export function SpringConfigurator() {
  const tSite = useTranslations("Site");
  const tConfigurator = useTranslations("Configurator");
  const [canvasReady, setCanvasReady] = useState(false);
  const [wire, setWire] = useState(2.2);
  const [diameter, setDiameter] = useState(28);
  const [coils, setCoils] = useState(18);
  const [length, setLength] = useState(82);
  const [type, setType] = useState<SpringKind>("compression");
  const [springDirection, setSpringDirection] = useState<SpringDirection>("right");
  const [extensionHook, setExtensionHook] = useState<ExtensionHook>("english");
  const labels = tConfigurator.raw("controls") as Record<string, string>;
  const springTypes = tConfigurator.raw("types") as { kind: SpringKind; label: string; endLabel: string }[];
  const activeType = springTypes.find((option) => option.kind === type) ?? springTypes[0];
  const extensionHookOptions = [
    { value: "english", label: labels.englishHook },
    { value: "german", label: labels.germanHook },
  ] satisfies { value: ExtensionHook; label: string }[];
  const directionOptions = [
    { value: "left", label: labels.leftHand },
    { value: "right", label: labels.rightHand },
  ] satisfies { value: SpringDirection; label: string }[];
  const extensionHookLabel = extensionHookOptions.find((option) => option.value === extensionHook)?.label ?? labels.englishHook;
  const directionLabel = directionOptions.find((option) => option.value === springDirection)?.label ?? labels.rightHand;
  const endStyleText = type === "extension" ? `${activeType.endLabel} • ${extensionHookLabel} • ${directionLabel}` : `${activeType.endLabel} • ${directionLabel}`;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCanvasReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[.035] p-4 shadow-[inset_0_0_90px_rgba(101,216,255,.07)] lg:grid-cols-[1.25fr_.75fr] lg:p-5">
      <div className="scanline relative h-[360px] min-h-[360px] overflow-hidden rounded-[1.5rem] border border-cyan-200/10 bg-[#050b10] shadow-[0_0_70px_rgba(101,216,255,.12)] cursor-grab active:cursor-grabbing md:h-[460px] md:min-h-[460px] xl:h-[520px] xl:min-h-[520px]">
        {canvasReady ? (
          <ParametricSpringCanvas wire={wire} diameter={diameter} coils={coils} length={length} type={type} extensionHook={extensionHook} springDirection={springDirection} className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(101,216,255,.18),transparent_45%)]" />
        )}
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
          {labels.live}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs text-slate-300 backdrop-blur">
          {labels.drag}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
            Ø {wire.toFixed(1)} mm • {diameter} mm • {coils} {labels.coils.toLowerCase()} • {length} mm
          </div>
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/10 px-4 py-3 text-xs text-cyan-50 backdrop-blur">
            {labels.endStyle}: {endStyleText}
          </div>
        </div>
      </div>
      <div className="grid content-start gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
        <Control label={labels.wire} value={`${wire.toFixed(1)} mm`} min={0.4} max={4.5} step={0.1} valueNumber={wire} onChange={setWire} />
        <Control label={labels.diameter} value={`${diameter} mm`} min={8} max={80} step={1} valueNumber={diameter} onChange={setDiameter} />
        <Control label={labels.coils} value={`${coils}`} min={3} max={18} step={1} valueNumber={coils} onChange={setCoils} />
        <Control label={labels.length} value={`${length} mm`} min={20} max={180} step={1} valueNumber={length} onChange={setLength} />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">{tSite("form.productType")}</label>
          <div className="grid grid-cols-3 gap-2">
            {springTypes.map((option) => (
              <button
                type="button"
                key={option.kind}
                onClick={() => setType(option.kind)}
                className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${type === option.kind ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/10 bg-white/[.04] text-slate-300 hover:border-cyan-200/40 hover:text-white"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {type === "extension" ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">{labels.extensionHook}</label>
            <div className="grid grid-cols-2 gap-2">
              {extensionHookOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setExtensionHook(option.value)}
                  className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${extensionHook === option.value ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/10 bg-white/[.04] text-slate-300 hover:border-cyan-200/40 hover:text-white"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">{labels.torsionHand}</label>
          <div className="grid grid-cols-2 gap-2">
            {directionOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setSpringDirection(option.value)}
                className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${springDirection === option.value ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/10 bg-white/[.04] text-slate-300 hover:border-cyan-200/40 hover:text-white"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm leading-6 text-slate-400">
          {labels.note}
        </div>
      </div>
    </div>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  valueNumber,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  valueNumber: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between gap-4 text-sm font-medium text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-cyan-100">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueNumber}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer accent-cyan-300"
      />
    </label>
  );
}
