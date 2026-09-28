# Cambios comunes — María Nails (sitio estático)

Todo se edita en código y se publica con push (deploy automático).
Flujo siempre igual:

```bash
npm run dev    # ver el cambio en local
npm run build  # verificar que compila
git push       # publicar
```

---

## 1. Cambiar un precio

**Archivo**: `src/data/officialCatalog.ts`

- Servicio base (manicura, gel, pedicura...): busca en `OFFICIAL_SERVICES` y cambia `price`.
- Acrílico: busca el estilo en `ACRYLIC_STYLES` y cambia el número del largo (`prices: { 1, 2, ... 8 }`).

El catálogo (`/precios`), el inicio y el asistente virtual se actualizan solos.

## 2. Cambiar teléfono, dirección o Instagram

**Archivo**: `src/data/officialCatalog.ts` → objeto `BUSINESS_INFO`

- `phoneDisplay`: se muestra en textos (ej: `829-338-8282`).
- `whatsappUrl`: link de reserva (ej: `https://wa.me/18293388282`). Si cambia el número,
  cambia ambas.
- `instagramUrl`: destino de `/galeria` y botón del Footer.
- `addressLine1`, `addressLine2`, `mapsUrl`, `contactEmail`.

## 3. Cambiar textos (hero, sobre mí, footer, pagos)

**Archivo**: `src/data/officialCatalog.ts` → objeto `STATIC_PROFILE`

- `heroTitle`, `heroSubtitle` (portada del inicio)
- `aboutTitle`, `aboutDescription` (inicio + `/sobre-mi`; usa `\n` para párrafos)
- `footerDescription`, `paymentDetails`

## 4. Cambiar foto de perfil o logo

1. Optimiza la foto: JPG, logo máx. 512px de ancho, perfil máx. 1080px.
2. Reemplaza `public/images/maria-perfil.jpg` o `public/images/logo.jpg` **con el mismo nombre**.
3. Guarda los originales en `FOTOS/` (no se publican).

Si prefieres otro nombre de archivo, actualiza `SITE_IMAGES` en `officialCatalog.ts`.
Con valor `null` se muestra el diseño por defecto (iniciales / placeholder / sección oculta).

## 5. Cambiar un mensaje de WhatsApp

**Archivo**: `src/data/whatsappTemplates.ts`

- `waLink(mensaje)` arma el link; `WHATSAPP_TEMPLATES` tiene `bienvenida`, `nailArt`, `direccion`.
- Los botones de reserva en Home/Precios/Acrílico escriben su mensaje inline donde se usan.

## 6. Actualizar fotos de trabajos

Publica en Instagram (`https://www.instagram.com/____marianails/`). No hay nada que
cambiar en el código: `/galeria` redirige ahí.

## 7. Personalizar estilos

- Colores y tema: `tailwind.config.js` + clases en los componentes.
- Estilos globales: `src/index.css`.
- El diseño usa rosa/púrpura como identidad; Header, hero y asistente comparten esa paleta.

## 8. Cambiar una respuesta del asistente virtual

**Archivo**: `src/components/AIAssistant.tsx` → función `getBotReply(input)`

Agrega o ajusta una condición por palabras clave y su texto de respuesta.
Los botones rápidos están en la constante `QUICK`.

---

## Ideas futuras (opcionales)

- Formulario de reserva con calendario que genere el mensaje de WhatsApp (sin backend).
- Galería con fotos locales seleccionadas + link a Instagram.
- Página de promociones del mes.
- Modo claro/oscuro.

---

## Soporte

1. **Resumen**: `README.md`
2. **Arquitectura**: `DOCUMENTATION.md`
3. **Publicar**: `DEPLOY_PRODUCCION.md`
