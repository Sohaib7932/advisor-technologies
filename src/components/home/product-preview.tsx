import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { products } from "@/lib/content";

export function ProductPreview() {
  const featured = products.slice(0, 8);

  return (
    <Section id="products">
      <Container>
        <SectionHeading
          eyebrow="Product line"
          lead="A catalogue built for procurement, covering infrastructure, IT hardware, connectivity and general order supply from a single accountable vendor."
          title={
            <>
              One supplier across{" "}
              <span className="text-navy-500">{products.length} categories</span>{" "}
              of equipment and works
            </>
          }
          action={
            <Button href="/products" variant="secondary" withArrow>
              Browse full catalogue
            </Button>
          }
        />

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal
              as="li"
              key={product.id}
              delay={(index % 4) * 60}
              className="group relative flex flex-col rounded-card bg-surface p-6 shadow-soft ring-1 ring-navy-900/6 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600 transition-colors duration-300 group-hover:bg-navy-600 group-hover:text-white">
                <Icon name={product.icon} className="size-5" />
              </span>
              <span className="eyebrow mt-5 text-graphite-400">
                {product.category}
              </span>
              <h3 className="mt-2 font-display text-lg leading-snug font-semibold text-ink">
                {product.title}
              </h3>
              <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-graphite-600">
                {product.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
