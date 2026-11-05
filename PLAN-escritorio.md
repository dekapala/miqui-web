# PLAN — Boceto escritorio (escritorio.html), misma esencia que la versión celular

Keep: palette tokens, Bodoni Moda (≥32px, italic accents) + Instrument Sans, photography-led, pastel blocks (manteca/celeste/rosa), one scallop, "Boceto · datos de ejemplo" + "Foto ilustrativa" + "Simulación" honesty, shared datos.js, same sessionStorage state (orders flow into panel).
Auto-switch: index.html → escritorio.html at ≥1024px (override ?v=movil) and back at <1024 (override ?v=escritorio). Footer link to the other version.

## Concept changes for desktop
1. Navigation: sticky top header (brand · Tortas · Finde · Mesa dulce · Cómo pedir · cart button "Tu pedido (n)") instead of bottom tab bar + floating pill.
2. Hero: editorial split 5/7 — H1 ~88px left; right an asymmetric photo collage (tall main + 2 offset) with a slowly rotating circular SVG seal "hecho a mano · Lomas de Zamora" (paused on reduced motion / off-screen).
3. Stories → kept as a secondary entry ("Ver el finde en historias") opening a centered phone-sized player with arrow buttons + keyboard; no stories row.
4. Finde preview on home: manteca band, left text/CTA, right numbered menu where hovering/focusing a row swaps a large photo (desktop hover-preview).
5. Tortas: 4-col grid with hover zoom, chips right of title; quick view = centered 2-column modal (photo | sizes + "Armar mi torta").
6. Cake builder = one-page configurator modal (1100px): left sticky live preview photo with inscription overlay + chosen options; right all 4 sections visible as numbered blocks (size/filling, mini-calendar 7-col with capacity labels, details, data+payment); sticky total/seña + CTA at bottom of right column; CTA lists what's missing.
7. Finde page: 2 columns — menu list (bigger photos) left, sticky always-visible order sidebar right (items w/ steppers, slot chips, name, WA, payment, total, CTA). Replaces pill + bottom sheet.
8. Mesa dulce: 3 cards in a row; inquiry in a centered modal.
9. Panel: dark left sidebar (Agenda/Producción/Menú, Ver tienda, Reiniciar demo). Agenda = day chips + 4 stat tiles + kanban by status (Nuevo / En preparación / Lista / Entregada) with the same explicit next-step button, undo, WhatsApp, cobrar. Producción: checklist | cake briefs side by side. Menú: switch + stock grid.
All modals = centered <dialog> (Esc/backdrop/back close, focus return).
