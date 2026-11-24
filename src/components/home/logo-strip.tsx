import Image from "next/image";
import { Container } from "@/components/ui/container";
import { clients } from "@/lib/content";

const withLogos = clients.filter((c) => c.logo);

/**
 * Real client logos directly under the hero (ref 1): greyscale, drifting in
 * an endless marquee; a logo takes its colour on hover and the strip pauses.
 */
export function LogoStrip() {
  const track = [...withLogos, ...withLogos];
  return (
    <section aria-label="Clients" className="frame py-12 md:py-16">
      <Container>
        <p className="text-center text-sm font-medium text-text-3">
          Supplying <span className="font-semibold text-navy">{clients.length}+ institutional clients</span> across Pakistan
        </p>
      </Container>
      <div data-marquee className="marquee mt-8 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="animate-marquee flex w-max items-center gap-14 md:gap-20">
          {track.map((client, i) => (
            <li key={`${client.name}-${i}`} aria-hidden={i >= withLogos.length || undefined} className="relative h-12 w-28 shrink-0 md:h-14 md:w-32">
              <Image
                src={client.logo!}
                alt={i < withLogos.length ? client.name : ""}
                title={client.name}
                fill
                sizes="128px"
                className="object-contain opacity-60 grayscale transition-[filter,opacity] duration-500 ease-out-expo hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
