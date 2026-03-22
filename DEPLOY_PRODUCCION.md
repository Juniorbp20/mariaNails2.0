# Deploy a Produccion (Vercel y Netlify)

Este proyecto ya quedo preparado para ambos:

- `vercel.json`
- `netlify.toml`

Tambien ya incluye soporte SPA (React Router) para evitar errores 404 en rutas como `/admin` o `/reserva`.

## 0) Requisitos previos

1. Tener el proyecto en un repo GitHub/GitLab/Bitbucket.
2. Verificar que compila local:

```bash
npm install
npm run build
```

3. Tener listas estas variables de entorno (frontend):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Importante: **no** usar `SUPABASE_SERVICE_ROLE_KEY` en frontend.

---

## 1) Deploy en Vercel (Dashboard)

1. Entra a https://vercel.com/ y haz login.
2. Click en **Add New... > Project**.
3. Importa tu repositorio.
4. En configuración del proyecto revisa:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
5. En **Environment Variables** agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click en **Deploy**.
7. Cuando termine, prueba rutas directas:
   - `/`
   - `/reserva`
   - `/admin`

### Redeploy en Vercel

- Cada push a rama principal hace deploy automático.
- Si cambias variables de entorno, haz un nuevo deploy desde el dashboard.

---

## 2) Deploy en Vercel (CLI)

1. Instala CLI:

```bash
npm i -g vercel
```

2. En la carpeta del proyecto:

```bash
vercel
```

3. Responde el asistente (link de proyecto).
4. Para producción:

```bash
vercel --prod
```

5. Agrega variables desde dashboard o con CLI:

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

---

## 3) Deploy en Netlify (Dashboard)

1. Entra a https://app.netlify.com/ y haz login.
2. Click en **Add new site > Import an existing project**.
3. Conecta tu repo.
4. Build settings (si te los pide):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. En **Site configuration > Environment variables** agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click en **Deploy site**.
7. Prueba rutas directas:
   - `/`
   - `/reserva`
   - `/admin`

### Redeploy en Netlify

- Cada push a rama principal despliega automático.
- Si cambias variables, vuelve a deployar desde **Deploys > Trigger deploy**.

---

## 4) Deploy en Netlify (CLI)

1. Instala CLI:

```bash
npm i -g netlify-cli
```

2. Loguea:

```bash
netlify login
```

3. Inicializa y vincula proyecto:

```bash
netlify init
```

4. Deploy preview:

```bash
netlify deploy
```

5. Deploy producción:

```bash
netlify deploy --prod
```

---

## 5) Verificaciones despues de publicar

1. Abre la web y prueba:
   - Navegacion completa.
   - Reserva de cita.
   - Login admin oculto y panel `/admin`.
2. Crea una cita y confirma desde admin.
3. Verifica sincronizacion en Google Calendar.
4. Si falla algo, revisa:
   - Variables de entorno cargadas en proveedor.
   - URL de Supabase correcta.
   - Que el frontend use build actual (nuevo deploy).

---

## 6) Notas de configuracion ya incluidas

### `vercel.json`

- Reescribe todas las rutas a `index.html` para SPA.

### `netlify.toml`

- Configura build y publish de Vite.
- Incluye redirect `/* -> /index.html (200)` para SPA.
