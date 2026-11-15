# Redesign: notched nav + 3D (branch `redesign/notched-3d`)

References: `docs/references/ref-1-saasify.jpg` (layout, notch, stats panel,
feature rows), `ref-2-apex.jpg` (3D platform skyline, dark panels, contact),
`ref-3-glass.jpg` (glass tiles, bar-chart cluster, bento). Structure and 3D
style only; all text comes from `src/lib/content.ts` and `src/lib/site.ts`.

- [x] Phase 1: design system (globals.css tokens, src/lib/motion.ts)
- [x] Phase 2: one Button component everywhere
- [x] Phase 3: notched navbar + floating pill + mobile panel
- [x] Phase 4: hero (inset dark panel, live 3D platform scene, poster)
- [x] Phase 5: 3D asset library + scripts/render-3d.mjs -> public/3d/
- [x] Phase 6: home sections
- [x] Phase 7: inner pages (About, Services, Products, Clients, Contact, 404)
- [ ] Phase 8: motion system pass
- [ ] Phase 9: cleanup (dead code, atmosphere, old hero)
- [ ] Verification: screenshots at 1440/1920/768/375, intro frames, hovers,
      design review x2, contrast, Lighthouse, build, lint
