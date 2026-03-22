# Próximos Pasos - María Nails

## 1️⃣ Agregar Fotos a la Galería

### Opción A: Desde el Panel Admin (Recomendado)
```
1. Abre http://localhost:5173/admin
2. Ingresa contraseña: marianails2026
3. Ve a la sección "Galería" (cuando esté implementada)
4. Click en "Agregar imagen"
5. Carga la foto desde tu computadora
6. Agrega descripción (opcional)
7. Asocia con un servicio
```

### Opción B: Desde Supabase Directamente
```sql
INSERT INTO gallery_images (title, description, image_url, service_id, display_order, active)
VALUES
  ('Acrílico Rosa', 'Diseño acrílico en tonos rosados', 'https://tu-url-imagen.com/imagen1.jpg', 'service-id', 1, true),
  ('Gel Natural', 'Gel transparente con efecto natural', 'https://tu-url-imagen.com/imagen2.jpg', 'service-id', 2, true);
```

### Opción C: Usando Supabase Storage
```
1. Abre Supabase Dashboard
2. Storage > Crear bucket "gallery"
3. Carga imágenes
4. Copia la URL pública
5. Inserta en base de datos con esa URL
```

---

## 2️⃣ Cambiar Contraseña del Admin

### Paso 1: Localizar el archivo
```
src/pages/AdminDashboard.tsx
```

### Paso 2: Buscar esta línea
```typescript
const ADMIN_PASSWORD = 'marianails2026';
```

### Paso 3: Cambiarla por tu contraseña
```typescript
const ADMIN_PASSWORD = 'tu-contraseña-nueva';
```

### Paso 4: Guardar y compilar
```bash
npm run build
```

---

## 3️⃣ Actualizar Información de Servicios

### Editar Servicios en Base de Datos
```sql
UPDATE services
SET
  name = 'Nuevo nombre',
  description = 'Nueva descripción',
  price = 45.00,
  duration_minutes = 60
WHERE id = 'service-id';
```

### Agregar Nuevo Servicio
```sql
INSERT INTO services (name, description, duration_minutes, price, category, active)
VALUES
  ('Servicio Nuevo', 'Descripción del servicio', 60, 50.00, 'Categoría', true);
```

---

## 4️⃣ Configurar Horarios Personalizados

### Ver Horarios Actuales
```sql
SELECT * FROM availability_slots ORDER BY day_of_week;
```

### Actualizar Horario de un Día
```sql
-- Ejemplo: Cambiar horario del lunes
UPDATE availability_slots
SET
  start_time = '10:00:00',
  end_time = '19:00:00',
  break_start = '13:00:00',
  break_end = '14:30:00'
WHERE day_of_week = 1;
```

### Días de la Semana
- 0 = Domingo
- 1 = Lunes
- 2 = Martes
- 3 = Miércoles
- 4 = Jueves
- 5 = Viernes
- 6 = Sábado

---

## 5️⃣ Bloquear Fechas Especiales

### Agregar Fecha Bloqueada (Vacaciones, Festivos, etc)
```sql
INSERT INTO blocked_dates (blocked_date, reason)
VALUES ('2026-04-15', 'Vacaciones');
```

### Ver Fechas Bloqueadas
```sql
SELECT * FROM blocked_dates ORDER BY blocked_date;
```

### Eliminar Bloqueo
```sql
DELETE FROM blocked_dates WHERE blocked_date = '2026-04-15';
```

---

## 6️⃣ Agregar Más Usuarios Administradores

### Agregar Usuario Admin
```sql
INSERT INTO admin_users (email)
VALUES ('otro-admin@email.com');
```

### Ver Usuarios Admin
```sql
SELECT * FROM admin_users;
```

**Nota**: Actualmente la contraseña es global. Para autenticación individual, ver la sección "Mejoras Futuras".

---

## 7️⃣ Personalizar Estilos

### Cambiar Colores Principales
Abre `tailwind.config.js` y modifica:
```javascript
theme: {
  extend: {
    colors: {
      pink: { ... },
      red: { ... }
    }
  }
}
```

### Cambiar Fuentes
En `index.css`:
```css
@layer base {
  html {
    font-family: 'Tu Fuente', sans-serif;
  }
}
```

---

## 8️⃣ Agregar Logo Personalizado

### Opción 1: Reemplazar Logo Emoji
En `src/components/Header.tsx`, línea ~15:
```typescript
<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
  MN  {/* Cambiar por tu logo */}
</div>
```

### Opción 2: Usar Imagen
```typescript
<img src="/logo.png" alt="Logo" className="w-12 h-12" />
```

---

## 9️⃣ Integración con Supabase Storage (Imágenes)

### Crear Bucket para Imágenes
```sql
-- En Supabase Dashboard: Storage > New Bucket
-- Nombre: gallery
-- Permisos: Público
```

### Subir Imágenes
```typescript
// Función para subir imagen
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file);

  if (error) throw error;

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
```

---

## 🔟 Implementar Email Notifications

### Usar Supabase Edge Functions

1. Crear función en `supabase/functions/send-confirmation/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { email, name, service, date, time } = await req.json();

  // Enviar email aquí
  return new Response(JSON.stringify({ success: true }));
});
```

2. Ejecutar función después de crear cita:
```typescript
await supabase.functions.invoke('send-confirmation', {
  body: { email, name, service, date, time }
});
```

---

## Mejoras Futuras Recomendadas

### Corto Plazo (1-2 semanas)
- [ ] Email confirmación automática
- [ ] Más imágenes en galería
- [ ] Actualizar fotos de María
- [ ] Cambiar contraseña admin

### Mediano Plazo (1 mes)
- [ ] Integración Stripe (pagos)
- [ ] SMS reminders
- [ ] Google Calendar sync
- [ ] Sistema de ratings/comentarios

### Largo Plazo (3+ meses)
- [ ] Autenticación real de clientes
- [ ] Historial de citas de clientes
- [ ] Programa de lealtad
- [ ] App móvil (React Native)
- [ ] Predicción de demanda (IA)

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. **Revisa la documentación**: `DOCUMENTATION.md`
2. **Consulta rápida**: `QUICK_START.md`
3. **Ver cambios**: `IMPROVEMENTS.md`

---

**¡Ahora tu María Nails está lista para crecer! 🚀**
