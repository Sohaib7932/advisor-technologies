/**
 * Company content transcribed from the Advisor Technologies company profile.
 * Every page reads from here so copy stays consistent and is edited in one place.
 */

export type IconName =
  | "machinery"
  | "network"
  | "computer"
  | "security"
  | "print"
  | "wrench"
  | "server"
  | "satellite"
  | "web"
  | "monitor"
  | "package"
  | "office"
  | "imaging"
  | "notebook"
  | "shield"
  | "spark"
  | "gauge"
  | "handshake";

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const aboutParagraphs = [
  "Advisor Technologies is a company acting as exclusive territory agent to a number of world-class industrial manufacturing brands for the Pakistan market, focused on delivering high quality brands alongside international standards of after-sales service.",
  "We currently hold a number of supply contracts across Pakistan, notably with different projects of the Government of Pakistan. We have developed our range of products to deliver branded machinery & equipment, stationery, computer stationery, all kinds of furniture items, all kinds of repair & maintenance of machinery, transport, buildings and roads, as well as import & export, to cater for the ever-increasing demands of industry in the country.",
  "Together with a team of experienced industry professionals, we continue to develop business in the Pakistan market. Advisor Technologies is now a recognised brand within Pakistan which stands for quality and reliability, and that has led to us gaining a reputation as one of the leading players in the sector.",
];

export const objectiveParagraphs = [
  "The main objective of Advisor Technologies is to serve customers in both the public and private sector across areas such as production, trade, banks, government institutions and NGOs.",
  "The idea of its creators is to offer customers complete solutions, from network design, hardware and software supply, and advice on what is best for the organisation, through to service and training.",
  "Qualified employees work in the company specialising in plant & machinery, civil engineering, mechanical engineering, software, communications and services.",
];

/* -------------------------------------------------------------------------- */
/* Values & principles                                                        */
/* -------------------------------------------------------------------------- */

export const values: { title: string; blurb: string; icon: IconName }[] = [
  {
    title: "Integrity",
    blurb: "Transparent pricing, honest timelines and documentation that stands up to audit.",
    icon: "shield",
  },
  {
    title: "Professionalism",
    blurb: "Qualified engineers and procurement specialists on every assignment we accept.",
    icon: "handshake",
  },
  {
    title: "Efficiency",
    blurb: "Lean processes that move an order from tender award to commissioning without friction.",
    icon: "gauge",
  },
  {
    title: "Teamwork",
    blurb: "One accountable team across supply, installation, service and after-sales support.",
    icon: "spark",
  },
];

/** `short` is the one-line version used on the home page's floating cards. */
export const principles: {
  title: string;
  short: string;
  body: string;
  icon: IconName;
}[] = [
  {
    title: "Quality",
    short: "Time, money and resources invested to hold the standard.",
    body: "Advisor Technologies invests the time, money and resources necessary to ensure the desired quality and growth in terms of a rapidly evolving market.",
    icon: "shield",
  },
  {
    title: "Service",
    short: "Understanding the need before quoting the solution.",
    body: "Service must complement quality. Only by understanding the needs of its customers can the company provide high quality services and maintain its leading position on the market.",
    icon: "handshake",
  },
  {
    title: "Efficiency",
    short: "Skilled people, lean process, work people are proud of.",
    body: "The best way to improve productivity is to give our people the opportunity to learn and improve their personal skills, contribute to the work process and be satisfied with their achievements.",
    icon: "gauge",
  },
  {
    title: "Innovation",
    short: "New ideas cultivated, and given the means to be realised.",
    body: "Long-term success can only be assured by cultivating new ideas. That is why the company encourages its employees to be creative, and gives them the means to see their ideas realised.",
    icon: "spark",
  },
];

/* -------------------------------------------------------------------------- */
/* Activity scope: what we do                                                */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  title: string;
  short: string;
  body: string;
  icon: IconName;
  image: string;
  highlights: string[];
};

