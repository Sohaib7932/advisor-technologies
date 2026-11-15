import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
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
 * Product line, staged as a navy inset panel: the statement on the left and
 * a fanned deck of catalogue cards on the right that cycles to the front.
 * The deck (product-deck.tsx) and its animation are unchanged.
 */
export function ProductPreview() {
  return (
    <Section id="products" tone="navy" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[10%] right-[-8%] aspect-square w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(47_92_196/0.45),transparent)]" />
      </div>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Product line</Eyebrow>
            <h2 className="mt-5 text-h2 text-white">
              One supplier across <Accent>{products.length} categories</Accent> of equipment and works
            </h2>
            <p className="mt-6 max-w-md text-lead text-fg-muted">
              A catalogue built for procurement, covering infrastructure, IT hardware, connectivity and general order
              supply from a single accountable vendor.
            </p>
            <Button href="/products" className="mt-9">
              Browse full catalogue
            </Button>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-7">
            <ProductDeck cards={cards} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
