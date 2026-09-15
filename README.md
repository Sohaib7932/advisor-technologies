# Advisor Technologies Website

Marketing site for Advisor Technologies (Islamabad), built with Next.js 16 (App
Router), React 19 and Tailwind CSS v4.

## Running it

```bash
npm run dev      # development at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
```

## Where things live

```
src/
├── app/                      # routes, one folder per page
│   ├── layout.tsx            # fonts, metadata, navbar + footer shell
│   ├── page.tsx              # home
│   ├── globals.css           # design tokens + base styles + custom utilities
│   ├── about/  services/  products/  clients/  contact/
│   ├── not-found.tsx         # 404
│   ├── sitemap.ts            # /sitemap.xml
│   └── robots.ts             # /robots.txt
│
├── components/
│   ├── layout/               # navbar (rounded floating pill), footer
│   ├── ui/                   # primitives: container, button, icons,
│   │                         #   section-heading, reveal-on-scroll
│   ├── home/                 # home-page sections
│   └── shared/               # reused across pages: page-hero, cta,
│                             #   contact-form, product-grid
│
└── lib/
    ├── site.ts               # company details, contact info, navigation
    ├── content.ts            # all page copy: services, products, clients…
    └── utils.ts              # cn() class helper
```

## Editing content

Almost all copy lives in two files, so you rarely need to touch a component:

- **`src/lib/site.ts`**: address, email, phone, NTN/STN, office hours, and the
  navbar/footer menus.
- **`src/lib/content.ts`**: the about text, values, principles, the six service
  divisions, the product catalogue, and the client list.

The headline figures on the home page (`25+ institutional clients`,
`13+ product categories`, …) are **calculated from those lists**, so adding a
client or a product updates the numbers automatically.

## Replacing the placeholder images

`public/images/` currently holds generated placeholder artwork in the brand
colours. To use real photography, **drop your file in with the same name** and
the same extension change:

| File | Used on |
| --- | --- |
| `hero.svg` | Home hero background |
| `operations.svg` | Home, objective & principles |
| `office.svg` | Call-to-action band (all pages) |
| `team.svg` / `about.svg` | About page |
| `workshop.svg` | Services page header |
| `warehouse.svg` | Products page header |
| `clients.svg` | Clients page header |
| `contact.svg` | Contact page header + location card |
| `plant-machinery.svg`, `it-networks.svg`, `computing.svg`, `security.svg`, `printing.svg`, `maintenance.svg` | Service cards and detail sections |

If you switch to `.jpg`/`.webp`, update the path in one place:

- service images → the `image` field in `src/lib/content.ts`
- the rest → the `src`/`image` prop in the component listed above

Regenerate the placeholders at any time with:

```bash
node scripts/generate-placeholders.mjs public/images
```

## Design system

Tokens are defined once in `src/app/globals.css` under `@theme`:

- **Navy** `navy-50` to `navy-950`, drawn from the logo's monogram (`navy-600` = `#2a4468`)
- **Graphite** `graphite-50` to `graphite-900`, drawn from the logo's swoosh
- **Surfaces** `canvas` (page), `surface` (cards), `ink` (body text)
- **Type**: Sora for headings (`font-display`), Plus Jakarta Sans for body
- **Radii** `rounded-card`, `rounded-panel`, `rounded-hero`
- **Shadows** `shadow-soft`, `shadow-lift`, `shadow-float`

Custom utilities: `text-display`, `text-headline`, `text-title`, `eyebrow`,
`glass`, `reveal`, `animate-marquee`, `no-scrollbar`.

## Notes

- The contact form has **no backend yet**. Submitting opens the visitor's mail
  client with the enquiry pre-composed to `advisortech.pk@gmail.com`. To wire up
  a real endpoint, replace `handleSubmit` in
  `src/components/shared/contact-form.tsx` with a server action.
- The hero's quick-enquiry bar passes its selections to the contact page as
  query parameters, which pre-fill the full form.
- Scroll reveals respect `prefers-reduced-motion` and fall back to fully visible
  content when JavaScript is unavailable.
- Update `site.url` in `src/lib/site.ts` once the real domain is live,
  it feeds the sitemap, robots.txt and social share metadata.
