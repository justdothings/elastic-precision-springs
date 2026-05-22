"use client";

import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import type { AppMessages } from "@/i18n/messages";
import { withBasePath } from "@/lib/base-path";

type QuoteInstructions = AppMessages["Site"]["quoteInstructions"];
type QuoteSpec = QuoteInstructions["types"][number];
type QuoteDiagram = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export function QuoteTypeSelector({
  types,
  neededLabel,
  optionalLabel,
}: {
  types: QuoteSpec[];
  neededLabel: string;
  optionalLabel: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="rounded-lg border border-white/10 bg-white/[.035] p-4 md:p-6">
      <div role="tablist" aria-label="Quote specification type" className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {types.map((type, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={type.title}
              id={`quote-type-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`quote-type-panel-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={
                isSelected
                  ? "focus-ring min-w-48 rounded-md border border-cyan-200/60 bg-cyan-300 px-4 py-3 text-left text-sm font-semibold text-slate-950 transition md:min-w-0"
                  : "focus-ring min-w-48 rounded-md border border-white/10 bg-white/[.035] px-4 py-3 text-left text-sm font-semibold text-slate-300 transition hover:border-cyan-200/35 hover:bg-white/[.06] hover:text-white md:min-w-0"
              }
            >
              {type.title}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        {types.map((type, index) => (
          <div
            key={type.title}
            id={`quote-type-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`quote-type-tab-${index}`}
            hidden={selectedIndex !== index}
          >
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{type.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{type.intro}</p>
            <div className={hasDiagram(type) ? "mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]" : "mt-6"}>
              <div className="grid gap-6 lg:grid-cols-2">
                <QuoteSpecList title={neededLabel} items={type.needed} />
                <QuoteSpecList title={optionalLabel} items={type.optional} subdued />
              </div>
              {hasDiagram(type) ? <QuoteDiagramBlock diagram={type.diagram} /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function hasDiagram(spec: QuoteSpec): spec is QuoteSpec & { diagram: QuoteDiagram } {
  return "diagram" in spec;
}

function QuoteDiagramBlock({ diagram }: { diagram: QuoteDiagram }) {
  return (
    <figure className="rounded-md border border-white/10 bg-white p-3">
      <Image
        src={withBasePath(diagram.src)}
        alt={diagram.alt}
        width={diagram.width}
        height={diagram.height}
        sizes="(max-width: 768px) 100vw, 18rem"
        className="h-auto w-full rounded-sm"
      />
      <figcaption className="mt-3 text-xs leading-5 text-slate-700">{diagram.caption}</figcaption>
    </figure>
  );
}

function QuoteSpecList({ title, items, subdued = false }: { title: string; items: string[]; subdued?: boolean }) {
  return (
    <div>
      <h4 className={subdued ? "text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" : "text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200"}>
        {title}
      </h4>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-300">
            <Check className={subdued ? "mt-1 h-3.5 w-3.5 shrink-0 text-slate-500" : "mt-1 h-3.5 w-3.5 shrink-0 text-cyan-200"} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
