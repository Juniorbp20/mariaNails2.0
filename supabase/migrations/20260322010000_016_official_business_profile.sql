/*
  # Perfil oficial — Maria Nails Studio & Pedicure
  Actualiza singleton business_profile con datos 100% oficiales.
  Agrega columna payment_details para Banreservas editable desde /admin.
*/

ALTER TABLE public.business_profile
  ADD COLUMN IF NOT EXISTS payment_details text;

UPDATE public.business_profile SET
  business_name = 'Maria Nails Studio & Pedicure',
  tagline = 'Belleza en tus manos y pies',
  hero_title = 'Bienvenida a Maria Nails Studio & Pedicure',
  hero_subtitle = 'Manicurista profesional: manicura, gel, pedicura spa y acrílico del #1 al #8. Solo con cita previa. Coffee bar de cortesía en cada visita.',
  about_title = 'Sobre María Bonifacio',
  about_description = 'Soy María Bonifacio, manicurista profesional técnica en manicura completa y pedicura. En Maria Nails Studio & Pedicure realzamos la belleza de tus manos y pies con atención delicada y personalizada.

Te esperamos en Gran Parada Tenares, Calle Principal #25, salida San Francisco de Macorís (en Salón Griselda, segundo nivel). Disfruta nuestro coffee bar de cortesía: café recién colado, tés, jugos y galletitas.',
  footer_description = 'Manicura, gel, pedicura spa y acrílico con atención profesional de María Bonifacio. Solo con cita previa.',
  contact_phone = '+1 829 338 8282',
  contact_whatsapp = 'https://wa.me/18293388282',
  address_line_1 = 'Gran Parada Tenares, Calle Principal #25, salida San Francisco de Macorís',
  address_line_2 = 'En Salón Griselda, segundo nivel, República Dominicana',
  payment_details = 'Efectivo en el local. Transferencia Banreservas cuenta 9605474442 a nombre de María Bonifacio.',
  updated_at = now()
WHERE singleton = true;