export const services: Service[] = [
  {
    id: "plant-machinery",
    title: "Plant, Machinery & Furniture",
    short: "Supply, installation and fixing",
    body: "Supply, installation and fixing of plant & machinery, furniture, office stationery, computer stationery and all kinds of general order supplies related to the various industries.",
    icon: "machinery",
    image: "/images/plant-machinery-furniture.png",
    highlights: [
      "Industrial plant & machinery",
      "Office and institutional furniture",
      "Office & computer stationery",
      "General order supplies",
    ],
  },
  {
    id: "it-networks",
    title: "IT Consultancy & Network Solutions",
    short: "Design, deploy, maintain",
    body: "Consultancy and servicing of information systems, network solutions, services & installations, customised office automation software solutions, web design, development and maintenance.",
    icon: "network",
    image: "/images/it-consultancy.png",
    highlights: [
      "LAN & WAN design and rollout",
      "Office automation software",
      "Structured cabling & racks",
      "Web design, development & hosting",
    ],
  },
  {
    id: "computing",
    title: "Computing & Office Equipment",
    short: "Hardware and communications",
    body: "Supply of computers, laptops and accessories, installation and service of PABX exchange systems, off-the-shelf software, complete office equipment & supplies and general items.",
    icon: "computer",
    image: "/images/computing.svg",
    highlights: [
      "Desktops, laptops & workstations",
      "PABX exchange installation",
      "Licensed off-the-shelf software",
      "Complete office equipment",
    ],
  },
  {
    id: "security-systems",
    title: "Security & Access Control",
    short: "Surveillance and screening",
    body: "Supply, service and maintenance of CCTV cameras, walkthrough gates and accessories, complete access control systems and queue management systems.",
    icon: "security",
    image: "/images/security.svg",
    highlights: [
      "CCTV supply & maintenance",
      "Walkthrough gates & screening",
      "Access control systems",
      "Queue management systems",
    ],
  },
  {
    id: "printing",
    title: "Printing Services",
    short: "All types of printing work",
    body: "All types of printing work, from institutional forms, registers and secure stationery through to large-format and promotional printing.",
    icon: "print",
    image: "/images/printing.svg",
    highlights: [
      "Institutional forms & registers",
      "Computer stationery",
      "Large-format printing",
      "Promotional material",
    ],
  },
  {
    id: "maintenance",
    title: "Repair & Maintenance Works",
    short: "Civil, electrical and mechanical",
    body: "Repairing of all types of machinery & equipment, light & heavy transport, buildings & structures, roads & water supplies, and all types of electrical & mechanical works.",
    icon: "wrench",
    image: "/images/maintenance.svg",
    highlights: [
      "Machinery & equipment overhaul",
      "Light & heavy transport repair",
      "Buildings, roads & water supply",
      "Electrical & mechanical works",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Product line                                                               */
/* -------------------------------------------------------------------------- */

export type ProductCategory =
  | "Infrastructure"
  | "IT Hardware"
  | "Connectivity"
  | "Works & Supply";

export type Product = {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  category: ProductCategory;
};

export const products: Product[] = [
  {
    id: "plant",
    title: "Plant & Machinery",
    body: "Supply, installation, fixing and maintenance of all plant & machinery.",
    icon: "machinery",
    category: "Infrastructure",
  },
  {
    id: "computer-systems",
    title: "Computer Systems",
    body: "Desktops, workstations, appliances, LAN stations and servers, with a full set of services covering investigation, development, installation and maintenance of LAN & WAN.",
    icon: "computer",
    category: "IT Hardware",
  },
  {
    id: "notebooks",
    title: "Notebooks & Handhelds",
    body: "Notebooks and handheld devices with a full range of accessories.",
    icon: "notebook",
    category: "IT Hardware",
  },
  {
    id: "printing-multifunction",
    title: "Printing & Multifunction",
    body: "Printers, faxes, copiers, all-in-one machines, print servers and network software, large-format printers and plotters.",
    icon: "print",
    category: "IT Hardware",
  },
  {
    id: "imaging-audio",
    title: "Digital Imaging & Audio",
    body: "Scanners, digital projectors, digital audio devices, digital senders and photography equipment.",
    icon: "imaging",
    category: "IT Hardware",
  },
  {
    id: "servers",
    title: "Servers",
    body: "Super-scalable servers and server appliances for tower or rack-mount environments, internal system expansion or simplified clustering.",
    icon: "server",
    category: "IT Hardware",
  },
  {
    id: "networking",
    title: "Networking",
    body: "Switches and hubs, storage area networks (SAN), print servers and network software, modems, UNIX-server connectivity, output management and document delivery.",
    icon: "network",
    category: "Connectivity",
  },
  {
    id: "satellite",
    title: "Satellite Communications",
    body: "Two-way broadband satellite communication systems for internet, with standard, plus and premium account tiers, VPN links between subsidiaries or remote sites, and VoIP system building.",
    icon: "satellite",
    category: "Connectivity",
  },
  {
    id: "temporary-office",
    title: "Temporary Office Setup",
    body: "Temporary offices, computer networks, satellite offices, special-event offices, conventions and transitional network set-ups, including internet access ported to any site via the cellular network.",
    icon: "office",
    category: "Works & Supply",
  },
  {
    id: "web-services",
    title: "Web Services",
    body: "Web design & development, web maintenance and web hosting.",
    icon: "web",
    category: "Connectivity",
  },
  {
    id: "civil-mechanical",
    title: "Civil & Mechanical Works",
    body: "Civil works and mechanical works across buildings, structures, roads and utilities.",
    icon: "wrench",
    category: "Works & Supply",
  },
  {
    id: "monitors",
    title: "Monitors & Displays",
    body: "PC monitors, LCD panels and multi-media displays.",
    icon: "monitor",
    category: "IT Hardware",
  },
  {
    id: "general-order",
    title: "General Order Supplies",
    body: "General order supply across furniture, stationery, consumables and institutional requirements.",
    icon: "package",
    category: "Works & Supply",
  },
];

export const productCategories = [
  "All",
  "Infrastructure",
  "IT Hardware",
  "Connectivity",
  "Works & Supply",
] as const;

/* -------------------------------------------------------------------------- */
/* Clients                                                                    */
/* -------------------------------------------------------------------------- */

export type Client = { name: string; sector: string };

export const clients: Client[] = [
  { name: "Hashwani Hotels Limited", sector: "Hospitality" },
  { name: "Islamabad Club", sector: "Hospitality" },
  { name: "Ministry of Ports & Shipping", sector: "Federal Ministry" },
  { name: "Capital Development Authority", sector: "Civic Authority" },
  { name: "NADRA Islamabad / Karachi", sector: "Federal Authority" },
  { name: "National Tariff Commission, Ministry of Commerce", sector: "Federal Ministry" },
  { name: "Chief Commissioner Office ICT", sector: "Civic Authority" },
  { name: "National Police Academy Islamabad", sector: "Law Enforcement" },
  { name: "Islamabad Social Security Institutions", sector: "Public Welfare" },
  { name: "Ministry of Education & Technical Training", sector: "Federal Ministry" },
  { name: "Narcotics Control Division Islamabad", sector: "Federal Division" },
  { name: "Ministry of Parliamentary Affairs", sector: "Federal Ministry" },
  { name: "Ministry of Kashmir Affairs", sector: "Federal Ministry" },
  { name: "Pakistan Housing Authority Foundation", sector: "Federal Authority" },
  { name: "Directorate General Post Clearance Audit", sector: "Revenue & Audit" },
  { name: "Excise & Taxation Department ICT", sector: "Revenue & Audit" },
  { name: "National Counter Terrorism Authority", sector: "Federal Authority" },
  { name: "Ministry of Information & Broadcasting", sector: "Federal Ministry" },
  { name: "Wafaqi Mohtasib Secretariat Islamabad", sector: "Federal Authority" },
  { name: "Ministry of Religious Affairs Islamabad", sector: "Federal Ministry" },
  { name: "IESCO, Islamabad", sector: "Power Utility" },
  { name: "Nai Zindagi Trust Islamabad", sector: "NGO" },
  { name: "Women Welfare Department ICT", sector: "Public Welfare" },
  { name: "Marine Fisheries Department Karachi", sector: "Federal Department" },
  { name: "Pakistan Marine Academy Karachi", sector: "Education" },
];

/* -------------------------------------------------------------------------- */
/* Figures: all derived from the lists above, not invented                   */
/* -------------------------------------------------------------------------- */

export const stats = [
  {
    value: `${clients.length}+`,
    label: "Institutional clients",
    detail:
      "Federal ministries, authorities, utilities and private enterprises served across Pakistan.",
  },
  {
    value: `${services.length}`,
    label: "Core divisions",
    detail:
      "From plant & machinery through IT, security systems, printing and maintenance works.",
  },
  {
    value: `${products.length}+`,
    label: "Product categories",
    detail:
      "A supply catalogue spanning infrastructure, IT hardware, connectivity and general orders.",
  },
  {
    value: "2",
    label: "Cities of operation",
    detail: "Headquartered in Islamabad with active supply contracts reaching Karachi.",
  },
];

/* -------------------------------------------------------------------------- */
/* Process                                                                    */
/* -------------------------------------------------------------------------- */

export const processSteps = [
  {
    step: "01",
    title: "Consultation",
    body: "We review your requirement, site conditions and tender documents, then advise on what genuinely fits the organisation.",
  },
  {
    step: "02",
    title: "Specification & quotation",
    body: "A documented technical specification and transparent commercial quotation, prepared to procurement standards.",
  },
  {
    step: "03",
    title: "Supply & installation",
    body: "Branded equipment delivered, installed, fixed and commissioned by qualified engineers on schedule.",
  },
  {
    step: "04",
    title: "Service & training",
    body: "Handover training plus international-standard after-sales service, maintenance and spares support.",
  },
];

/* -------------------------------------------------------------------------- */
/* Sectors served                                                             */
/* -------------------------------------------------------------------------- */

export const sectors = [
  "Government institutions",
  "Production & industry",
  "Trade & commerce",
  "Banking",
  "NGOs",
  "Hospitality",
  "Education",
  "Utilities",
];
