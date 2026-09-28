# Quick Start — María Nails (5 minutos)

Sitio estático (React + TypeScript + Tailwind), sin base de datos.
Reservas por WhatsApp, fotos en Instagram.

## 1. Arrancar en local (2 min)

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

## 2. Recorrer las 4 páginas (1 min)

- `/` — inicio con hero, beneficios y servicios destacados
- `/galeria` — puente a Instagram + botón de reserva
- `/sobre-mi` — perfil de María y contacto
- `/precios` — catálogo por pestañas + tabla de acrílico #1-#8

## 3. Hacer tu primer cambio: un precio (2 min)

1. Abre `src/data/officialCatalog.ts`.
2. Busca el servicio en `OFFICIAL_SERVICES` (o la matriz en `ACRYLIC_STYLES`) y cambia el número.
3. Guarda y mira el cambio en el navegador (recarga automática).
4. Compila para verificar: `npm run build`.

Ese es todo el flujo: **editar el archivo → ver en local → build → push** (el deploy es automático).

## Cambios más comunes

| Cambio | Dónde |
|---|---|
| Precio o descripción | `src/data/officialCatalog.ts` (`OFFICIAL_SERVICES` o `ACRYLIC_STYLES`) |
| Teléfono / dirección / Instagram | `src/data/officialCatalog.ts` (`BUSINESS_INFO`) |
| Textos del hero o "sobre mí" | `src/data/officialCatalog.ts` (`STATIC_PROFILE`) |
| Mensaje de WhatsApp | `src/data/whatsappTemplates.ts` |
| Foto de perfil o logo | Reemplaza el archivo en `public/images/` (mismo nombre) |
| Respuesta del asistente | `src/components/AIAssistant.tsx` (función `getBotReply`) |

## Rutas

```
/ .................... Inicio
/sobre-mi ............ Sobre María
/galeria ............. Puente a Instagram
/precios ............. Catálogo de precios
```

## Tecnologías

- React 18 + TypeScript + Vite 5
- Tailwind CSS
- React Router v6
- Lucide React (iconos)

Sin backend, sin base de datos, sin variables de entorno. Más detalle en `DOCUMENTATION.md`.
Cómo publicar en `DEPLOY_PRODUCCION.md`.
