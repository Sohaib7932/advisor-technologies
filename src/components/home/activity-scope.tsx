import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Icon } from "@/components/ui/icons";
import { Render3D } from "@/components/three/render-3d";
import type { RenderName } from "@/components/three/renders";
import { services } from "@/lib/content";
import { RouteSteps } from "./route-steps";

/** Specialist fields, from the company profile (objectiveParagraphs). */
const FIELDS = ["Plant & machinery", "Civil engineering", "Mechanical engineering", "Software", "Communications"];

/** The product render that stands for each division. */
export const DIVISION_RENDER: Record<string, RenderName> = {
  "plant-machinery": "product-chair",
  "it-networks": "product-rack",
  computing: "product-laptop",
  "security-systems": "product-cctv",
  printing: "product-printer",
  maintenance: "product-gear",
};

/**
 * The six divisions in ref 1's "Everything you need" layout: a sticky
 * statement on the left, a list of rows on the right. Hovering (or focusing)
 * a row opens it to show the division's checklist and its 3D render; on
 * touch screens every row is open. Each row links to its division.
 */
export function ActivityScope() {
  return (
    <Section id="activity-scope" tone="mist" aria-labelledby="activity-scope-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-28">
              <Eyebrow>Activity scope</Eyebrow>
              <h2 id="activity-scope-title" className="mt-5 text-h2 text-fg">
                Six divisions, <Accent>one contract</Accent>
              </h2>
              <p className="mt-6 max-w-md text-lead text-fg-muted">
                A single purchase order can cover equipment, installation and the years of service that follow.
              </p>

              {/* One contract, three stages (company profile: complete solutions) */}
              <RouteSteps />

              {/* Specialist fields of the team (company profile) */}
              <p className="mt-8 text-xs font-semibold tracking-[0.08em] text-text-3 uppercase">Qualified specialists in</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {FIELDS.map((field) => (
                  <li key={field} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy ring-1 ring-line">
                    {field}
                  </li>
                ))}
              </ul>

              <Button href="/services" className="mt-9">
                Explore services
              </Button>
            </Reveal>
          </div>

          <ul className="card divide-y divide-line p-2 sm:p-3 lg:col-span-7">
            {services.map((service, i) => (
              <li key={service.id}>
                <Reveal delay={i * 60}>
                  <Link
                    href={`/services#${service.id}`}
                    data-tilt-host
                    className="group/row grid grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-[1.25rem] px-3 py-5 transition-colors duration-500 ease-out-expo hover:bg-mist focus-visible:bg-mist sm:gap-x-5 sm:px-4"
                  >
                    <span className="grid size-12 place-items-center rounded-2xl bg-ice text-steel ring-1 ring-steel/12 transition-[background-color,color,rotate] duration-500 ease-out-expo group-hover/row:-rotate-6 group-hover/row:bg-navy group-hover/row:text-sky sm:size-14">
                      <Icon name={service.icon} className="size-5 sm:size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-h4 text-navy">{service.title}</span>
                      <span className="mt-1 block text-sm text-text-3">{service.short}</span>
                    </span>
                    <span className="grid size-10 place-items-center rounded-full text-navy ring-1 ring-line transition-[background-color,color,rotate] duration-500 ease-out-expo group-hover/row:-rotate-45 group-hover/row:bg-navy group-hover/row:text-white">
                      <ArrowRight className="size-4" />
                    </span>

                    {/* Opens on hover / focus; always open on touch screens */}
                    <span className="col-span-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out-expo group-hover/row:grid-rows-[1fr] group-focus-visible/row:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                      <span className="overflow-hidden">
                        <span className="flex items-end gap-4 pt-4 sm:pl-[4.75rem]">
                          <span className="flex flex-1 flex-wrap gap-2">
                            {service.highlights.map((h) => (
                              <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy ring-1 ring-line">
                                <Check className="size-3.5 text-steel" />
                                {h}
                              </span>
                            ))}
                          </span>
                          <Render3D
                            name={DIVISION_RENDER[service.id]}
                            tilt={10}
                            sizes="120px"
                            className="hidden w-24 shrink-0 translate-x-6 opacity-0 transition-[translate,opacity] duration-700 ease-out-expo group-hover/row:translate-x-0 group-hover/row:opacity-100 sm:block [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100"
                          />
                        </span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
