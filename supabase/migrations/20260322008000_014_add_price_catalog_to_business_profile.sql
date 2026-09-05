/*
  # Price catalog image on business profile

  1. Add `price_catalog_url` and `price_catalog_storage_path` columns
     to `business_profile` so the admin can upload a single price-list
     image from the dashboard (stored in the existing `branding` bucket).
  2. Public read is already covered by the existing SELECT policy.
*/

ALTER TABLE public.business_profile
  ADD COLUMN IF NOT EXISTS price_catalog_url text,
  ADD COLUMN IF NOT EXISTS price_catalog_storage_path text;
