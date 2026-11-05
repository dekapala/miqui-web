# PLAN — "Mi web" en el panel de Miqui (boceto B: index.html celular + escritorio.html)

Goal: the owner (non-technical, mostly on phone) manages her site content from the panel without help.

## Scope (mockup — no backend)
- New panel tab **"Mi web"** (mobile bottom nav 4th item; desktop sidebar item) with sections:
  1. **Portada**: change main photo (and desktop secondary photo); edit subtitle text.
  2. **Tortas por encargo**: list with thumbnail, name, "desde $X"; per-item toggles **Visible** and **Destacada en portada**; **Editar** opens an editor (photo, name, estilo Clásica/Vintage, ocasiones Cumple/Aniversario/Boda, recargo sobre precio base with live "desde $X", descripción); **+ Nueva torta**; **Eliminar** with confirm + Deshacer toast.
  3. **Mesa dulce**: change photo.
  4. **Ver mi web** (go to store) + **Restaurar contenido original**.
- Existing **"Menú del finde"** tab upgraded ("tortas del día"): open/close switch (exists), editable weekend date text and closing text, porciones CRUD: photo, name, price, stock stepper (can't go below reserved), reorder ↑↓, delete (blocked if it has reservations), **+ Agregar porción**.
- Photos: `<input type=file accept=image/*>` (phone camera/gallery) → resized client-side to max 1000px JPEG q≈0.82 → data URL. Show "Foto propia" vs "Foto ilustrativa" tag accordingly.
- Persistence: content in **localStorage** key `miqui-web-b` (shared by both B pages in the same browser); orders stay in sessionStorage. Quota errors → friendly toast. Clear banner: "En el boceto los cambios se guardan solo en este navegador. En la versión real se publican para todos."
- Shared code: `admin.js` + `admin.css` loaded by both pages; each page's render functions read `S.web` (tortas, fotos, textos) instead of constants; `U()` accepts data:/http URLs; empty photo → placeholder.
- A11y: real labels, 44px targets, focus return, aria-live saves ("Guardado ✓").

## Decisiones tras auditoría Codex (plan + 2 rondas de código)
- Pedidos y menú se guardan juntos en localStorage (no se separaron): el stock depende de las reservas (m.res); separarlos los desincroniza al reabrir. Riesgo multi-pestaña cubierto con sync por evento `storage`, encolado si hay un editor abierto y aplicado antes del próximo guardado o al cerrar.
- Todo cambio pasa por commit(): guarda ambos almacenes y, si falla cualquiera, revierte memoria y lo ya escrito.
- Las mutaciones resuelven por id (no referencias viejas). Portada muestra solo destacadas visibles. Menú vacío con mensaje en ambas versiones e historias regeneradas desde el menú actual.
- Pendiente para la versión real: backend (publicar para todas las clientas), editar tamaños/rellenos/horarios de retiro, separar contenido de reservas con snapshots por pedido.
