/*
  # Official catalog seed — Maria Nails Studio & Pedicure
  Sincroniza servicios con lista oficial DOP.
  - Manicura (4), Gel (2), Pedicura (1), Nail Art (1)
  - Acrílico: 6 estilos x 8 largos = 48 variantes editables desde /admin
  Idempotente por nombre.
*/

-- 1) Servicios base oficiales
INSERT INTO services (name, description, duration_minutes, price, category, active)
SELECT seed.name, seed.description, seed.duration_minutes, seed.price, seed.category, true
FROM (
  VALUES
    ('Manicura en Seco', 'Retiro de cutículas con drill, pintura regular e hidratación de cutícula.', 40, 250, 'Manicura'),
    ('Manicura en Seco en Gel', 'Retiro de cutículas con drill, pintura en gel e hidratación de cutícula.', 50, 450, 'Manicura'),
    ('Manicura Regular', 'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y pintura regular.', 60, 600, 'Manicura'),
    ('Manicura en Gel', 'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y esmaltado en gel de larga duración.', 70, 800, 'Manicura'),
    ('Esmaltado en gel sobre uña natural', 'Esmaltado en gel de larga duración sobre tu uña natural.', 45, 450, 'Gel'),
    ('Sistemas en Gel (Rubber / Acry / Builder)', 'Sistemas avanzados Rubber Gel, Acry Gel y Builder Gel. Precio base desde RD$ 1,234 según largo y diseño.', 90, 1234, 'Gel'),
    ('Pedicura completa', 'Exfoliación, hidratación profunda, tratamiento y esmaltado. Aprox. 3 horas de atención y máxima relajación.', 180, 1234, 'Pedicura'),
    ('Nail Art & Decoración', 'Diseños a mano alzada, stickers, 3D, pedrería, gel sólido y diseños personalizados. Trae fotos de referencia para cotizar detalles.', 30, 0, 'Nail Art')
) AS seed(name, description, duration_minutes, price, category)
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.name = seed.name);

-- Actualiza precios por si ya existían con otro valor
UPDATE services SET
  description = seed.description,
  duration_minutes = seed.duration_minutes,
  price = seed.price,
  category = seed.category,
  active = true,
  updated_at = now()
FROM (
  VALUES
    ('Manicura en Seco', 'Retiro de cutículas con drill, pintura regular e hidratación de cutícula.', 40, 250, 'Manicura'),
    ('Manicura en Seco en Gel', 'Retiro de cutículas con drill, pintura en gel e hidratación de cutícula.', 50, 450, 'Manicura'),
    ('Manicura Regular', 'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y pintura regular.', 60, 600, 'Manicura'),
    ('Manicura en Gel', 'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y esmaltado en gel de larga duración.', 70, 800, 'Manicura'),
    ('Esmaltado en gel sobre uña natural', 'Esmaltado en gel de larga duración sobre tu uña natural.', 45, 450, 'Gel'),
    ('Sistemas en Gel (Rubber / Acry / Builder)', 'Sistemas avanzados Rubber Gel, Acry Gel y Builder Gel. Precio base desde RD$ 1,234 según largo y diseño.', 90, 1234, 'Gel'),
    ('Pedicura completa', 'Exfoliación, hidratación profunda, tratamiento y esmaltado. Aprox. 3 horas de atención y máxima relajación.', 180, 1234, 'Pedicura'),
    ('Nail Art & Decoración', 'Diseños a mano alzada, stickers, 3D, pedrería, gel sólido y diseños personalizados. Trae fotos de referencia para cotizar detalles.', 30, 0, 'Nail Art')
) AS seed(name, description, duration_minutes, price, category)
WHERE services.name = seed.name;

