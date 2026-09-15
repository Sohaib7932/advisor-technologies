/**
 * Single source of truth for company identity, contact details and navigation.
 * Update here and every page, the navbar, the footer and the metadata follow.
 */

export const site = {
  name: "Advisor Technologies",
  shortName: "Advisor Tech",
  tagline: "Engineering supply, integration & maintenance across Pakistan",
  description:
    "Advisor Technologies is an Islamabad-based exclusive territory agent for world-class industrial manufacturing brands. We deliver plant & machinery, IT infrastructure, security systems, furniture and general order supplies to government and private-sector clients across Pakistan.",
  url: "https://advisortechnologies.pk",
  registration: {
    ntn: "2531577-3",
    stn: "3277876138739",
  },
  contact: {
    email: "advisortech.pk@gmail.com",
    phone: "+92-301-5782793",
    phoneHref: "+923015782793",
    address: {
      line1: "Office No. 8, Lower Ground Floor",
      line2: "Royal Inn Plaza, Plot No. 19-A",
      city: "F-8 Markaz, Islamabad",
      country: "Pakistan",
    },
  },
  hours: {
    weekdays: "Monday to Friday, 9:00 AM to 6:00 PM",
    saturday: "Saturday, 10:00 AM to 2:00 PM",
  },
} as const;

export const addressLines = [
  site.contact.address.line1,
  site.contact.address.line2,
  site.contact.address.city,
  site.contact.address.country,
];

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/", description: "Who we are at a glance" },
  { label: "About", href: "/about", description: "Our story, values and principles" },
  { label: "Services", href: "/services", description: "What we deliver end to end" },
  { label: "Products", href: "/products", description: "Our supply catalogue" },
  { label: "Clients", href: "/clients", description: "Institutions we serve" },
  { label: "Contact", href: "/contact", description: "Start a conversation" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Values", href: "/about#values" },
      { label: "Objective & Principles", href: "/about#principles" },
      { label: "Valued Clients", href: "/clients" },
    ],
  },
  {
    title: "Capabilities",
    items: [
      { label: "Activity Scope", href: "/services" },
      { label: "Product Line", href: "/products" },
      { label: "IT & Networks", href: "/services#it-networks" },
      { label: "Repair & Maintenance", href: "/services#maintenance" },
    ],
  },
  {
    title: "Get in touch",
    items: [
      { label: "Contact Us", href: "/contact" },
      { label: "Request a Quote", href: "/contact#enquiry" },
      { label: "Tender Support", href: "/contact#enquiry" },
      { label: "Visit Our Office", href: "/contact#office" },
    ],
  },
];
