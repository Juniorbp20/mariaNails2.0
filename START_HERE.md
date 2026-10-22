# Bienvenido a María Nails (sitio estático)

Sitio oficial de **Maria Nails Studio & Pedicure**: React + TypeScript + Tailwind,
100% estático, sin base de datos. Reservas por WhatsApp, fotos en Instagram.

## Tabla de Contenidos

1. [Cómo funciona](#cómo-funciona)
2. [Cómo empezar](#cómo-empezar)
3. [Dónde se edita cada cosa](#dónde-se-edita-cada-cosa)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Documentación completa](#documentación-completa)

---

## Cómo funciona

- **Sin base de datos**: no hay Supabase, ni login, ni panel `/admin`, ni variables de entorno.
- **Reservas por WhatsApp**: todos los botones abren `wa.me/18293388282` con el mensaje ya escrito
  (servicio + precio + espacio para el nombre).
- **Galería en Instagram**: la ruta `/galeria` es una página puente con un botón grande a
  `https://www.instagram.com/____marianails/`. Las fotos se actualizan publicando en Instagram.
- **Precios oficiales en código**: `src/data/officialCatalog.ts` es la fuente única de verdad
  (8 servicios base + matriz de acrílico 6 estilos x 8 largos). El catálogo, el inicio y el
  asistente virtual leen de ahí.

## Cómo empezar

### 1. Ejecutar la aplicación

```bash
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### 2. Ver las páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: hero, beneficios, sobre María, servicios destacados |
| `/galeria` | Puente a Instagram (botón + reserva por WhatsApp) |
| `/sobre-mi` | Perfil de María + contacto del salón |
| `/precios` | Catálogo por pestañas + tabla acrílico #1-#8 + políticas |

### 3. Publicar un cambio (ej: un precio)

1. Edita el precio en `src/data/officialCatalog.ts`.
2. Verifica local: `npm run dev`.
3. Compila: `npm run build`.
4. Sube a tu repo: cada push despliega automáticamente (Vercel/Netlify).

## Dónde se edita cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Precios, teléfono, dirección, Instagram, textos | `src/data/officialCatalog.ts` |
| Mensajes de WhatsApp | `src/data/whatsappTemplates.ts` |
| Foto de perfil / logo | `public/images/` (mismo nombre de archivo) |
| Respuestas del asistente virtual | `src/components/AIAssistant.tsx` (`getBotReply`) |

## Estructura del proyecto

```
src/
├── App.tsx                  ← Router + layout común
├── pages/                   ← Home, Gallery, About, PriceCatalog, NotFound
├── components/              ← Header, Footer, WhatsAppFloat, AIAssistant,
│                              AcrylicPriceTable, PolicyBlocks, ScrollToTop
├── data/                    ← officialCatalog.ts, whatsappTemplates.ts
├── utils/                   ← catalog.ts, format.ts
└── types/                   ← index.ts (tipo Service)
public/
├── images/                  ← logo.jpg, maria-perfil.jpg
├── robots.txt
└── sitemap.xml
FOTOS/                        ← Originales en alta resolución (no se publican)
```

## Documentación completa

- **[README.md](./README.md)** — resumen general del proyecto
- **[QUICK_START.md](./QUICK_START.md)** — guía rápida de 5 minutos
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** — arquitectura técnica
- **[DEPLOY_PRODUCCION.md](./DEPLOY_PRODUCCION.md)** — cómo publicar en Vercel/Netlify
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** — cambios comunes paso a paso
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** — historial de evolución del proyecto

---

## Comandos útiles

```bash
npm run dev        # Servidor local
npm run build      # Compila a producción (dist/)
npm run preview    # Previsualiza el build
npm run typecheck  # Verifica tipos TypeScript
```

## Soporte

- **WhatsApp del negocio**: +1 829 338 8282
- **Documentación técnica**: `DOCUMENTATION.md`
- **Cambios comunes**: `NEXT_STEPS.md`
