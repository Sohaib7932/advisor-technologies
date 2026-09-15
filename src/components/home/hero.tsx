import Image from "next/image";
import { EnquiryBar } from "./enquiry-bar";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate flex min-h-[46rem] flex-col overflow-hidden rounded-[1.75rem] bg-navy-950 sm:min-h-[46rem] sm:rounded-hero lg:min-h-[min(88vh,52rem)]">
        {/* Backdrop */}
        <Image
          src="/images/hero.svg"
          alt="Advisor Technologies head office in Islamabad"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-navy-950/85 via-navy-950/45 to-navy-950/90"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-navy-950/70 to-transparent"
        />

        {/* Content */}
        <div className="relative flex flex-1 flex-col px-5 pt-28 pb-8 sm:px-10 sm:pt-32 sm:pb-10 lg:px-14 lg:pb-12">
          <div className="flex flex-1 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/20 backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-navy-200 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              Islamabad · Serving public &amp; private sector since inception
            </span>

            {/* Oversized wordmark, mirroring the reference hero */}
            <h1 className="mt-7 max-w-[18ch] font-display font-extrabold text-white">
              <span className="sr-only">
                {site.name}. {site.tagline}
              </span>
              <span
                aria-hidden
                className="block text-[clamp(3.25rem,11vw,9rem)] leading-[0.86] tracking-[-0.05em]"
              >
                Advisor
              </span>
              <span
                aria-hidden
                className="mt-2 block text-[clamp(1rem,3.1vw,2.6rem)] leading-none font-semibold tracking-[0.16em] text-white/70 uppercase"
              >
                Technologies
              </span>
            </h1>
          </div>

          {/* Lower band: statement + descriptor, then the enquiry pill */}
          <div className="mt-12 flex flex-col gap-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
              <p className="max-w-md text-xl leading-[1.25] font-medium text-white sm:text-2xl">
                Supply, installation and maintenance
                <span className="text-white/60">
                  {" "}
                  for Pakistan&rsquo;s institutions
                </span>
              </p>
              <p className="max-w-md text-sm leading-relaxed text-white/70 md:justify-self-end">
                Plant &amp; machinery, IT infrastructure, security systems,
                furniture, printing and repair works. Branded equipment backed
                by international standards of after-sales service.
              </p>
            </div>

            <div className="flex justify-center md:justify-start">
              <EnquiryBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
