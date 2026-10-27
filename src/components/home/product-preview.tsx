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
    <section
      id="products"
      data-tone="charcoal"
      className="relative isolate px-2 py-10 sm:px-3 md:py-16"
    >
      <div data-theme="dark" className="relative isolate overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,#14213a_0%,#121a2b_55%,#1b1f26_100%)] ring-1 ring-white/8 sm:rounded-hero">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_40%,rgb(42_65_97/0.7),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(35%_45%_at_0%_100%,rgb(91_163_208/0.16),transparent_70%)]"
        />

        <Container className="py-20 md:py-24 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Product line</Eyebrow>
              <h2 className="mt-6 text-headline text-white">
                One supplier across{" "}
                <span className="text-accent">{products.length} categories</span> of
                equipment <span className="text-accent">and works</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted">
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
