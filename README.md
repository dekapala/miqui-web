# Miqui Pastelería · versión B

Web estática con vistas para celular y escritorio. La publicación incluye solamente `boceto-b/`; la versión A y los planes quedan fuera de `dist/`.

## Cloudflare Pages (GitHub)

Conectar el repositorio desde Workers & Pages → Create application → Pages → Import an existing Git repository.

| Opción | Valor |
| --- | --- |
| Rama de producción | La rama donde se subió esta versión |
| Framework preset | None |
| Root directory | Raíz del repositorio (vacío) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node | 22 o superior |

No requiere secretos, base de datos ni Pages Functions para mostrar el prototipo. El build no tiene dependencias y comprueba sintaxis JavaScript, recursos locales y límite de tamaño de archivos.

## Cloudflare Workers (alternativa)

El archivo `wrangler.jsonc` configura los archivos estáticos. En Workers Builds usar `npm run build` como build command y `npx wrangler deploy` como deploy command. Para Pages usar la configuración de la tabla anterior; no ejecutar `wrangler deploy`.

## Verificación local

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Abrir `http://localhost:8080`. A partir de 1024 px se abre la vista escritorio. Para forzar una vista: `/?v=movil` o `/escritorio.html?v=escritorio`. `#panel` abre el panel del prototipo.

## Alcance funcional actual

Es un boceto navegable, todavía no un sistema de ventas en producción:

- Catálogo, configurador, carrito, menú y panel funcionan en el navegador.
- Contenido, fotos y pedidos se guardan en `localStorage` del mismo navegador y origen. No se comparten entre clientes ni dispositivos. Cambiar de dominio no migra los datos.
- El panel no tiene autenticación. No introducir datos reales de clientes.
- WhatsApp y confirmaciones están simulados: no se envían mensajes ni se reciben pedidos en un servidor.
- Fechas, pedidos, precios y disponibilidad son datos de demostración, con fecha base fija del 4 de noviembre de 2026.
- La referencia de una torta registra el nombre del archivo; no lo sube.
- Fuentes de Google y fotos de Unsplash requieren acceso a esos servicios.

Para operar con pedidos reales falta implementar autenticación, almacenamiento compartido, control de stock en servidor, carga de imágenes y WhatsApp con el número real de Miqui. Alojar este prototipo en Cloudflare no agrega esas funciones automáticamente.

Documentación: [Pages estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).
