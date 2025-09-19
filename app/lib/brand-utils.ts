import { supabaseServer } from './supabase-server';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

/**
 * Flexible brand matching utility that tries multiple strategies to find a brand
 * @param identifier - The brand identifier (slug, name, or partial match)
 * @param supabase - Optional Supabase client (defaults to supabaseServer)
 * @returns Brand object or null if not found
 */
export async function findBrandByIdentifier(
  identifier: string, 
  supabase = supabaseServer
): Promise<Brand | null> {
  if (!identifier) return null;

  // Strategy 1: Exact slug match
  const { data: exactMatch } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', identifier)
    .single();

  if (exactMatch) {
    return exactMatch as Brand;
  }

  // Strategy 2: Case-insensitive name match (convert dashes to spaces)
  const searchName = identifier.replace(/-/g, ' ');
  const { data: nameMatch } = await supabase
    .from('brands')
    .select('*')
    .ilike('name', `%${searchName}%`)
    .single();

  if (nameMatch) {
    return nameMatch as Brand;
  }

  // Strategy 3: Partial slug match (use first part of identifier)
  const firstPart = identifier.split('-')[0];
  if (firstPart && firstPart !== identifier) {
    const { data: partialMatch } = await supabase
      .from('brands')
      .select('*')
      .ilike('slug', `%${firstPart}%`)
      .single();

    if (partialMatch) {
      return partialMatch as Brand;
    }
  }

  // Strategy 4: Partial name match (use first part)
  const { data: partialNameMatch } = await supabase
    .from('brands')
    .select('*')
    .ilike('name', `%${firstPart}%`)
    .single();

  if (partialNameMatch) {
    return partialNameMatch as Brand;
  }

  // Strategy 5: Fuzzy matching for common brand variations
  const brandVariations = getBrandVariations(identifier);
  for (const variation of brandVariations) {
    const { data: variationMatch } = await supabase
      .from('brands')
      .select('*')
      .or(`name.ilike.%${variation}%,slug.ilike.%${variation}%`)
      .single();

    if (variationMatch) {
      return variationMatch as Brand;
    }
  }

  return null;
}

/**
 * Generate common variations of brand names for fuzzy matching
 */
function getBrandVariations(identifier: string): string[] {
  const variations: string[] = [];
  const cleaned = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Common brand name variations
  const brandMappings: Record<string, string[]> = {
    'raw': ['raw papers', 'raw rolling', 'raw organic'],
    'roor': ['roor glass', 'roor bong', 'roor water'],
    'puffco': ['puffco peak', 'puffco pro', 'puffco plus'],
    'storz': ['storz bickel', 'storz & bickel', 'volcano'],
    'bickel': ['storz bickel', 'storz & bickel'],
    'volcano': ['storz bickel', 'volcano vaporizer'],
    'grav': ['grav labs', 'gravitron'],
    'empire': ['empire glassworks', 'empire glass'],
    'higher': ['higher standards', 'higher standard'],
    'standard': ['higher standards', 'higher standard'],
    'standards': ['higher standards', 'higher standard']
  };

  // Add direct variations
  if (brandMappings[cleaned]) {
    variations.push(...brandMappings[cleaned]);
  }

  // Add common suffixes/prefixes
  variations.push(
    `${cleaned} glass`,
    `${cleaned} labs`,
    `${cleaned} works`,
    `${cleaned} co`,
    `${cleaned} company`
  );

  return variations;
}

/**
 * Create a brand slug from a name
 */
export function createBrandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get products for a brand with safety filters
 */
export async function getBrandProducts(
  brandId: string, 
  supabase = supabaseServer
) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brand products:', error);
    return [];
  }

  return products || [];
}
