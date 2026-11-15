import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Accent } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404"
      render="banner-404"
      watermark="404"
      title={
        <>
          This page isn&rsquo;t <Accent>in our catalogue</Accent>
        </>
      }
      lead="The page you were looking for has moved or never existed. Try one of the sections below."
    >
      <ul className="flex flex-wrap gap-2">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition-colors duration-300 hover:bg-white hover:text-navy"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Button href="/" className="mt-8">
        Back to home
      </Button>
    </PageHero>
  );
}
