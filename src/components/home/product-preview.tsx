import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  productCategories,
  productCategoryDetails,
  products,
} from "@/lib/content";
import { ProductDeck, type DeckCard } from "./product-deck";

/** One deck card per catalogue category, built from the product list. */
const cards: DeckCard[] = productCategories
  .filter((category) => category !== "All")
  .map((category) => ({
    category,
    icon: productCategoryDetails[category].icon,
    image: productCategoryDetails[category].image,
    items: products.filter((product) => product.category === category),
  }));

/**
 * Product line, staged as a dark inset panel: the statement on the left and
 * a fanned deck of catalogue cards on the right that cycles to the front.
 */
export function ProductPreview() {
  return (
    <section id="products" className="px-2 sm:px-3">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#070c16] sm:rounded-hero">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_40%,rgb(42_68_104/0.55),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(35%_45%_at_0%_100%,rgb(31_107_255/0.18),transparent_70%)]"
        />

        <Container className="py-20 md:py-24 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <Eyebrow tone="light">Product line</Eyebrow>
              <h2 className="mt-6 text-headline text-white">
                One supplier across{" "}
                <span className="text-sky-200">{products.length} categories</span> of
                equipment <span className="text-sky-200">and works</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-navy-200">
                A catalogue built for procurement, covering infrastructure, IT
                hardware, connectivity and general order supply from a single
                accountable vendor.
              </p>
              <Button href="/products" variant="light" size="lg" withArrow className="mt-9">
                Browse full catalogue
              </Button>
            </Reveal>

            <Reveal delay={140} className="lg:col-span-7">
              <ProductDeck cards={cards} />
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
