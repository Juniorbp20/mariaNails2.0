# Evolución — María Nails

## Etapa actual: sitio estático (sin base de datos)

Decisión: eliminar Supabase, el panel `/admin` y el sistema de citas con calendario.
Motivos: cero costos, cero mantenimiento, web más rápida y todo el contenido ya vivía
en `officialCatalog.ts` o en Instagram.

### Antes (con Supabase) → Ahora (estático)

| Antes | Ahora |
|---|---|
| Tablas `services`, `appointments`, `gallery_images`... | `src/data/officialCatalog.ts` (precios y datos en código) |
| Galería con Storage + paginación | `/galeria` redirige a Instagram |
| Panel `/admin` con login | Cambios editando el archivo de datos + push |
| Citas en base de datos + calendario | Reserva directa por WhatsApp con mensaje pre-llenado |
| Variables `VITE_SUPABASE_*` en Vercel | Sin variables de entorno |
| Dependencia `@supabase/supabase-js` | Eliminada (bundle más liviano) |

### Archivos eliminados

- `src/services/*` (5 servicios), `src/lib/supabase.ts`, `src/contexts/`, `src/hooks/useAsync.ts`
- `src/components/ConfigBanner.tsx`, `GalleryImage.tsx`, `Skeletons.tsx`
- `src/pages/AdminDashboard.tsx` + ruta `/admin`
- Carpeta `supabase/` (functions, migrations, config) — fotos originales movidas a `FOTOS/`
- Código sin uso: `dateUtils.ts`, validadores de formulario, helpers de categorías,
  plantillas de WhatsApp no usadas, `getAcrylicPrice`/`buildAcrylicServiceName`

### Lo que se mantiene

- 4 páginas, catálogo con pestañas, tabla de acrílico 6x8, asistente virtual local,
  botones de WhatsApp, logo + foto optimizadas en `public/images/`.

---

## Historial: de estático simple a plataforma con backend (etapa anterior)

La primera modernización transformó un HTML estático en una app React con reservas
en calendario, galería dinámica, base de datos Supabase y panel admin. Aportó el
diseño actual (Tailwind, responsive, páginas por ruta) y el catálogo oficial de
precios, que sobrevivieron a la simplificación.

### Aportes que se conservan de esa etapa

- Diseño moderno y responsive con Tailwind CSS
- Navegación por páginas (`/`, `/sobre-mi`, `/galeria`, `/precios`)
- Catálogo oficial: 8 servicios base + matriz acrílico 6 estilos x 8 largos
- Políticas del negocio: solo WhatsApp, cancelación 24h, tolerancia 15 min
- Datos oficiales: Banreservas 9605474442, dirección en Tenares, coffee bar
- Asistente virtual con tono cálido y respuestas por palabras clave
- Performance: bundle ~218KB JS / ~66KB gzip, imágenes optimizadas, lazy loading

### Lo que se descartó y por qué

- **Calendario de reservas en DB**: las clientas igual confirman por WhatsApp; el
  calendario agregaba complejidad sin uso real.
- **Panel admin**: obligaba a mantener auth, RLS y Storage por editar textos que
  cambian pocas veces al año.
- **Galería en Storage**: duplicaba lo que ya se publica en Instagram.
