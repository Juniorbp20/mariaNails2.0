# María Nails — Documentación técnica

Sitio 100% estático (React 18 + TypeScript + Vite 5 + Tailwind), sin base de datos ni backend.
Reservas por WhatsApp, galería en Instagram.

## Arquitectura

```
Navegador → Build estático (dist/) → WhatsApp (reservas) / Instagram (fotos)
```

No hay servidor, ni API, ni variables de entorno. Todo el contenido vive en el código,
con `src/data/officialCatalog.ts` como fuente única de verdad.

## Páginas (`src/pages/`)

| Archivo | Ruta | Qué hace |
|---|---|---|
| `Home.tsx` | `/` | Hero con reserva, 3 beneficios, sobre María, 4 servicios destacados, imagen de catálogo (si existe) |
| `Gallery.tsx` | `/galeria` | Puente a Instagram: explica que las fotos están ahí + CTA grande + reserva por WhatsApp |
| `About.tsx` | `/sobre-mi` | Perfil de María, valores y tarjeta de contacto del salón |
| `PriceCatalog.tsx` | `/precios` | Tabs Manicura / Gel y Pedicura / Acrílico #1-#8 / Nail Art / Info + políticas |
| `NotFound.tsx` | `*` | Página 404 |

## Componentes (`src/components/`)

| Archivo | Uso |
|---|---|
| `Header.tsx` | Navegación + logo estático (`SITE_IMAGES.logo`, fallback a iniciales) |
| `Footer.tsx` | Ubicación, contacto, pagos, botones Instagram + WhatsApp |
| `WhatsAppFloat.tsx` | Botón flotante verde con mensaje de reserva pre-llenado |
| `AIAssistant.tsx` | Chat local por palabras clave (precios, acrílico, dirección, pagos...). Sin IA externa ni costo |
| `AcrylicPriceTable.tsx` | Selector de largo #1-#8 + 6 cards por estilo + tabla completa de 48 precios |
| `PolicyBlocks.tsx` | Cortesías, ubicación, políticas 24h/15min, pagos |
| `ScrollToTop.tsx` | Vuelve arriba al cambiar de ruta |

`App.tsx` monta el router y el layout común (Header, Footer y los dos flotantes en todas las páginas).

## Datos (`src/data/`)

### `officialCatalog.ts` — fuente única de verdad

- `BUSINESS_INFO`: nombre, profesional, tagline, teléfono/WhatsApp, dirección, banco/cuenta,
  `instagramUrl`, `mapsUrl`, `contactEmail`.
- `SITE_IMAGES`: rutas a `/images/...` (`logo`, `profile`, `catalog`). `null` = usar diseño por defecto.
- `STATIC_PROFILE`: textos del hero, "sobre mí", footer y pagos.
- `COURTESIES`: café, tés, jugos, galletas.
- `POLICIES`: canal WhatsApp, cancelación 24h, tolerancia 15 min.
- `ACRYLIC_STYLES`: 6 estilos x 8 largos = 48 precios oficiales (RD$).
- `OFFICIAL_SERVICES`: 8 servicios base con precio y duración.
- Tipos: `AcrylicLength` (1-8), `AcrylicStyleKey`, `AcrylicStyle`, `OfficialServiceSeed`.

### `whatsappTemplates.ts`

- `waLink(mensaje)`: arma links `wa.me` con texto codificado.
- `WHATSAPP_TEMPLATES`: `bienvenida` (asistente), `nailArt`, `direccion`.

## Utilidades y tipos

- `src/utils/catalog.ts`: `getOfficialServices()` (convierte `OFFICIAL_SERVICES` a `Service[]`),
  `findServiceForAcrylic()` (precio oficial por estilo + largo).
- `src/utils/format.ts`: `formatPrice()` (RD$), `formatDuration()`, `toWhatsAppUrl()`.
- `src/types/index.ts`: `Service` (id, nombre, descripción, duración, precio, categoría...).

## Imágenes

- `public/images/logo.jpg` (512px, Header) y `public/images/maria-perfil.jpg` (máx. 1080px,
  Inicio + Sobre mí). Se sirven tal cual desde `dist/`.
- `FOTOS/` guarda los originales en alta resolución. No se publica ni se importa en el código.

## Rutas y SEO

- React Router con rewrite SPA a `index.html` (`vercel.json` / `netlify.toml`).
- `public/sitemap.xml`: `/`, `/galeria`, `/precios`, `/sobre-mi`.
- `public/robots.txt`: permite todo.

## Comandos

```bash
npm run dev        # Desarrollo local
npm run build      # Producción → dist/
npm run preview    # Previsualizar build
npm run typecheck  # tsc --noEmit
```

Nota: `npm run lint` falla por incompatibilidad preexistente del toolchain
(eslint 9.39 + `@typescript-eslint`), no relacionada con el código.

## Historial relevante

El proyecto pasó por una etapa con Supabase (tablas, panel `/admin`, Edge Functions),
eliminada por completo: sin `src/services/`, sin `src/lib/supabase.ts`, sin dependencias
de `@supabase/supabase-js`, sin variables `VITE_SUPABASE_*`. Ver `IMPROVEMENTS.md` y
`CAMBIOS_mariaNails2.2.md`.
