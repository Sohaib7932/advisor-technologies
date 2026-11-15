import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ContactSection } from "@/components/shared/contact-section";
import { site } from "@/lib/site";
import { Accent } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Advisor Technologies at ${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city}. Email ${site.contact.email} or call ${site.contact.phone}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        render="banner-contact"
        title={
          <>
            Let&rsquo;s discuss <Accent>your requirement</Accent>
          </>
        }
        lead="Send us a specification, a bill of quantities or a tender reference and our team will respond with a documented technical and commercial proposal."
        facts={[
          { value: site.hours.weekdays.split(",")[0], label: "Office days" },
          { value: site.contact.address.city.split(", ")[1] ?? site.contact.address.city, label: site.contact.address.country },
        ]}
      />

      <ContactSection />
    </>
  );
}
