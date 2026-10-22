# Deploy a producción (Vercel y Netlify)

Sitio estático puro: `npm run build` genera `dist/` y eso es todo lo que se publica.
**No necesita variables de entorno ni base de datos.**

Soporte SPA (React Router) ya incluido para evitar 404 en `/galeria`, `/precios`, `/sobre-mi`:

- `vercel.json` → rewrites a `/index.html`
- `netlify.toml` → redirect `/* → /index.html (200)`

## 0) Requisitos previos

1. Proyecto en un repo GitHub/GitLab/Bitbucket.
2. Verificar que compila en local:

```bash
npm install
npm run build
```

3. Nada más. No hay `.env` que configurar. Si en el dashboard quedan variables
   viejas `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, **bórralas**: ya no se usan.

---

## 1) Deploy en Vercel (Dashboard)

1. Entra a https://vercel.com/ y haz login.
2. **Add New... > Project** e importa tu repositorio.
3. Revisa la configuración:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Deploy** (sin variables de entorno).
5. Prueba rutas directas: `/`, `/galeria`, `/precios`, `/sobre-mi`.

Cada push a la rama principal despliega automáticamente.

## 2) Deploy en Vercel (CLI)

```bash
npm i -g vercel
vercel        # primer deploy / vincular proyecto
vercel --prod # producción
```

## 3) Deploy en Netlify (Dashboard)

1. Entra a https://app.netlify.com/ y haz login.
2. **Add new site > Import an existing project** y conecta tu repo.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy site** (sin variables de entorno).
5. Prueba rutas directas: `/`, `/galeria`, `/precios`, `/sobre-mi`.

Cada push a la rama principal despliega automáticamente
(**Deploys > Trigger deploy** para forzar uno manual).

## 4) Deploy en Netlify (CLI)

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy        # preview
netlify deploy --prod # producción
```

---

## 5) Verificaciones después de publicar

1. Navegación completa entre las 4 páginas.
2. Botones de WhatsApp abren `wa.me/18293388282` con el mensaje correcto.
3. `/galeria` lleva al Instagram `https://www.instagram.com/____marianails/`.
4. Logo y foto de perfil cargan (`/images/logo.jpg`, `/images/maria-perfil.jpg`).
5. Recarga directa en `/precios` no da 404 (rewrite SPA activo).

## 6) Notas de configuración incluida

### `vercel.json`

- Reescribe todas las rutas a `index.html` para SPA.

### `netlify.toml`

- Configura build (`npm run build`) y publish (`dist`).
- Incluye redirect `/* -> /index.html (200)` para SPA.
