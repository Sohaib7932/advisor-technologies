# Image credits

All photographs on the site are real stock photographs from **Unsplash**, used
under the [Unsplash License](https://unsplash.com/license): free for commercial
use, no permission or attribution required. We list them here anyway so each
one can be traced and replaced.

They are downloaded and given one shared grade (slightly brighter, slightly
desaturated, cooled toward the navy/steel palette) by
`scripts/process-photos.mjs`. To swap a photo, change its id there and re-run
`node scripts/process-photos.mjs`.

| File (`public/images/photos/`) | Used for | Unsplash photo |
| --- | --- | --- |
| `plant-machinery.webp` | Plant, Machinery & Furniture division; Infrastructure range | https://unsplash.com/photos/1581091226825-a6a2a5aee158 |
| `it-networks.webp` | IT Consultancy & Network Solutions; Connectivity range; About page | https://unsplash.com/photos/1544197150-b99a580bb7a8 |
| `computing.webp` | Computing & Office Equipment; IT Hardware range; Products hero | https://unsplash.com/photos/1497215728101-856f4ea42174 |
| `security.webp` | Security & Access Control | https://unsplash.com/photos/1557597774-9d273605dfa9 |
| `printing.webp` | Printing Services | https://unsplash.com/photos/1612815154858-60aa4c59eaa6 |
| `maintenance.webp` | Repair & Maintenance Works; Works & Supply range | https://unsplash.com/photos/1581092160562-40aa08e78837 |
| `about.webp` | Home "About us" feature card; About page | https://unsplash.com/photos/1524758631624-e2822e304c36 |
| `corridor.webp` | Principles section; default page-hero image | https://unsplash.com/photos/1497366216548-37526070297c |

**Photographer names: to be confirmed.** The photos were fetched by id from
`images.unsplash.com`; the Unsplash search API was not reachable while
building, so the photographers' names were not recorded. Open each link above
to see the photographer, and add the name here if you want to credit them.

## Not photographs

- `public/images/illustrations/*.webp`: the six product illustrations on the
  cards (rack, CCTV, laptop, printer, chair, gear) are the hero's own 3D
  models rendered offscreen. Regenerate with `npm run dev`, then
  `node scripts/capture-illustrations.cjs`.
- The hero scene and the section line art (gears, circuit traces, floor plan)
  are drawn in code.
- Client logos in `public/images/clients-logos/` belong to their owners.

## Not used

The AI-generated images `public/images/hero/hero-bg*.webp` and
`public/hero-section-bg.png` are kept on disk but are no longer referenced
anywhere on the site.
