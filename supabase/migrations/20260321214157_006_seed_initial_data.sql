/*
  # Seed Initial Data

  1. Insert Services
  2. Insert Availability Slots (working hours)
  3. Insert Admin User
*/

-- Insert Services (idempotent by service name)
INSERT INTO services (name, description, duration_minutes, price, category, active)
SELECT seed.name, seed.description, seed.duration_minutes, seed.price, seed.category, seed.active
FROM (
  VALUES
    (
      'Sistema de Acrílico',
      'Extensiones resistentes y duraderas con acabado perfecto. Ideal para uñas largas y fuertes con diseños personalizados.',
      90,
      65.00,
      'Extensiones',
      true
    ),
    (
      'Sistema de Gel',
      'Uñas naturales o extensión con gel, brillo intenso y mayor resistencia. Perfecto para un look elegante y natural.',
      75,
      55.00,
      'Gel',
      true
    ),
    (
      'Manicura',
      'Cuidado completo de tus manos, incluye limado, cutícula, masaje relajante y esmaltado profesional.',
      45,
      25.00,
      'Manicura',
      true
    ),
    (
      'Pedicura',
      'Tratamiento spa para tus pies, incluye exfoliación, masaje relajante, hidratación y esmaltado.',
      60,
      35.00,
      'Pedicura',
      true
    ),
    (
      'Diseño de Uñas',
      'Diseños personalizados y artísticos para tus uñas. Elige entre diferentes estilos y patrones únicos.',
      45,
      30.00,
      'Diseño',
      true
    ),
    (
      'Reparación de Acrílico',
      'Reparación y mantenimiento de extensiones acrílicas, arreglo de roturas y refuerzo.',
      30,
      20.00,
      'Mantenimiento',
      true
    )
) AS seed(name, description, duration_minutes, price, category, active)
WHERE NOT EXISTS (
  SELECT 1
  FROM services s
  WHERE s.name = seed.name
);

-- Insert Availability Slots (Working Hours)
INSERT INTO availability_slots (day_of_week, start_time, end_time, break_start, break_end, is_active)
VALUES
  (1, '09:00:00', '18:00:00', '13:00:00', '14:00:00', true),
  (3, '09:00:00', '18:00:00', '13:00:00', '14:00:00', true),
  (4, '09:00:00', '18:00:00', '13:00:00', '14:00:00', true),
  (5, '09:00:00', '18:00:00', '13:00:00', '14:00:00', true),
  (6, '09:00:00', '17:00:00', '13:00:00', '14:00:00', true)
ON CONFLICT (day_of_week) DO NOTHING;

-- Insert Admin User (temporary seed)
INSERT INTO admin_users (email)
VALUES ('admin@marianails.com')
ON CONFLICT (email) DO NOTHING;
