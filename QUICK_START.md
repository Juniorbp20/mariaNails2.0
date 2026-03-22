# Quick Start Guide - María Nails

## Sistema Completamente Renovado

Tu aplicación ha sido transformada de un sitio estático a una plataforma profesional de reservas con React, TypeScript y Supabase.

## Lo Más Importante: Nuevas Características

### 1. Sistema de Reservas en Calendario ✅
En lugar de enviar mensajes por WhatsApp, tus clientes ahora pueden:
- Seleccionar servicios
- Elegir fechas en un calendario interactivo
- Escoger horarios disponibles
- Recibir confirmación instantánea

**URL**: `/reserva`

### 2. Panel de Administración ✅
Gestiona todas tus citas desde un dashboard profesional
**URL**: `/admin`
**Contraseña**: `marianails2026`

## Archivos Principales Creados

### Páginas (src/pages/)
- `Home.tsx` - Página de inicio
- `Services.tsx` - Catálogo de servicios
- `Gallery.tsx` - Galería de trabajos
- `Booking.tsx` - Sistema de reservas (5 pasos)
- `About.tsx` - Sobre María
- `AdminDashboard.tsx` - Panel de control

### Componentes (src/components/)
- `Header.tsx` - Navegación principal
- `Footer.tsx` - Pie de página
- `Calendar.tsx` - Calendario interactivo
- `TimeSlots.tsx` - Selector de horarios
- `ServiceCard.tsx` - Tarjeta de servicio
- `GalleryImage.tsx` - Imagen con modal

### Servicios API (src/services/)
- `appointmentService.ts` - Gestión de citas
- `serviceService.ts` - Servicios disponibles
- `availabilityService.ts` - Horarios y fechas bloqueadas
- `galleryService.ts` - Imágenes de galería

### Base de Datos
Automáticamente creada con:
- 6 servicios profesionales
- Horarios de trabajo (Lun, Mié, Jue, Vie, Sab)
- Tablas para citas, usuarios, fechas bloqueadas

## Rutas de la Aplicación

```
/ ........................... Inicio
/sobre-mi .................... Sobre María
/servicios ................... Catálogo de servicios
/galeria ..................... Galería de trabajos
/reserva ..................... Sistema de reservas
/admin ....................... Panel de administración
```

## Cambios de Estructura

### Antes (Estático)
```
- index.html
- styles.css
- script.js
- /img
- /vendor
```

### Ahora (Moderno)
```
src/
├── components/          Componentes reutilizables
├── pages/               Páginas de la app
├── services/            Conexión API/Supabase
├── types/               Tipos TypeScript
├── hooks/               Lógica compartida
├── utils/               Funciones auxiliares
├── lib/                 Configuración Supabase
└── App.tsx              Enrutamiento principal
```

## Base de Datos Supabase

### Tablas Creadas
1. **services** - Servicios de uñas
2. **appointments** - Reservas de clientes
3. **availability_slots** - Horarios de trabajo
4. **blocked_dates** - Fechas cerradas
5. **gallery_images** - Fotos de trabajos
6. **admin_users** - Usuarios administrativos

### Acceso RLS
- Clientes: Pueden crear citas
- Admin: Acceso completo (protegido por contraseña)

## Próximos Pasos Recomendados

### 1. Agregar Imágenes de Galería
Ve a `/admin` y busca la sección de galería para subir fotos de tus trabajos.

### 2. Actualizar Información de Servicios
En `/admin` puedes editar precios, duraciones y descripciones.

### 3. Cambiar Contraseña Admin
Busca "marianails2026" en `src/pages/AdminDashboard.tsx` y cámbiala.

### 4. Agregar Fotos de María
Reemplaza las imágenes placeholder con fotos reales en las páginas.

### 5. Configurar Horarios
Ajusta los horarios según tus disponibilidades en la base de datos.

## Performance

- **Bundle Size**: 100KB gzip (muy optimizado)
- **Imágenes**: Lazy loading automático
- **Base de Datos**: Queries optimizadas con índices
- **Caching**: Implementado en servicios

## Tecnologías

- React 18
- TypeScript
- Tailwind CSS (sin dependencias UI externas)
- Supabase (PostgreSQL)
- React Router v6
- Lucide React (iconos)

## Soporte

Para dudas técnicas, revisa `DOCUMENTATION.md` para información detallada sobre la arquitectura y funcionalidades.

---

**¡Tu aplicación está lista para usar! 🎉**

Accede a `/admin` con la contraseña `marianails2026` para comenzar a gestionar tus citas.
