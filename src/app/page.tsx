import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Values } from "@/components/home/values";
import { ActivityScope } from "@/components/home/activity-scope";
import { ProductPreview } from "@/components/home/product-preview";
import { Principles } from "@/components/home/principles";
import { Process } from "@/components/home/process";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ContactSection } from "@/components/shared/contact-section";
import { sectionImage } from "@/lib/section-images";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Values />
      <ActivityScope backdropSrc={sectionImage("services")} />
      <ProductPreview />
      <Principles />
      <Process />
      <ClientsStrip />
      <ContactSection />
    </>
  );
}
