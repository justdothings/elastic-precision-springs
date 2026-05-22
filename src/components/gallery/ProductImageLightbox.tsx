"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";

export function ProductImageLightbox({
  src,
  alt,
  closeLabel,
  className,
  imageClassName,
  priority = false,
}: {
  src: string;
  alt: string;
  closeLabel: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const imageSrc = withBasePath(src);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn("group relative h-[420px] w-full cursor-zoom-in overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[.035]", className)}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className={cn("object-cover transition duration-700 group-hover:scale-105", imageClassName)}
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] max-h-[90vh] w-[min(1400px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem]">
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <div className="relative aspect-[4/3]">
            <Image src={imageSrc} alt={alt} fill className="object-contain" sizes="96vw" />
          </div>
          <Dialog.Close
            className="focus-ring absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 p-2 text-white hover:bg-white/10"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
