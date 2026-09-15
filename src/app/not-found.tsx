import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="flex min-h-[38rem] items-center rounded-[1.75rem] bg-navy-950 sm:rounded-hero">
        <Container className="py-24">
          <p className="eyebrow text-navy-400">Error 404</p>
          <h1 className="mt-6 max-w-3xl text-display text-white">
            This page isn&rsquo;t
            <span className="text-navy-400"> in our catalogue</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-navy-200">
            The page you were looking for has moved or never existed. Try one of
            the sections below.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Button href="/" variant="light" size="lg" className="mt-10" withArrow>
            Back to home
          </Button>
        </Container>
      </div>
    </section>
  );
}