-- 2) Matriz acrílica oficial
-- Duración estimada por largo: #1-2:90, #3-4:105, #5-6:120, #7-8:150
WITH acrylic(style_label, short_label, p1, p2, p3, p4, p5, p6, p7, p8) AS (
  VALUES
    ('Uñas con pintura regular', 'Pintura Regular', 750, 800, 850, 900, 1000, 1150, 1300, 1400),
    ('Cover Liso', 'Cover Liso', 800, 900, 1000, 1250, 1350, 1500, 1650, 1800),
    ('Cover French', 'Cover French', 850, 950, 1050, 1200, 1350, 1500, 1650, 1800),
    ('Acrílico + Gel', 'Acrílico + Gel', 900, 1000, 1150, 1250, 1350, 1500, 1750, 1900),
    ('Baby Boomer', 'Baby Boomer', 950, 1100, 1200, 1350, 1500, 1650, 1800, 2000),
    ('Full Set (Set Completo)', 'Full Set', 1000, 1250, 1300, 1450, 1600, 1700, 1850, 2100)
),
lengths(n, price_col, duration_min) AS (
  VALUES (1,'p1',90),(2,'p2',90),(3,'p3',105),(4,'p4',105),(5,'p5',120),(6,'p6',120),(7,'p7',150),(8,'p8',150)
),
expanded AS (
  SELECT
    ('Acrílico ' || a.short_label || ' #' || l.n) AS name,
    ('Sistema en acrílico estilo ' || a.style_label || ', largo #' || l.n || '.') AS description,
    l.duration_min AS duration_minutes,
    CASE l.price_col
      WHEN 'p1' THEN a.p1 WHEN 'p2' THEN a.p2 WHEN 'p3' THEN a.p3 WHEN 'p4' THEN a.p4
      WHEN 'p5' THEN a.p5 WHEN 'p6' THEN a.p6 WHEN 'p7' THEN a.p7 ELSE a.p8
    END AS price
  FROM acrylic a CROSS JOIN lengths l
)
INSERT INTO services (name, description, duration_minutes, price, category, active)
SELECT e.name, e.description, e.duration_minutes, e.price, 'Acrílico', true
FROM expanded e
WHERE NOT EXISTS (SELECT 1 FROM services s WHERE s.name = e.name);

-- Sincroniza precios acrílicos aunque ya existan
WITH acrylic(style_label, short_label, p1, p2, p3, p4, p5, p6, p7, p8) AS (
  VALUES
    ('Uñas con pintura regular', 'Pintura Regular', 750, 800, 850, 900, 1000, 1150, 1300, 1400),
    ('Cover Liso', 'Cover Liso', 800, 900, 1000, 1250, 1350, 1500, 1650, 1800),
    ('Cover French', 'Cover French', 850, 950, 1050, 1200, 1350, 1500, 1650, 1800),
    ('Acrílico + Gel', 'Acrílico + Gel', 900, 1000, 1150, 1250, 1350, 1500, 1750, 1900),
    ('Baby Boomer', 'Baby Boomer', 950, 1100, 1200, 1350, 1500, 1650, 1800, 2000),
    ('Full Set (Set Completo)', 'Full Set', 1000, 1250, 1300, 1450, 1600, 1700, 1850, 2100)
),
lengths(n, price_col) AS (
  VALUES (1,'p1'),(2,'p2'),(3,'p3'),(4,'p4'),(5,'p5'),(6,'p6'),(7,'p7'),(8,'p8')
)
UPDATE services SET
  price = CASE l.price_col
    WHEN 'p1' THEN a.p1 WHEN 'p2' THEN a.p2 WHEN 'p3' THEN a.p3 WHEN 'p4' THEN a.p4
    WHEN 'p5' THEN a.p5 WHEN 'p6' THEN a.p6 WHEN 'p7' THEN a.p7 ELSE a.p8
  END,
  category = 'Acrílico',
  active = true,
  updated_at = now()
FROM acrylic a, lengths l
WHERE services.name = ('Acrílico ' || a.short_label || ' #' || l.n);

-- 3) Desactiva seeds genéricos antiguos en dólares que ya no corresponden
UPDATE services SET active = false, updated_at = now()
WHERE name IN (
  'Sistema de Acrílico',
  'Sistema de Gel',
  'Manicura',
  'Pedicura',
  'Diseño de Uñas',
  'Reparación de Acrílico'
);
