// Datos de ejemplo compartidos por index.html (celular) y escritorio.html.
// Reemplazar acá con los datos reales de Miqui.
/* =========================================================
   DATOS DE EJEMPLO — reemplazar con los reales de Miqui
   ========================================================= */
const DEMO_HOY = "2026-11-04";              // miércoles (fecha fija del boceto)
const SENA = 0.5;
const TAMANOS = [
  {id:"s", nombre:"Chica",   porc:"10 porc.", precio:30000},
  {id:"m", nombre:"Mediana", porc:"15 porc.", precio:45000},
  {id:"l", nombre:"Grande",  porc:"25 porc.", precio:65000},
];
const RELLENOS = [
  {id:"ddl",  nombre:"Dulce de leche", extra:0},
  {id:"choc", nombre:"Chocolate",      extra:0},
  {id:"fr",   nombre:"Frutos rojos",   extra:4000},
  {id:"oreo", nombre:"Oreo",           extra:3000},
  {id:"lim",  nombre:"Crema de limón", extra:2000},
];
const TORTAS = [
  {id:"corazon", nombre:"Corazón red velvet", linea:"Vintage", oc:["cumple","aniversario"], extra:8000, img:"1771129859451-26dd3fa2e757", alt:"Torta con forma de corazón, de red velvet", desc:"Forma de corazón, manga vintage y el texto que quieras."},
  {id:"perlas",  nombre:"Vintage rosa con perlas", linea:"Vintage", oc:["cumple","boda"], extra:10000, img:"1778447849704-913b5e8a5695", alt:"Torta rosa con rosa de crema y perlas", desc:"Volados de crema, perlas y una flor de manga arriba."},
  {id:"frutillas", nombre:"Frutillas y crema", linea:"Clásica", oc:["cumple"], extra:0, img:"1602663491496-73f07481dbea", alt:"Torta blanca con frutillas", desc:"Clásica, fresca y con frutillas de estación."},
  {id:"glase",   nombre:"Chocolate glaseada", linea:"Clásica", oc:["cumple"], extra:0, img:"1615796701805-2094ac54bbf9", alt:"Torta de chocolate con glaseado blanco", desc:"Bizcochuelo de chocolate con glaseado arriba."},
  {id:"helada",  nombre:"Pastel celeste", linea:"Vintage", oc:["cumple","aniversario"], extra:8000, img:"1547736719-3663a61ac4bb", alt:"Torta en tonos pastel", desc:"Tonos pastel a elección, decoración suave."},
  {id:"mini",    nombre:"Mini corazón", linea:"Vintage", oc:["aniversario"], extra:2000, img:"1762950350879-650b940db566", alt:"Mini torta decorada con corazones", desc:"Para regalar: chiquita, con corazones y mensaje."},
  {id:"intensa", nombre:"Chocolate intensa", linea:"Clásica", oc:["cumple","aniversario"], extra:3000, img:"1607257882338-70f7dd2ae344", alt:"Torta de chocolate con salsa de chocolate", desc:"Para los fans del chocolate, con baño brillante."},
];
const OCASIONES = [["todas","Todas"],["cumple","Cumple"],["aniversario","Aniversario"],["boda","Boda"]];
const MENU0 = [
  {id:"cheese", nombre:"Cheesecake de frutos rojos", precio:5500, stock:20, res:14, img:"1578775887804-699de7086ff9"},
  {id:"choco",  nombre:"Torta de chocolate",        precio:5000, stock:24, res:9,  img:"1579372786545-d24232daf58c"},
  {id:"capas",  nombre:"Crema y frutos rojos",      precio:5200, stock:18, res:4,  img:"1778447964490-8e52582f081c"},
  {id:"cara",   nombre:"Caramelo y nuez",           precio:5200, stock:16, res:16, img:"1547414368-ac947d00b91d"},
  {id:"tarta",  nombre:"Tarta de frutillas",        precio:4800, stock:16, res:11, img:"1565467988204-44fc3fd3c726"},
  {id:"clasico",nombre:"Cheesecake clásico",        precio:5000, stock:20, res:6,  img:"1676300185983-d5f242babe34"},
];
const FRANJAS = [
  {id:"s1", dia:"2026-11-07", txt:"Sáb 7 · 10 a 13 h", cupo:10, usados:6},
  {id:"s2", dia:"2026-11-07", txt:"Sáb 7 · 16 a 19 h", cupo:10, usados:9},
  {id:"d1", dia:"2026-11-08", txt:"Dom 8 · 10 a 13 h", cupo:10, usados:3},
  {id:"d2", dia:"2026-11-08", txt:"Dom 8 · 16 a 19 h", cupo:10, usados:10},
];
const MESAS = [
  {id:"petits", nombre:"Petits surtidos", piezas:"24 piezas", desde:28000, img:"1769812343484-df7391e843d6", alt:"Torre de postres pequeños"},
  {id:"cupcakes", nombre:"Cupcakes decorados", piezas:"12 unidades", desde:22000, img:"1572490364833-3b29873fd749", alt:"Bandeja de cupcakes"},
  {id:"completa", nombre:"Mesa dulce completa", piezas:"Torta + 60 piezas", desde:120000, img:"1764380746818-18c01e96df12", alt:"Mesa con cupcakes y postres"},
];
const STORIES = [
  {nombre:"Menú del finde", nuevo:true, slides:[
    {img:"1578775887804-699de7086ff9", h:"Cheesecake de frutos rojos", p:"$5.500 la porción"},
    {img:"1579372786545-d24232daf58c", h:"Torta de chocolate", p:"$5.000 la porción"},
    {img:"1778447964490-8e52582f081c", h:"Crema y frutos rojos", p:"$5.200 la porción"},
    {img:"1565467988204-44fc3fd3c726", h:"Tarta de frutillas", p:"Reservás hasta el jueves 5, 20 h", cta:["Reservar porciones","finde"]},
  ]},
  {nombre:"Corazones", slides:[
    {img:"1771129859451-26dd3fa2e757", h:"Corazón red velvet", p:"Desde $38.000"},
    {img:"1762950350879-650b940db566", h:"Mini corazón", p:"Para regalar", cta:["Armar mi torta","tortas"]},
  ]},
  {nombre:"Mesa dulce", slides:[
    {img:"1764380746818-18c01e96df12", h:"Mesas armadas", p:"Para cumples y eventos"},
    {img:"1769812343484-df7391e843d6", h:"Petits surtidos", p:"Contale tu idea", cta:["Ver opciones","mesa"]},
  ]},
  {nombre:"Cómo pedir", slides:[
    {img:"1549590143-d5855148a9d5", h:"Elegís y reservás", p:"Ves el precio y los días con lugar"},
    {img:"1732565649629-eb4932a1ec09", h:"Miqui lo prepara", p:"Y te avisa por WhatsApp cuando está listo", cta:["Elegí tu torta","tortas"]},
  ]},
];
// Pedidos de ejemplo (aparecen en el panel)
const PEDIDOS0 = [
  {id:1, tipo:"torta", dia:"2026-11-04", hora:"17 h", cliente:"Carla", tel:"11 5555 0001", item:"Corazón red velvet · mediana", total:53000, pagado:26500, estado:1, img:"1771129859451-26dd3fa2e757", brief:{Tamaño:"Mediana (15 porc.)",Relleno:"Dulce de leche",Texto:"Feliz cumple Juli",Colores:"Rojo y blanco"}},
  {id:2, tipo:"finde", dia:"2026-11-07", hora:"10–13 h", cliente:"Lucas", tel:"11 5555 0002", item:"3 Cheesecake de frutos rojos, 2 Caramelo y nuez", items:{cheese:3,cara:2}, total:26900, pagado:26900, estado:0, img:"1578775887804-699de7086ff9"},
  {id:3, tipo:"torta", dia:"2026-11-07", hora:"16–19 h", cliente:"Ana", tel:"11 5555 0003", item:"Vintage rosa con perlas · grande", total:79000, pagado:39500, estado:0, img:"1778447849704-913b5e8a5695", brief:{Tamaño:"Grande (25 porc.)",Relleno:"Frutos rojos",Texto:"Mis 15",Colores:"Rosa empolvado"}},
  {id:4, tipo:"finde", dia:"2026-11-08", hora:"10–13 h", cliente:"Flor", tel:"11 5555 0004", item:"4 Torta de chocolate", items:{choco:4}, total:20000, pagado:0, estado:0, img:"1579372786545-d24232daf58c"},
  {id:5, tipo:"finde", dia:"2026-11-08", hora:"16–19 h", cliente:"Sofi", tel:"11 5555 0005", item:"2 Tarta de frutillas, 2 Cheesecake clásico", items:{tarta:2,clasico:2}, total:19600, pagado:19600, estado:0, img:"1565467988204-44fc3fd3c726"},
];
const ESTADOS = ["Nuevo","En preparación","Lista para retirar","Entregada"];
const ACCION  = ["Empezar","Marcar lista","Entregada ✓",null];

