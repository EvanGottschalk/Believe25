import { SectionShell } from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";
import { CONTENT } from "@/config/content";

export default function NotFound() {
  return (
    <SectionShell standalone ground="background">
      <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
        <span aria-hidden className="font-display text-display-xl text-primary-soft">
          404
        </span>
        <h1 className="mt-4 font-display text-display-md">{CONTENT.notFound.heading}</h1>
        <p className="mt-4 font-body text-foreground-muted">{CONTENT.notFound.body}</p>
        <Button href={CONTENT.notFound.cta.href} variant="primary" size="lg" className="mt-9">
          {CONTENT.notFound.cta.label}
        </Button>
      </div>
    </SectionShell>
  );
}
