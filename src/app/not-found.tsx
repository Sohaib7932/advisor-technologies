import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

function rise(delay: number) {
  return { "--rise-delay": `${delay}ms` } as React.CSSProperties;
}

export default function NotFound() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative isolate flex min-h-[40rem] items-center overflow-hidden rounded-[1.75rem] bg-navy-950 sm:rounded-hero lg:min-h-[min(88vh,50rem)]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_85%_60%,rgb(31_107_255/0.3),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(40%_45%_at_5%_0%,rgb(56_189_248/0.16),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_10%,transparent_65%)] bg-size-[22px_22px] opacity-10"
        />
        {/* Ghost numerals behind the copy */}
        <span
          aria-hidden
          style={rise(0)}
          className="hero-rise pointer-events-none absolute -right-6 bottom-0 -z-10 font-display text-[clamp(10rem,32vw,28rem)] leading-[0.8] font-extrabold tracking-[-0.06em] text-white/[0.04] select-none"
        >
          404
        </span>

        <Container className="pt-32 pb-24">
          <p style={rise(80)} className="hero-rise eyebrow text-navy-400">
            Error 404
          </p>
          <h1
            style={rise(180)}
            className="hero-rise mt-6 max-w-3xl text-display text-white"
          >
            This page isn&rsquo;t
            <span className="text-navy-400"> in our catalogue</span>
          </h1>
          <p
            style={rise(300)}
            className="hero-rise mt-7 max-w-md text-base leading-relaxed text-navy-200"
          >
            The page you were looking for has moved or never existed. Try one of
            the sections below.
          </p>

          <div style={rise(400)} className="hero-rise mt-10 flex flex-wrap gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div style={rise(500)} className="hero-rise">
            <Button href="/" variant="light" size="lg" className="mt-10" withArrow>
              Back to home
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
