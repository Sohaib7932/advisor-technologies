import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroFacts, PageHero } from "@/components/shared/page-hero";
import { Cta } from "@/components/shared/cta";
import { CatalogueNav } from "@/components/shared/catalogue-nav";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FloodCard } from "@/components/ui/flood-card";
import { ArrowUpRight, Icon } from "@/components/ui/icons";
import {
  clients,
  productCategories,
  productCategoryDetails,
  products,
  services,
  type IconName,
  type Product,
  type ProductCategory,
} from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Plant & machinery, computer systems, servers, networking, satellite communications, printing and multifunction devices, monitors, temporary office setups, web services and general order supplies.",
};

const assurances: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Branded, not generic",
    body: "We act as exclusive territory agents for world-class manufacturers, so what arrives is genuine and warranty-backed.",
    icon: "shield",
  },
  {
    title: "Installed and commissioned",
    body: "Supply is only half the job. Our engineers fix, configure and hand over a working system.",
    icon: "wrench",
  },
  {
    title: "Supported after handover",
    body: "International standards of after-sales service, maintenance visits and spares availability.",
    icon: "handshake",
  },
];

const categoryId = (category: string) =>
  `range-${category.toLowerCase().replace(/[^a-z]+/g, "-")}`;

/** The catalogue grouped by category, in the catalogue's own order. */
const groups = productCategories
  .filter((category): category is ProductCategory => category !== "All")
  .map((category) => ({
    category,
    id: categoryId(category),
    details: productCategoryDetails[category],
    service: services.find(
      (service) => service.id === productCategoryDetails[category].serviceId,
    ),
    items: products.filter((product) => product.category === category),
  }));

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            A catalogue built for
            <span className="text-navy-400"> procurement</span>
          </>
        }
        image="/images/computing-office.png"
        lead={`${products.length} categories spanning infrastructure, IT hardware, connectivity and general order supply, all available on a single purchase order.`}
        aside={
          <HeroFacts
            label="The catalogue"
            facts={[
              { value: `${products.length}+`, label: "Product categories" },
              { value: groups.length, label: "Catalogue groups" },
              { value: services.length, label: "Service divisions" },
              { value: `${clients.length}+`, label: "Institutional clients" },
            ]}
          />
        }
      />

      <Section className="pt-12 md:pt-14 lg:pt-16">
        <Container>
          <CatalogueNav
            items={groups.map((group) => ({
              id: group.id,
              label: group.category,
              icon: group.details.icon,
              count: group.items.length,
            }))}
          />

          <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
            {groups.map((group, groupIndex) => (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`${group.id}-title`}
                className="grid scroll-mt-44 gap-4 lg:grid-cols-12 lg:gap-6"
              >
                {/* Photo panel: stays pinned while the products scroll by */}
                <div className="lg:col-span-5">
                  <Reveal className="lg:sticky lg:top-44">
                    <div className="group/panel relative isolate flex aspect-16/11 flex-col overflow-hidden rounded-panel p-6 text-white shadow-lift sm:p-8 lg:aspect-auto lg:h-[min(34rem,calc(100vh-13rem))]">
                      <Image
                        src={group.details.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="-z-10 object-cover transition-transform duration-1000 ease-out-soft group-hover/panel:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 via-navy-950/55 to-navy-950/15"
                      />

                      <div className="flex items-start justify-between">
                        <span className="grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-md">
                          <Icon name={group.details.icon} className="size-5" />
                        </span>
                        <span className="font-display text-sm font-semibold tracking-widest text-white/75 tabular-nums">
                          {String(groupIndex + 1).padStart(2, "0")} /{" "}
                          {String(groups.length).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <span className="rounded-full bg-white/15 px-3.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase ring-1 ring-white/25 backdrop-blur-md">
                          {group.items.length} product{" "}
                          {group.items.length === 1 ? "line" : "lines"}
                        </span>
                        <h2
                          id={`${group.id}-title`}
                          className="mt-4 font-display text-2xl leading-[1.05] font-semibold sm:text-3xl xl:text-4xl"
                        >
                          {group.category}
                        </h2>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75 sm:text-base">
                          {group.details.blurb}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Products in this group */}
                <ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-7">
                  {group.items.map((product, index) => (
                    <Reveal
                      as="li"
                      key={product.id}
                      delay={Math.min(index * 70, 280)}
                      className={cn(group.items.length === 1 && "sm:col-span-2")}
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        enquiryFor={group.service?.title}
                      />
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* Assurances */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="With every order"
            lead="Supply, installation and support come as one commitment, not three separate purchases."
            title={
              <>
                What comes with{" "}
                <span className="text-navy-500">every order</span>
              </>
            }
          />
          <ul className="mt-14 grid gap-3 md:grid-cols-3 lg:gap-4">
            {assurances.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 90}>
                <FloodCard
                  index={index}
                  icon={item.icon}
                  title={item.title}
                  body={item.body}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Cta
        title="Need a quotation against a BOQ or tender?"
        body="Send the bill of quantities and we will price it line by line, with brand options and delivery timelines."
      />
    </>
  );
}

function ProductCard({
  product,
  index,
  enquiryFor,
}: {
  product: Product;
  index: number;
  /** Service division pre-selected on the enquiry form. */
  enquiryFor?: string;
}) {
  const href = enquiryFor
    ? `/contact?requirement=${encodeURIComponent(enquiryFor)}#enquiry`
    : "/contact#enquiry";

  return (
    <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-card bg-surface p-6 shadow-soft ring-1 ring-navy-900/6 transition-[translate,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift sm:p-7">
      {/* Soft navy wash rising on hover */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-navy-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-navy-950 text-white shadow-soft transition-transform duration-500 ease-out-soft group-hover:-rotate-6">
          <Icon name={product.icon} className="size-5" />
        </span>
        <span
          aria-hidden
          className="font-display text-4xl leading-none font-bold text-navy-900/6 transition-colors duration-500 group-hover:text-navy-600/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-7 font-display text-lg font-semibold text-ink">
        {product.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
        {product.body}
      </p>

      <Link
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-900"
      >
        Enquire about this
        <span className="sr-only">: {product.title}</span>
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-navy-400 to-navy-700 transition-transform duration-700 ease-out-soft group-hover:scale-x-100"
      />
    </div>
  );
}
