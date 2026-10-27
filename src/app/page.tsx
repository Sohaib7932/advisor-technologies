import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Values } from "@/components/home/values";
import { ActivityScope } from "@/components/home/activity-scope";
import { ProductPreview } from "@/components/home/product-preview";
import { Principles } from "@/components/home/principles";
import { Process } from "@/components/home/process";
import { ClientsStrip } from "@/components/home/clients-strip";
import { ContactSection } from "@/components/shared/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Values />
      <ActivityScope />
      <ProductPreview />
      <Principles />
      <Process />
      <ClientsStrip />
      <ContactSection />
    </>
  );
}
