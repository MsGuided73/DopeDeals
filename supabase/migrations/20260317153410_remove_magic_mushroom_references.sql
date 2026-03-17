-- Update main_site_products to replace "Magic Mushroom" with "Functional Mushroom"
-- This maintains compliance while preserving brand names like "Magic Maze" (which don't contain "Mushroom")

UPDATE main_site_products
SET 
  name = REPLACE(REPLACE(REPLACE(name, 'Magic Mushroom', 'Functional Mushroom'), 'Magic mushroom', 'Functional mushroom'), 'magic mushroom', 'functional mushroom'),
  description = REPLACE(REPLACE(REPLACE(description, 'Magic Mushroom', 'Functional Mushroom'), 'Magic mushroom', 'Functional mushroom'), 'magic mushroom', 'functional mushroom')
WHERE 
  name ILIKE '%Magic Mushroom%' 
  OR description ILIKE '%Magic Mushroom%';
