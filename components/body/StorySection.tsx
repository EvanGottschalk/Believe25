import Image from "next/image";
import { SectionShell, Eyebrow } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { LinkCTA } from "@/components/ui/LinkCTA";
import { CONTENT } from "@/config/content";
import { MEDIA } from "@/config/media";
import { imageReveal } from "@/config/motion";
import type { SectionProps } from "@/lib/types";
import { gradientPlaceholder } from "@/lib/utils";

/** Asymmetric editorial split, following the Mejuri "Jewelry You Can Live In" idiom. */
export function StorySection({ standalone = false }: SectionProps) {
  return (
    <SectionShell id="about" standalone={standalone} ground="background">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>{CONTENT.story.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-[12ch] font-display text-display-lg">
            {CONTENT.story.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col justify-center">
          {CONTENT.story.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="mb-5 max-w-prose font-body leading-relaxed text-foreground-muted last:mb-0"
            >
              {paragraph}
            </p>
          ))}
          <div className="mt-4">
            <LinkCTA href={CONTENT.story.cta.href}>{CONTENT.story.cta.label}</LinkCTA>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {MEDIA.story.map((asset, i) => (
          <Reveal key={asset.alt} variants={imageReveal} delay={i * 0.1}>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-surface">
              <Image
                src={asset.src || gradientPlaceholder(asset.alt, asset.width, asset.height)}
                alt={asset.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
