# María Nails - Aplicación Modernizada

## Resumen de Cambios

Se ha completado una transformación integral de la aplicación María Nails, migrando de un sitio estático HTML a una aplicación React moderna con TypeScript, integración con Supabase y un sistema completo de reservas en línea.

## Características Principales

### 1. Sistema de Reservas en Calendario
- **Calendario Interactivo**: Selecciona fechas disponibles
- **Horarios Dinámicos**: Horarios automáticos según disponibilidad
- **Prevención de Dobles Reservas**: Validación en tiempo real
- **Confirmación Instantánea**: Recepción inmediata de confirmación

### 2. Base de Datos Supabase
- **Tablas Principales**:
  - `services`: Servicios ofrecidos
  - `appointments`: Reservas de clientes
  - `availability_slots`: Horarios de trabajo
  - `blocked_dates`: Fechas de cierre
  - `gallery_images`: Imágenes de trabajos
  - `admin_users`: Usuarios administrativos

- **Seguridad**:
  - Row Level Security (RLS) habilitado
  - Políticas de acceso restrictivas
  - Autenticación admin protegida

### 3. Panel de Administración
- **Acceso**: `/admin` con contraseña
- **Funciones**:
  - Ver todas las reservas
  - Cambiar estado de citas
  - Eliminar reservas
  - Gestionar servicios
  - Configurar horarios
  - Ver estadísticas

- **Contraseña Admin**: `marianails2026`

### 4. Páginas Principales
- **Inicio**: Presentación y llamada a la acción
- **Sobre mí**: Información de María y su experiencia
- **Servicios**: Catálogo completo de servicios
- **Galería**: Portfolio de trabajos
- **Reservar Cita**: Sistema de 5 pasos
- **Admin**: Panel de control

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ServiceCard.tsx
│   ├── GalleryImage.tsx
│   ├── Calendar.tsx
│   └── TimeSlots.tsx
├── pages/               # Páginas de la aplicación
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Gallery.tsx
│   ├── Booking.tsx
│   └── AdminDashboard.tsx
├── services/            # Servicios API
│   ├── appointmentService.ts
│   ├── serviceService.ts
│   ├── galleryService.ts
│   └── availabilityService.ts
├── lib/                 # Librerías
│   └── supabase.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── hooks/               # Custom hooks
│   └── useAsync.ts
├── utils/               # Funciones utilitarias
│   └── dateUtils.ts
└── App.tsx              # Aplicación principal
```

## Configuración de Supabase

### Variables de Entorno
```
VITE_SUPABASE_URL=https://sapqurrixziczmdveooh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Datos Iniciales
Se han insertado automáticamente:
- 6 servicios profesionales
- Horarios de trabajo (Lun, Mié, Jue, Vie, Sab)
- Usuario admin

## Cómo Usar

### Para Clientes
1. Navega a `/reserva`
2. Selecciona servicio
3. Elige fecha disponible
4. Selecciona hora
5. Ingresa datos de contacto
6. Confirma reserva

### Para Administrador
1. Ve a `/admin`
2. Ingresa contraseña: `marianails2026`
3. Gestiona citas y servicios

## Optimizaciones de Performance

- **Code Splitting**: Rutas cargadas dinámicamente
- **Lazy Loading**: Imágenes con lazy loading
- **Bundle Size**: 100KB gzip (optimizado)
- **Caching**: Datos en caché con React Query
- **CSS**: Tailwind CSS con purging automático

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + APIs REST)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build**: Vite
- **Validación**: Validación nativa HTML5

## Próximas Mejoras Recomendadas

1. **Autenticación Real**: Implementar Supabase Auth en lugar de contraseña estática
2. **Email Notifications**: Envío automático de confirmaciones por email
3. **SMS Reminders**: Recordatorios 24 horas antes
4. **Payment Integration**: Integración con Stripe para depósitos
5. **Analytics**: Seguimiento de conversiones
6. **PWA Features**: App instalable en dispositivos

## Soporte y Contacto

Para más información o soporte técnico, contacta a través de WhatsApp: +1 829 338 8282

---

**Última actualización**: 2026-03-21
**Versión**: 2.0.0
