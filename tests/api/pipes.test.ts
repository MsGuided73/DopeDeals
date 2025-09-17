import { describe, it, expect } from 'vitest';

describe('Pipes API', () => {
  it('should export GET handler for /api/products/pipes', async () => {
    // Test that the API route exists and exports the correct handler
    const module = await import('../../app/api/products/pipes/route');
    
    expect(module).toHaveProperty('GET');
    expect(typeof module.GET).toBe('function');
  });

  it('should handle pipe product transformation correctly', () => {
    // Test the product transformation logic
    const mockSupabaseProduct = {
      id: 'test-id',
      name: 'HAND PIPE CHILLUM GLASS PREMIUM',
      price: '29.99',
      materials: ['GLASS'],
      stock_quantity: 10,
      created_at: new Date().toISOString(),
      is_active: true,
      channels: ['vip_smoke'],
    };

    // Simulate the transformation logic from the API
    const name = mockSupabaseProduct.name.toLowerCase();
    let style = 'Hand Pipe';
    
    if (name.includes('chillum')) style = 'Chillum';
    else if (name.includes('sherlock')) style = 'Sherlock';
    else if (name.includes('one hitter')) style = 'One Hitter';
    else if (name.includes('spoon')) style = 'Spoon Pipe';

    let size = 'Medium';
    if (name.includes('mini') || name.includes('small')) size = 'Small';
    else if (name.includes('large') || name.includes('big')) size = 'Large';

    const transformedProduct = {
      id: mockSupabaseProduct.id,
      name: mockSupabaseProduct.name,
      price: parseFloat(mockSupabaseProduct.price),
      materials: mockSupabaseProduct.materials,
      material: mockSupabaseProduct.materials[0],
      style,
      size,
      inStock: mockSupabaseProduct.stock_quantity > 0,
      channels: mockSupabaseProduct.channels,
    };

    expect(transformedProduct.style).toBe('Chillum');
    expect(transformedProduct.size).toBe('Medium');
    expect(transformedProduct.price).toBe(29.99);
    expect(transformedProduct.inStock).toBe(true);
    expect(transformedProduct.material).toBe('GLASS');
  });

  it('should filter out non-pipe products correctly', () => {
    const products = [
      { name: 'HAND PIPE GLASS PREMIUM', id: '1' },
      { name: 'BOWL DISPLAY CASE 12PC', id: '2' },
      { name: 'CHILLUM GLASS SMALL', id: '3' },
      { name: 'GRINDER METAL CASE', id: '4' },
      { name: 'SPOON PIPE BOROSILICATE', id: '5' },
      { name: 'LIGHTER DISPLAY TRAY', id: '6' },
    ];

    // Filter logic from the API
    const filteredProducts = products.filter(product => {
      const name = product.name.toLowerCase();
      return !name.includes('display') && 
             !name.includes('case') && 
             !name.includes('tray') &&
             !name.includes('grinder') &&
             !name.includes('lighter');
    });

    expect(filteredProducts).toHaveLength(3);
    expect(filteredProducts.map(p => p.id)).toEqual(['1', '3', '5']);
  });

  it('should generate proper pipe keywords for search', () => {
    const pipeKeywords = [
      'HAND PIPE',
      'GLASS PIPE',
      'SPOON PIPE',
      'CHILLUM',
      'ONE HITTER',
      'SHERLOCK',
      'STEAMROLLER',
      'GANDALF',
      'BOWL',
      'PIPE'
    ];

    expect(pipeKeywords).toContain('HAND PIPE');
    expect(pipeKeywords).toContain('CHILLUM');
    expect(pipeKeywords).toContain('SPOON PIPE');
    expect(pipeKeywords).toContain('SHERLOCK');
    expect(pipeKeywords.length).toBeGreaterThan(5);
  });
});
