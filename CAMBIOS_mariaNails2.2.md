# Cambios — rama mariaNails2.2
## Prompt Maestro: Maria Nails Studio & Pedicure

Fecha: 2026-09-24
Commit base: `37c35cb mariaNails2.2`
Rama: `mariaNails2.2` -> `origin/mariaNails2.2`

### 1. Fuente de verdad oficial
- `src/data/officialCatalog.ts` (nuevo):
  - BUSINESS_INFO: Maria Nails Studio & Pedicure, María Bonifacio, eslogan "Belleza en tus manos y pies", WhatsApp 829-338-8282 / wa.me/18293388282, dirección Gran Parada Tenares Calle Principal #25 salida San Francisco de Macorís (Salón Griselda 2do nivel), Banreservas 9605474442 titular María Bonifacio.
  - COURTESIES: café, tés, jugos, galletas.
  - POLICIES: solo WhatsApp, cancelación sin costo 24h antes (menos de 24h pierde seña), tolerancia 15 min.
  - ACRYLIC_STYLES con 48 precios oficiales:
    - Pintura Regular: 750,800,850,900,1000,1150,1300,1400
    - Cover Liso: 800,900,1000,1250,1350,1500,1650,1800
    - Cover French: 850,950,1050,1200,1350,1500,1650,1800
    - Acrílico+Gel: 900,1000,1150,1250,1350,1500,1750,1900
    - Baby Boomer: 950,1100,1200,1350,1500,1650,1800,2000
    - Full Set: 1000,1250,1300,1450,1600,1700,1850,2100
  - OFFICIAL_SERVICES: Manicura Seco 250, Seco Gel 450, Regular 600, Gel 800, Gel natural 450, Sistemas Gel desde 1234, Pedicura 1234 (180 min), Nail Art precio a cotizar.
- `src/data/whatsappTemplates.ts` (nuevo):
  - waLink(), WHATSAPP_TEMPLATES (bienvenida, precios, agendar, cancelación 24h, tardanza 15min, nailArt, pago transferencia, dirección) + ASSISTANT_SYSTEM_PROMPT para bots/IA.

### 2. Base de datos Supabase
- `supabase/migrations/20260322009000_015_official_services_seed.sql` (nuevo):
  - Inserta/actualiza 8 servicios base, inserta/actualiza 48 variantes `Acrílico {estilo} #{1-8}` categoría Acrílico, desactiva seeds genéricos antiguos ($20-$65).
- `supabase/migrations/20260322010000_016_official_business_profile.sql` (nuevo):
  - ALTER TABLE business_profile ADD COLUMN payment_details, UPDATE singleton con nombre, tagline, hero, about María Bonifacio, dirección, teléfono, WhatsApp y pagos oficiales.
- `src/types/index.ts`: agrega `payment_details: string | null` a BusinessProfile.
- `src/services/businessProfileService.ts`: permite actualizar `payment_details`.
- `src/contexts/BusinessProfileContext.tsx`: defaults oficiales (nombre, dirección, WhatsApp, pagos).
- Para aplicar en producción: `supabase db push`.

### 3. Catálogo y servicios
- `src/utils/catalog.ts` (nuevo): groupServicesByCategory, sortedCategoryKeys, parseAcrylicName, findServiceForAcrylic.
- `src/components/AcrylicPriceTable.tsx` (nuevo): selector #1-#8, 6 cards con precio oficial o DB, reserva directa o WhatsApp, tabla completa 48 precios.
- `src/components/PolicyBlocks.tsx` (nuevo): coffee bar, ubicación, reservas/puntualidad, pagos.
- `src/pages/PriceCatalog.tsx`: reescrito con tabs Manicura / Gel-Pedicura / Acrílico / Nail Art / Info, fallback a OFFICIAL_SERVICES si Supabase vacío, imagen de catálogo si existe, CTA reserva + WhatsApp.
- `src/pages/Services.tsx`: agrupado por categoría, filtro Todos + Acrílico interactivo, modal con nota cortesía/15min/24h.

### 4. Reserva, contacto y contenido
- `src/pages/Booking.tsx`: banner políticas + dirección + coffee bar, confirmación con pagos Banreservas y ubicación.
- `src/components/WhatsAppFloat.tsx`: mensaje `Hola María 💅✨ Quiero reservar mi cita...`.
- `src/components/Footer.tsx`: nombre oficial, cortesías, dirección exacta, pagos, nota cita previa / 24h / 15min.
- `src/pages/Home.tsx`: hero con teléfono, coffee bar, dirección, 3 beneficios (experiencia María, coffee bar, cita previa), precios resumen + fallback oficial.
- `src/pages/About.tsx`: título Sobre María Bonifacio, contacto profesional, WhatsApp, dirección, modalidad, cortesías y pagos.

### 5. Admin editable
- `src/pages/AdminDashboard.tsx`:
  - BusinessProfileForm + map + save con `payment_details` + textarea en UI.
  - Servicio categoría con datalist Manicura/Gel/Pedicura/Acrílico/Nail Art + ayuda formato `Acrílico Cover Liso #4`.

### 6. Asistente virtual
- `src/components/AIAssistant.tsx` (nuevo): botón 💜, chat con reglas (precios, acrílico, pedicura, nail art, dirección, pagos, cancelación, tardanza, cortesías, reserva), quick replies, links a /precios y WhatsApp.
- `src/App.tsx`: monta `<AIAssistant />` junto a `<WhatsAppFloat />`.

### 7. Verificación
- `npm run typecheck`: OK.
- `npm run build`: OK (vite 5.4.21, 1577 módulos, dist/index.html 2.73 kB, css 31.62 kB, js 426.16 kB).
- `npm run lint`: falla preexistente por `allowShortCircuit` en eslint 9.39.4, no relacionado a estos cambios.

### Cómo probar
1. `/precios` → tab Acrílico → elegir #4 → Cover Liso RD$1,250.
2. `/servicios` → filtro Acrílico interactivo.
3. `/reserva` → ver banner 24h/15min y confirmación con dirección + Banreservas.
4. Botón 💜 → escribir "precio pedicura", "acrílico #5".
5. `/admin` → Servicios (crear `Acrílico Cover Liso #4`) y Negocio (editar payment_details).
