import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";

/**
 * Dark banner used at the top of every inner page. It sits under the
 * transparent navbar, so it always provides the contrast the nav needs.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image = "/images/hero-image.png",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  image?: string;
}) {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-950 sm:rounded-hero">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-navy-950 via-navy-950/85 to-navy-900/60"
        />

        <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-display text-white">{title}</h1>
          {lead && (
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg">
              {lead}
            </p>
          )}
        </Container>
      </div>
    </section>
  );
}
