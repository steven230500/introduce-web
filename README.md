# introduce-web

Landing de [Introduce](https://github.com/steven230500/introduce-church), el
software de proyección para iglesias.

HTML y CSS a mano, sin build, sin dependencias. Se abre `index.html` en el
navegador y ya está: lo que se ve en local es exactamente lo que se publica.

La página es un domingo visto desde la consola. Arriba, una pantalla de
proyección que se maneja con las mismas teclas de la app (← →, B, 1 a 3).
Abajo, el día por horas: claro mientras se prepara y después del culto,
oscuro mientras las luces del templo están bajas. Una sola tipografía,
Archivo, usada en todo su ancho: ancha para lo que se lee desde atrás,
angosta para el reloj.

```
index.html      la página en español
en/index.html   la misma página en inglés
styles.css      un archivo, ordenado por sección
demo.js         la pantalla de arriba; los textos vienen de cada página
guias/          guías paso a paso en español, una carpeta por guía
404.html        lo que ve quien llega a una dirección que no existe
robots.txt      para los buscadores, con la dirección del sitemap
sitemap.xml     las dos páginas y sus idiomas
assets/         capturas de la app (WebP), el ícono y las imágenes para compartir
tools/shot.mjs  capturas de la página, para revisar un cambio de diseño
tools/og.mjs    genera assets/og-es.png y og-en.png desde tools/og.html
```

## Al publicar una versión nueva de la app

- `softwareVersion` en el bloque `application/ld+json` de las dos páginas, y
  "Versión 1.0.0" en la sección de descargas.
- `lastmod` en `sitemap.xml` cuando cambie el contenido.
- Si cambia el título, `node tools/og.mjs` para rehacer las imágenes para
  compartir.
- Una captura nueva: `cwebp -q 82 -m 6 captura.png -o captura.webp`.

## Verla

```bash
open index.html
# o, si hace falta servirla por HTTP:
python3 -m http.server 4321
```

Para revisar un cambio de diseño sin estar mirando la ventana:

```bash
npm i -D playwright && npx playwright install chromium
node tools/shot.mjs        # página completa a 1280
node tools/shot.mjs 420    # a ancho de teléfono
```

## Publicarla

Es estática, así que sirve cualquier cosa que entregue archivos.

**Cloudflare Pages o Netlify.** Conectar el repo, sin comando de build, carpeta
raíz. Es la opción con menos partes que se pueden romper.

**El droplet, detrás de Caddy.** Copiar la carpeta y agregar el bloque:

```
introduce.tudominio.com {
    root * /var/www/introduce-web
    file_server
    encode gzip
}
```

## Actualizar las capturas

Salen de la app real, no de un mockup. Están en el otro repo, en
`docs/screenshots/`, y se copian aquí:

```bash
cp ../introduce_church/docs/screenshots/{panel-principal,editor-capas,avisos,biblia}.png assets/
```

Después conviene bajarlas de tamaño, porque salen a 2x de una pantalla Retina:

```bash
for f in assets/*.png; do sips -Z 1600 "$f"; done
```

## Los enlaces de descarga

El botón de macOS apunta a la última release de GitHub del repo de la app. Para
que descargue algo hay que publicar el `.zip` que produce `make dist-mac` como
release ahí. Windows, Linux y la app de control están marcados como
*Próximamente* y no llevan enlace todavía.
