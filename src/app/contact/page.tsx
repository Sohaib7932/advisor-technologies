import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ContactSection } from "@/components/shared/contact-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Advisor Technologies at ${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city}. Email ${site.contact.email} or call ${site.contact.phone}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s discuss
            <span className="text-accent"> your requirement</span>
          </>
        }
        lead="Send us a specification, a bill of quantities or a tender reference and our team will respond with a documented technical and commercial proposal."
      />

      <ContactSection showHeading={false} />
    </>
  );
}
