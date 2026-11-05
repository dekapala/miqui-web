/* =========================================================================
   Miqui · "Mi web" — administración de contenido (boceto B)
   Compartido por index.html (celular) y escritorio.html.
   Usa globales de cada página: $, $$, esc, plata, img, U, toast, openSheet,
   closeSheet, renderAll, renderPanel, S, save, W, saveWeb, TAMANOS, OCASIONES.
   En el boceto todo se guarda en este navegador (localStorage).
   ========================================================================= */

const MiWeb = (() => {
  const IS_DESK = () => !!document.querySelector(".pside");
  const own = ref => typeof ref === "string" && ref.startsWith("data:");
  const ESTILOS_T = ["Clásica", "Vintage"];

  /* ---------- Fotos: elegir del teléfono y achicar ---------- */
  function pickPhoto() {
    return new Promise(res => {
      const i = document.createElement("input");
      i.type = "file"; i.accept = "image/*";
      i.onchange = async () => {
        const f = i.files && i.files[0]; if (!f) return res(null);
        try { res(await shrink(f)); } catch { toast("No se pudo leer esa foto. Probá con otra."); res(null); }
      };
      i.click();
    });
  }
  async function shrink(file, max = 1000) {
    let src;
    if (window.createImageBitmap) src = await createImageBitmap(file);
    else src = await new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = ko; im.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(src.width, src.height));
    const c = document.createElement("canvas"); c.width = Math.round(src.width * k); c.height = Math.round(src.height * k);
    c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.82);
  }

  /* ---------- Guardar con vuelta atrás si falla ---------- */
  let pendiente = false; // llegaron cambios de otra pestaña mientras había un editor abierto
  function syncFromStorage() {
    try { const s2 = JSON.parse(localStorage.getItem(KEY)); if (s2) Object.assign(S, s2); const w2 = JSON.parse(localStorage.getItem(WKEY)); if (w2) { Object.keys(W).forEach(k => delete W[k]); Object.assign(W, w2); } } catch {}
    pendiente = false;
  }
  const mt = id => S.menu.find(x => x.id === id), tt = id => W.tortas.find(x => x.id === id);
  function commit(mut, msg, undoFn) {
    if (pendiente) syncFromStorage();
    let rawW = null, rawS = null; try { rawW = localStorage.getItem(WKEY); rawS = localStorage.getItem(KEY); } catch {}
    const sw = structuredClone(W), sm = structuredClone(S.menu), sc = structuredClone(S.carrito);
    mut();
    const ok = saveWeb() && save() !== false;
    if (!ok) {
      Object.keys(W).forEach(k => delete W[k]); Object.assign(W, sw); S.menu.splice(0, S.menu.length, ...sm); S.carrito = sc;
      try { rawW == null ? localStorage.removeItem(WKEY) : localStorage.setItem(WKEY, rawW); rawS == null ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, rawS); } catch {}
    }
    refresh(); if (ok && msg) toast(msg, undoFn); return ok;
  }

  /* ---------- Aplicar contenido a la tienda ---------- */
  function applyWeb() {
    const F = W.fotos;
    const h = $("#heroImg");
    if (h) { h.src = U(F.hero, 900); h.srcset = own(F.hero) ? "" : `${U(F.hero, 400)} 400w, ${U(F.hero, 900)} 900w, ${U(F.hero, 1600)} 1600w`; setTag(h, F.hero); }
    const sec = $(".collage .c2 img");
    if (sec) { sec.src = U(F.heroSec, 400); sec.srcset = own(F.heroSec) ? "" : `${U(F.heroSec, 400)} 1x, ${U(F.heroSec, 800)} 2x`; setTag(sec, F.heroSec); }
    $$(".blob image").forEach(i => i.setAttribute("href", U(F.mesa, 800)));
    const mp = $(".m-photo .tag"); if (mp) mp.hidden = own(F.mesa);
    $$("[data-txt]").forEach(e => { const v = W.textos[e.dataset.txt]; if (v != null) e.textContent = v; });
    // Historias del finde: siempre desde el menú actual
    if (typeof STORIES !== "undefined") {
      const it = S.menu.slice(0, 4);
      STORIES[0].slides = !it.length ? [{ img: F.hero, h: "Menú del finde", p: "Muy pronto vas a ver acá el próximo menú.", cta: ["Ver tortas por encargo", "tortas"] }] : it.map((m, i) => ({ img: m.img, h: m.nombre, p: `${plata(m.precio)} la porción` + (i === it.length - 1 ? ` · ${W.textos.cierre}` : ""), cta: i === it.length - 1 ? ["Reservar porciones", "finde"] : undefined }));
    }
  }
  function setTag(imgEl, ref) { const t = imgEl.parentElement && imgEl.parentElement.querySelector(".tag"); if (t) t.hidden = own(ref); }
  const visibles = () => W.tortas.filter(t => t.visible);
  const destacadas = () => visibles().filter(t => t.destacada);

  /* ---------- Diálogo de edición propio ---------- */
  let dlg;
  function dialog() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.id = "dEd"; dlg.className = IS_DESK() ? "modal wide ed" : "sheet ed";
    dlg.setAttribute("aria-labelledby", "edTitle");
    dlg.innerHTML = `${IS_DESK() ? "" : '<div class="grab" aria-hidden="true"></div>'}
      <div class="sh-head m-head"><h2 id="edTitle"></h2><button class="x" data-close aria-label="Cerrar">×</button></div>
      <div class="sh-body m-body" id="edBody"></div>
      <div class="sh-foot m-foot" id="edFoot"></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("cancel", e => { e.preventDefault(); closeSheet(dlg); });
    dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-close]")) closeSheet(dlg); });
    dlg.addEventListener("close", () => { if (pendiente) { syncFromStorage(); refresh(); } });
    return dlg;
  }
  function confirmar(titulo, texto, si, fn) {
    const d = dialog();
    $("#edTitle").textContent = titulo;
    $("#edBody").innerHTML = `<p class="muted">${esc(texto)}</p>`;
    $("#edFoot").innerHTML = `<div class="ed-acts"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="edSi">${esc(si)}</button></div>`;
    $("#edSi").onclick = () => { closeSheet(d); fn(); };
    if (!d.open) openSheet(d);
  }

  /* ---------- Editor de una torta ---------- */
  function editarTorta(id) {
    const orig = id ? W.tortas.find(t => t.id === id) : null;
    const t = orig ? structuredClone(orig) : { id: "t" + Date.now().toString(36), nombre: "", linea: "Clásica", oc: ["cumple"], extra: 0, img: "", alt: "", desc: "", visible: true, destacada: false };
    const d = dialog();
    $("#edTitle").textContent = orig ? "Editar torta" : "Nueva torta";
    const render = () => {
      $("#edBody").innerHTML = `
        <div class="ed-photo">${t.img ? img(t.img, t.nombre, 600, true) : '<div class="ed-empty">Sin foto todavía</div>'}
          <button class="btn ghost" id="edPic" type="button">${t.img ? "Cambiar foto" : "Subir foto"}</button></div>
        <div class="campo"><label for="edN">Nombre de la torta</label><input id="edN" maxlength="40" value="${esc(t.nombre)}" placeholder="Ej.: Vintage de frutillas" required></div>
        <fieldset class="fieldset"><legend>Estilo</legend><div class="opts two">${ESTILOS_T.map(e => `<div class="opt"><input type="radio" name="edE" id="edE${e}" value="${e}" ${t.linea === e ? "checked" : ""}><label for="edE${e}">${e}</label></div>`).join("")}</div></fieldset>
        <fieldset class="fieldset"><legend>¿Para qué ocasiones?</legend><div class="ed-chips">${OCASIONES.slice(1).map(([k, v]) => `<label class="ed-chip"><input type="checkbox" value="${k}" ${t.oc.includes(k) ? "checked" : ""}><span>${v}</span></label>`).join("")}</div></fieldset>
        <div class="campo"><label for="edX">Recargo sobre el precio base (decoración)</label><input id="edX" type="number" inputmode="numeric" min="0" step="500" value="${t.extra}">
          <div class="hint"><span id="edDesde">Base chica (10 porc.) ${plata(TAMANOS[0].precio)} + recargo = desde ${plata(TAMANOS[0].precio + (+t.extra || 0))}</span></div></div>
        <div class="campo"><label for="edD">Descripción corta</label><textarea id="edD" rows="2" maxlength="140" placeholder="Ej.: Volados de crema y frutillas frescas.">${esc(t.desc)}</textarea><div class="hint"><span>Máximo 140 caracteres</span></div></div>
        <p class="ed-err" id="edErr" role="alert" hidden></p>`;
      $("#edPic").onclick = async () => { const p = await pickPhoto(); if (p) { read(); t.img = p; render(); } };
      $("#edX").oninput = () => { $("#edDesde").textContent = `Base chica (10 porc.) ${plata(TAMANOS[0].precio)} + recargo = desde ${plata(TAMANOS[0].precio + Math.max(0, +$("#edX").value || 0))}`; };
    };
    const read = () => {
      t.nombre = $("#edN").value.trim(); t.linea = ($("input[name=edE]:checked") || {}).value || "Clásica";
      t.oc = $$(".ed-chips input:checked").map(i => i.value); t.extra = Math.max(0, Math.round(+$("#edX").value || 0)); t.desc = $("#edD").value.trim(); t.alt = t.nombre;
    };
    render();
    $("#edFoot").innerHTML = `<div class="ed-acts">${orig ? '<button class="btn ghost danger" id="edDel">Eliminar</button>' : '<button class="btn ghost" data-close>Cancelar</button>'}<button class="btn" id="edOk">${orig ? "Guardar cambios" : "Agregar torta"}</button></div>`;
    $("#edOk").onclick = () => {
      read();
      const err = !t.nombre ? "Poné un nombre para la torta." : !t.oc.length ? "Elegí al menos una ocasión." : !t.img ? "Subí una foto: es lo que más vende." : "";
      if (err) { const e = $("#edErr"); e.textContent = err; e.hidden = false; return; }
      const existe = W.tortas.some(x => x.id === t.id);
      const ok = commit(() => { const cur = W.tortas.find(x => x.id === t.id); if (cur) Object.assign(cur, structuredClone(t)); else W.tortas.unshift(structuredClone(t)); },
        existe ? "Torta guardada ✓" : "Torta agregada ✓ Ya se ve en tu web");
      if (ok) closeSheet(d);
    };
    if (orig) $("#edDel").onclick = () => {
      confirmar("¿Eliminar esta torta?", `“${orig.nombre}” deja de verse en tu web. Si preferís, podés ocultarla en vez de eliminarla.`, "Sí, eliminar", () => {
        const i = W.tortas.findIndex(x => x.id === t.id); if (i < 0) return; const quitada = W.tortas[i];
        commit(() => { const k = W.tortas.findIndex(x => x.id === quitada.id); if (k >= 0) W.tortas.splice(k, 1); }, "Torta eliminada", () => commit(() => W.tortas.splice(Math.min(i, W.tortas.length), 0, quitada), "Torta recuperada ✓"));
      });
    };
    if (!d.open) openSheet(d);
  }

  /* ---------- Nueva porción del finde ---------- */
  function nuevaPorcion() {
    const p = { id: "p" + Date.now().toString(36), nombre: "", precio: "", stock: 12, res: 0, img: "" };
    const d = dialog(); $("#edTitle").textContent = "Nueva porción del finde";
    const render = () => {
      $("#edBody").innerHTML = `
        <div class="ed-photo">${p.img ? img(p.img, "", 600, true) : '<div class="ed-empty">Sin foto todavía</div>'}<button class="btn ghost" id="edPic" type="button">${p.img ? "Cambiar foto" : "Subir foto"}</button></div>
        <div class="campo"><label for="pN">Nombre</label><input id="pN" maxlength="40" value="${esc(p.nombre)}" placeholder="Ej.: Chocotorta"></div>
        <div class="opts two" style="gap:12px">
          <div class="campo"><label for="pP">Precio por porción</label><input id="pP" type="number" inputmode="numeric" min="0" step="100" value="${p.precio}" placeholder="Ej.: 5000"></div>
          <div class="campo"><label for="pS">¿Cuántas porciones hacés?</label><input id="pS" type="number" inputmode="numeric" min="1" step="1" value="${p.stock}"></div>
        </div>
        <p class="ed-err" id="edErr" role="alert" hidden></p>`;
      $("#edPic").onclick = async () => { const f = await pickPhoto(); if (f) { read(); p.img = f; render(); } };
    };
    const read = () => { p.nombre = $("#pN").value.trim(); p.precio = $("#pP").value; p.stock = $("#pS").value; };
    render();
    $("#edFoot").innerHTML = `<div class="ed-acts"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="edOk">Agregar al menú</button></div>`;
    $("#edOk").onclick = () => {
      read(); const precio = Math.round(+p.precio), stock = Math.round(+p.stock);
      const err = !p.nombre ? "Poné el nombre de la porción." : !(precio > 0) ? "Poné el precio por porción." : !(stock > 0) ? "Indicá cuántas porciones hacés." : !p.img ? "Subí una foto de la porción." : "";
      if (err) { const e = $("#edErr"); e.textContent = err; e.hidden = false; return; }
      if (commit(() => S.menu.push({ id: p.id, nombre: p.nombre, precio, stock, res: 0, img: p.img }), "Porción agregada ✓ Ya está en el menú")) closeSheet(d);
    };
    if (!d.open) openSheet(d);
  }

  /* ---------- Pestaña "Menú del finde" (tortas del día) ---------- */
  function renderMenuEditor() {
    const box = $("#stocks"); if (!box) return;
    box.classList.add("ed-menu");
    box.innerHTML = `
      <div class="ed-card">
        <h3>Fechas de este finde</h3>
        <div class="campo"><label for="eFecha">Días que se muestran</label><input id="eFecha" maxlength="40" value="${esc(W.textos.fecha)}"></div>
        <div class="campo" style="margin:0"><label for="eCierre">Hasta cuándo se reserva</label><input id="eCierre" maxlength="50" value="${esc(W.textos.cierre)}"><div class="hint"><span>Cambia el texto que ven tus clientas. En el boceto los horarios de retiro siguen fijos.</span></div></div>
      </div>
      <div class="ed-card">
        <div class="ed-h"><h3>Porciones del menú</h3><span class="muted small">${S.menu.length} en total</span></div>
        <ul class="ed-list">${S.menu.map((m, i) => `
          <li class="ed-row" data-id="${m.id}">
            <button class="ed-thumb" data-pic="${m.id}" aria-label="Cambiar foto de ${esc(m.nombre)}">${img(m.img, "", 120)}<span>Cambiar</span></button>
            <div class="ed-fields">
              <label class="sr" for="n-${m.id}">Nombre</label><input class="ed-in" id="n-${m.id}" data-f="nombre" value="${esc(m.nombre)}" maxlength="40">
              <div class="ed-line">
                <label class="ed-price"><span>$</span><input class="ed-in" data-f="precio" type="number" inputmode="numeric" min="1" step="100" value="${m.precio}" aria-label="Precio de ${esc(m.nombre)}"></label>
                <span class="stepper" role="group" aria-label="Porciones de ${esc(m.nombre)}"><button data-sm="${m.id}" aria-label="Una porción menos" ${m.stock <= m.res ? "disabled" : ""}>−</button><output>${m.stock}</output><button data-sp="${m.id}" aria-label="Una porción más">+</button></span>
              </div>
              <small class="muted">${m.res} reservadas · quedan ${Math.max(0, m.stock - m.res)}</small>
            </div>
            <div class="ed-ord">
              <button data-up="${m.id}" aria-label="Subir ${esc(m.nombre)}" ${i === 0 ? "disabled" : ""}>↑</button>
              <button data-down="${m.id}" aria-label="Bajar ${esc(m.nombre)}" ${i === S.menu.length - 1 ? "disabled" : ""}>↓</button>
              <button data-del="${m.id}" class="danger" aria-label="Quitar ${esc(m.nombre)} del menú" ${m.res ? 'disabled title="Tiene reservas: no se puede quitar"' : ""}>🗑</button>
            </div>
          </li>`).join("")}</ul>
        <button class="btn block" id="eAdd">+ Agregar porción</button>
      </div>`;
  }
  function onMenuClick(e) {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "eAdd") return nuevaPorcion();
    const id = b.dataset.pic || b.dataset.sp || b.dataset.sm || b.dataset.up || b.dataset.down || b.dataset.del;
    const i = S.menu.findIndex(m => m.id === id), m = S.menu[i]; if (!m) return;
    const refocus = sel => { const f = $(sel); if (f && !f.disabled) { f.focus(); return true; } return false; };
    if (b.dataset.pic) { pickPhoto().then(p => { if (p) commit(() => { const x = S.menu.find(y => y.id === id); if (x) x.img = p; }, "Foto cambiada ✓"); }); return; }
    if (b.dataset.sp) { commit(() => { const x = mt(id); if (x) x.stock++; }); refocus(`[data-sp="${id}"]`); }
    if (b.dataset.sm && m.stock > m.res) { commit(() => { const x = mt(id); if (x && x.stock > x.res) x.stock--; }); refocus(`[data-sm="${id}"]`) || refocus(`[data-sp="${id}"]`); }
    if (b.dataset.up && i > 0) { commit(() => { const k = S.menu.findIndex(x => x.id === id); if (k > 0) S.menu.splice(k - 1, 0, S.menu.splice(k, 1)[0]); }); refocus(`[data-up="${id}"]`) || refocus(`[data-down="${id}"]`); }
    if (b.dataset.down && i < S.menu.length - 1) { commit(() => { const k = S.menu.findIndex(x => x.id === id); if (k >= 0 && k < S.menu.length - 1) S.menu.splice(k + 1, 0, S.menu.splice(k, 1)[0]); }); refocus(`[data-down="${id}"]`) || refocus(`[data-up="${id}"]`); }
    if (b.dataset.del && !m.res) confirmar("¿Quitar del menú?", `“${m.nombre}” deja de verse en el menú del finde.`, "Sí, quitar", () => {
      const j = S.menu.findIndex(x => x.id === id); if (j < 0) return;
      commit(() => { const k = S.menu.findIndex(x => x.id === id); if (k >= 0 && !S.menu[k].res) S.menu.splice(k, 1); delete S.carrito[id]; }, "Porción quitada", () => commit(() => S.menu.splice(Math.min(j, S.menu.length), 0, m), "Porción recuperada ✓"));
    });
  }
  function onMenuChange(e) {
    const el = e.target;
    if (el.id === "eFecha" || el.id === "eCierre") {
      const k = el.id === "eFecha" ? "fecha" : "cierre", v = el.value.trim();
      if (!v) { el.value = W.textos[k]; return toast("Ese dato no puede quedar vacío."); }
      if (!commit(() => W.textos[k] = v, "Guardado ✓")) el.value = W.textos[k]; return;
    }
    const row = el.closest(".ed-row"); if (!row) return;
    const m = S.menu.find(x => x.id === row.dataset.id); if (!m) return;
    if (el.dataset.f === "nombre") { const v = el.value.trim(); if (!v) { el.value = m.nombre; return toast("El nombre no puede quedar vacío."); } commit(() => { const x = mt(row.dataset.id); if (x) x.nombre = v; }, "Guardado ✓"); }
    if (el.dataset.f === "precio") { const v = Math.round(+el.value); if (!(v > 0)) { el.value = m.precio; return toast("Poné un precio mayor a cero."); } commit(() => { const x = mt(row.dataset.id); if (x) x.precio = v; }, "Guardado ✓"); }
  }

  /* ---------- Pestaña "Mi web" ---------- */
  function renderWebEditor() {
    const box = $("#webEd"); if (!box) return;
    const F = W.fotos;
    const foto = (k, titulo, nota) => `<div class="ed-pic">
        <div class="ed-pic-img">${img(F[k], titulo, 600)}<span class="tag">${own(F[k]) ? "Foto cargada" : "Foto ilustrativa"}</span></div>
        <div><b>${titulo}</b>${nota ? `<small class="muted">${nota}</small>` : ""}<button class="btn ghost" data-foto="${k}">Cambiar foto</button></div></div>`;
    box.innerHTML = `
      <p class="ed-note" role="note">Lo que cambies acá se ve al instante en tu web. <b>En este boceto</b> los cambios se guardan solo en este navegador; en la versión real se publican para todas tus clientas.</p>
      <div class="ed-card"><h3>Portada</h3>
        ${foto("hero", "Foto principal", "La primera que ven tus clientas")}
        ${foto("heroSec", "Foto chica", "Solo se ve en computadora")}
        <div class="campo" style="margin:14px 0 0"><label for="eSub">Frase debajo del título</label><textarea id="eSub" rows="3" maxlength="120">${esc(W.textos.sub)}</textarea><div class="hint"><span>Máximo 120 caracteres</span></div></div>
      </div>
      <div class="ed-card">
        <div class="ed-h"><h3>Tortas por encargo</h3><button class="btn" id="eNueva">+ Nueva torta</button></div>
        <p class="muted small" style="margin-bottom:10px">★ = aparece en la portada · el ojo la muestra u oculta de tu web.</p>
        <ul class="ed-list">${W.tortas.map(t => `
          <li class="ed-row t${t.visible ? "" : " off"}">
            <span class="ed-thumb">${img(t.img, "", 120)}</span>
            <div class="ed-fields"><b>${esc(t.nombre)}</b><small class="muted">${t.linea} · desde ${plata(TAMANOS[0].precio + t.extra)}${t.visible ? "" : " · oculta"}</small></div>
            <div class="ed-ord">
              <button data-star="${t.id}" aria-pressed="${t.destacada}" aria-label="${t.destacada ? "Quitar de la portada" : "Mostrar en la portada"}: ${esc(t.nombre)}">${t.destacada ? "★" : "☆"}</button>
              <button data-vis="${t.id}" aria-pressed="${t.visible}" aria-label="${t.visible ? "Ocultar" : "Mostrar"} ${esc(t.nombre)}">${t.visible ? "👁" : "🚫"}</button>
              <button data-edit="${t.id}" class="ed-edit">Editar</button>
            </div>
          </li>`).join("")}</ul>
      </div>
      <div class="ed-card"><h3>Mesa dulce</h3>${foto("mesa", "Foto de la sección", "")}</div>
      <div class="ed-card ed-end">
        <button class="btn block" id="eVer">Ver cómo quedó mi web</button>
        <button class="btn ghost block" id="eReset">Restaurar el contenido original</button>
      </div>`;
  }
  function onWebClick(e) {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "eNueva") return editarTorta(null);
    if (b.id === "eVer") return (typeof goTienda === "function") && goTienda();
    if (b.id === "eReset") return confirmar("¿Restaurar el contenido original?", "Vuelven las fotos, tortas y textos del boceto. Tus pedidos no se tocan.", "Sí, restaurar", () => {
      const prev = structuredClone(W);
      commit(() => Object.assign(W, freshWeb()), "Contenido restaurado", () => commit(() => Object.assign(W, prev), "Volvió tu contenido ✓"));
    });
    if (b.dataset.foto) { const k = b.dataset.foto; pickPhoto().then(p => { if (p) commit(() => W.fotos[k] = p, "Foto cambiada ✓"); }); return; }
    const t = W.tortas.find(x => x.id === (b.dataset.star || b.dataset.vis || b.dataset.edit)); if (!t) return;
    if (b.dataset.edit) return editarTorta(t.id);
    if (b.dataset.star) { const v = !t.destacada; commit(() => { const x = tt(t.id); if (x) x.destacada = v; }, v ? "Ahora aparece en la portada ★" : "Ya no aparece en la portada"); $(`[data-star="${t.id}"]`)?.focus(); }
    if (b.dataset.vis) { const v = !t.visible; commit(() => { const x = tt(t.id); if (x) x.visible = v; }, v ? "Visible en tu web" : "Oculta: tus clientas no la ven"); $(`[data-vis="${t.id}"]`)?.focus(); }
  }
  function onWebChange(e) {
    if (e.target.id !== "eSub") return;
    const v = e.target.value.trim(); if (!v) { e.target.value = W.textos.sub; return toast("La frase no puede quedar vacía."); }
    if (!commit(() => W.textos.sub = v, "Guardado ✓")) e.target.value = W.textos.sub;
  }

  function refresh() { renderAll(); renderMenuEditor(); renderWebEditor(); }
  function bind() {
    addEventListener("storage", e => {
      if (e.key !== KEY && e.key !== WKEY) return;
      if (document.querySelector("dialog[open]")) { pendiente = true; return; } // se aplica antes del próximo guardado o al cerrar
      syncFromStorage(); refresh(); if (typeof renderPanel === "function" && !document.getElementById("panel").hidden) renderPanel();
    });
    $("#stocks")?.addEventListener("click", onMenuClick);
    $("#stocks")?.addEventListener("change", onMenuChange);
    $("#webEd")?.addEventListener("click", onWebClick);
    $("#webEd")?.addEventListener("change", onWebChange);
  }
  return { applyWeb, visibles, destacadas, renderMenuEditor, renderWebEditor, bind, own, _shrink: shrink };
})();
