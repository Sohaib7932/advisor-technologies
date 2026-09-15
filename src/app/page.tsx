import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { CapabilitiesBento } from "@/components/home/capabilities-bento";
import { Principles } from "@/components/home/principles";
import { ProductPreview } from "@/components/home/product-preview";
import { ClientsStrip } from "@/components/home/clients-strip";
import { Process } from "@/components/home/process";
import { Cta } from "@/components/shared/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <CapabilitiesBento />
      <Principles />
      <ProductPreview />
      <ClientsStrip />
      <Process />
      <Cta />
    </>
  );
}
