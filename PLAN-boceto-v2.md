# PLAN — Boceto v2 Miqui (merge Claude designer + Claude UX + Codex team)

Single static file `boceto/index.html` (vanilla). Phone-first (390), desktop = centered "app" column + wider home.

## Visual system
- Fonts: **Bodoni Moda** (display, 500/600 + 500 italic; italic for emotional words, e.g. "algo *lindo*"), **Instrument Sans** (UI/text 400/500/600), **Pinyon Script** once only as signature "con amor, Miqui". (Codex: Bodoni+Manrope; designer: Gloock+Instrument+Pinyon → merged.)
- Tokens: paper #FFF8F1 (+3% SVG grain), ink #3B1F24, ink-soft #6E4148, cherry #A8324A (CTA, cream text), rosa #F6D6D9, celeste #DCE8EF, manteca #F5EDCA, line #E6D3CF, ok #286348. Pastels = fills only.
- Geometry: section "lids" 28px top radius in pastel blocks, scalloped SVG dividers between sections; photos 16px; controls 12px; chips pill; sheets 28px top. Shadow only on floating elements.
- Photos: Unsplash IDs from brief, srcset 400/800/1200, `loading=lazy` except hero (fetchpriority=high), uniform warm grade; small "foto ilustrativa" tag.
- Motion (all under prefers-reduced-motion: no-preference): View Transitions between screens and card→sheet photo morph; heart flies to cart pill + pill bounce; scroll-driven frill reveal; price number tween; Finde stock "stamp". Reduced: instant/crossfade.

## Customer IA (bottom tab bar: Inicio · Tortas · Finde · Mesa dulce) + floating "Tu pedido" pill
- **Inicio**: boceto marker; wordmark; stories row (first = "Menú del finde" ringed → fullscreen slides of slices → "Reservá"); hero photo 1778447849704 + H1 "Algo *lindo* para celebrar" + sub "Tortas a tu medida y porciones para el finde. Hechas en Lomas, para retirar por casa." + CTAs "Elegí tu torta" / "Ver el menú del finde"; occasion chips; rails per line; "Cómo pedir" 3 steps; Instagram link (no fake reviews); signature.
- **Tortas**: occasion chips (Cumple/Aniversario/Boda/Todas), snap rails Clásicas · Vintage & corazón, cards 4:5 with "desde $X · 10–25 porc." → quick-view sheet (photos, sizes, "Armar mi torta"). Boda → "Consultar por WhatsApp".
- **Cake builder** (full-screen sheet, progress dots, sticky footer "Total $X · Seña 50% $Y"):
  1. ¿Para cuándo? two-week day strip with capacity labels ("Quedan 2" / "Sin cupo" / "Pedí con 72 h") + pickup window chips.
  2. Hacela tuya: style (prefilled), size segmented, filling chips with inline surcharge.
  3. Detalles: inscription (30-char hard limit, counter, live preview text on photo), optional reference photo, color note.
  4. Revisá: name, WhatsApp, editable summary, balance; payment: MP seña (simulada) or "seña en efectivo" pending.
  → Confirmation with WhatsApp message preview + hearts confetti.
- **Finde**: closing as absolute text "Reservás hasta el jueves 20 h" (no ticking countdown); numbered editorial menu (01, 02…) with round photo + dotted leader + price + honest "Quedan N" stamp + Agregar→stepper; sold out → "Agotado". Pill → checkout sheet: items, slot chips w/ places left, name/WA, MP vs Efectivo al retirar.
- **Mesa dulce**: pictured sets (petits, cupcakes, mesa completa) with piece counts → "Consultar mi idea" (prefilled WhatsApp text, simulated).

## Panel de Miqui (separate: `#panel`, linked from small footer "Soy Miqui →", own bottom nav Agenda · Producción · Menú)
- Agenda: day pills Hoy / Sáb / Dom / Semana; one summary line; big order cards (photo, name, time, item, payment badge, saldo). One big next-step button (Empezar → Marcar lista → Entregada) + 5s "Deshacer" toast; WhatsApp icon → preview message sheet. Payment status independent ("Marcar cobrado").
- Producción: checklist grouped by product with totals + cake briefs (inscription, colors).
- Menú: stock steppers per slice, big "Reservas abiertas" switch with confirm sheet.
- No charts/tables/filters. New orders from customer flow appear here.

## Honesty / data
All prices, stock, flavors, days, orders = examples, marker in header + "simulado" on payment buttons; photos tagged ilustrativas; no reviews.

## A11y/perf
AA contrast, focus-visible, 44px targets, sheets as <dialog> with focus trap + Esc + back button closes; aria-live for cart; LCP hero only eager image.

## Ajustes tras auditoría Codex (ronda 1: CAMBIOS)
1. Bodoni only ≥32px, 600; prices/controls/small headings in Instrument Sans. ✔
2. Pinyon dropped; signature in Bodoni italic. ✔
3. Cart pill only when populated, above tab bar w/ safe-area. Stories KEPT (IG-native pattern, explicit owner ask for modern browsing) but accessible: buttons, no autoplay under reduced motion. (disagree w/ Codex)
4. Builder: product+size+filling first, then date+pickup. Selections preserved. ✔
5. No grain, one scallop only; pastel sections + photography. ✔
6. dialog labels, return focus, Esc/Back close, no nested dialogs (swap), capacity labels in text, persistent undo on card. ✔
7. Fixed demo weekend (sáb 7 / dom 8 nov 2026, cierre jue 5 20 h, hora de Buenos Aires); confirmation says "Simulación: no reservaste ni pagaste."; cash deposit does not reserve until received. ✔
8. Deferred confetti/morph/flying hearts/scroll fx. Keep View Transitions for screen changes only. sessionStorage + "Reiniciar demo". ✔
