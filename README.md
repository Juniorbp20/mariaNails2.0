# Maria Nails Studio & Pedicure

Sitio web oficial de **Maria Nails Studio & Pedicure** (María Bonifacio, Tenares, República Dominicana).
Manicura, gel, pedicura spa y acrílico del #1 al #8. Reservas por WhatsApp, fotos en Instagram.

## Sitio 100% estático, sin base de datos

- **Sin backend ni cuentas que pagar**: no hay Supabase, ni login, ni panel admin.
- **Reservas por WhatsApp**: cada botón arma un mensaje listo al `wa.me/18293388282`.
- **Galería en Instagram**: `/galeria` es una página puente a
  `https://www.instagram.com/____marianails/`, donde viven las fotos actualizadas.
- **Fuente única de verdad**: `src/data/officialCatalog.ts` (datos, precios, políticas).
  Si un precio cambia ahí, cambia en catálogo, inicio y asistente.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS
- React Router v6 (rutas `/`, `/galeria`, `/sobre-mi`, `/precios`)
- Lucide React (iconos)

## Estructura

```
src/
├── App.tsx                  ← Router + layout (Header, Footer, flotantes)
├── main.tsx                 ← Punto de entrada
├── index.css                ← Estilos globales (Tailwind)
├── pages/
│   ├── Home.tsx             ← Inicio (hero, beneficios, servicios destacados)
│   ├── Gallery.tsx          ← Puente a Instagram (sin fotos locales)
│   ├── About.tsx            ← Sobre María + contacto del salón
│   ├── PriceCatalog.tsx     ← Catálogo por pestañas + tabla acrílico #1-#8
│   └── NotFound.tsx         ← 404
├── components/
│   ├── Header.tsx           ← Navegación (logo estático)
│   ├── Footer.tsx           ← Ubicación, contacto, pagos, redes
│   ├── WhatsAppFloat.tsx    ← Botón flotante de reserva
│   ├── AIAssistant.tsx      ← Asistente virtual (respuestas por palabras clave, sin IA externa)
│   ├── AcrylicPriceTable.tsx← Tabla interactiva 6 estilos x 8 largos
│   ├── PolicyBlocks.tsx     ← Cortesías, ubicación, políticas, pagos
│   └── ScrollToTop.tsx      ← Sube al cambiar de ruta
├── data/
│   ├── officialCatalog.ts   ← DATOS DEL NEGOCIO (edítalo aquí)
│   └── whatsappTemplates.ts ← Mensajes de WhatsApp (waLink + plantillas)
├── utils/
│   ├── catalog.ts           ← getOfficialServices(), findServiceForAcrylic()
│   └── format.ts            ← formatPrice(), formatDuration(), toWhatsAppUrl()
└── types/
    └── index.ts             ← Tipo Service
public/
├── images/
│   ├── logo.jpg             ← Logo (Header)
│   └── maria-perfil.jpg     ← Foto de María (Inicio + Sobre mí)
├── robots.txt
└── sitemap.xml
FOTOS/                        ← Originales en alta resolución (no se publican)
```

## Cómo editar el contenido

Todo se edita en código, sin panel. Los 3 lugares que importan:

| Quiero cambiar... | Archivo |
|---|---|
| Precios, teléfono, dirección, Instagram, textos | `src/data/officialCatalog.ts` (`BUSINESS_INFO`, `STATIC_PROFILE`, `ACRYLIC_STYLES`, `OFFICIAL_SERVICES`) |
| Mensajes de WhatsApp | `src/data/whatsappTemplates.ts` |
| Foto de perfil / logo | Reemplaza `public/images/maria-perfil.jpg` o `public/images/logo.jpg` (mismo nombre) |

Detalles:

- **Instagram**: `BUSINESS_INFO.instagramUrl` en `officialCatalog.ts`. Cambia la URL y se
  actualiza `/galeria` + Footer automáticamente.
- **Fotos**: optimízalas antes de subir (JPG, logo máx. 512px, perfil máx. 1080px de ancho).
  Los originales están en `FOTOS/` (no se despliegan).
- **Precios**: edita `ACRYLIC_STYLES` (matriz 6 x 8) u `OFFICIAL_SERVICES` (8 servicios base).
  El asistente virtual y el catálogo los leen del mismo lugar.

## Comandos

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor local (http://localhost:5173)
npm run build    # Compilar a producción (carpeta dist/)
npm run preview  # Previsualizar el build
npm run typecheck# Verificar tipos TypeScript
```

## Deploy

Sitio estático puro (`dist/`). Funciona en Vercel (`vercel.json`) o Netlify (`netlify.toml`).
**No necesita variables de entorno.** Ver [DEPLOY_PRODUCCION.md](./DEPLOY_PRODUCCION.md).

## Documentación

- [START_HERE.md](./START_HERE.md) — guía de inicio
- [QUICK_START.md](./QUICK_START.md) — guía rápida de 5 minutos
- [DOCUMENTATION.md](./DOCUMENTATION.md) — arquitectura técnica
- [DEPLOY_PRODUCCION.md](./DEPLOY_PRODUCCION.md) — cómo publicar
- [NEXT_STEPS.md](./NEXT_STEPS.md) — cómo hacer cambios comunes
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) — historial de evolución
- [CAMBIOS_mariaNails2.2.md](./CAMBIOS_mariaNails2.2.md) — registro de cambios

## Contacto del negocio

- WhatsApp citas: 829-338-8282 (`https://wa.me/18293388282`)
- Instagram: `https://www.instagram.com/____marianails/`
- Dirección: Gran Parada Tenares, Calle Principal #25 (Salón Griselda, 2do nivel)
- Pagos: efectivo + transferencia Banreservas 9605474442 (María Bonifacio)
