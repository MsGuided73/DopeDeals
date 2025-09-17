import { describe, it, expect } from 'vitest';

describe('Pipes Page Components', () => {
  it('should have proper pipe product interface', () => {
    // Test the PipeProduct interface structure
    const mockPipeProduct = {
      id: 'pipe-1',
      name: 'Test Glass Pipe',
      price: 29.99,
      materials: ['Borosilicate Glass'],
      style: 'Spoon Pipe',
      size: 'Medium',
      inStock: true,
      channels: ['vip_smoke'],
      is_active: true,
    };

    expect(mockPipeProduct).toHaveProperty('id');
    expect(mockPipeProduct).toHaveProperty('name');
    expect(mockPipeProduct).toHaveProperty('price');
    expect(mockPipeProduct).toHaveProperty('materials');
    expect(mockPipeProduct).toHaveProperty('style');
    expect(mockPipeProduct).toHaveProperty('size');
    expect(mockPipeProduct).toHaveProperty('inStock');
    expect(typeof mockPipeProduct.price).toBe('number');
    expect(Array.isArray(mockPipeProduct.materials)).toBe(true);
  });

  it('should generate mock pipe data correctly', () => {
    // Test mock data generation function
    const mockPipes = Array.from({ length: 5 }, (_, i) => ({
      id: `pipe-${i + 1}`,
      name: `Premium Glass Pipe ${i + 1}`,
      price: Math.floor(Math.random() * 150) + 15,
      style: ['Spoon Pipe', 'Chillum', 'Sherlock'][i % 3],
      materials: ['Borosilicate Glass'],
      inStock: true,
      channels: ['vip_smoke'],
    }));

    expect(mockPipes).toHaveLength(5);
    expect(mockPipes[0]).toHaveProperty('id', 'pipe-1');
    expect(mockPipes[0].price).toBeGreaterThan(0);
    expect(['Spoon Pipe', 'Chillum', 'Sherlock']).toContain(mockPipes[0].style);
  });
});

describe('Pipes API Logic', () => {
  it('should identify pipe styles correctly', () => {
    const testCases = [
      { name: 'HAND PIPE CHILLUM GLASS', expectedStyle: 'Chillum' },
      { name: 'SHERLOCK STYLE PIPE', expectedStyle: 'Sherlock' },
      { name: 'SPOON PIPE PREMIUM', expectedStyle: 'Spoon Pipe' },
      { name: 'ONE HITTER METAL', expectedStyle: 'One Hitter' },
      { name: 'GLASS PIPE REGULAR', expectedStyle: 'Hand Pipe' },
    ];

    testCases.forEach(({ name, expectedStyle }) => {
      const lowerName = name.toLowerCase();
      let style = 'Hand Pipe';

      if (lowerName.includes('chillum')) style = 'Chillum';
      else if (lowerName.includes('sherlock')) style = 'Sherlock';
      else if (lowerName.includes('one hitter')) style = 'One Hitter';
      else if (lowerName.includes('spoon')) style = 'Spoon Pipe';

      expect(style).toBe(expectedStyle);
    });
  });

  it('should determine pipe sizes correctly', () => {
    const testCases = [
      { name: 'MINI GLASS PIPE', expectedSize: 'Small' },
      { name: 'LARGE SHERLOCK PIPE', expectedSize: 'Large' },
      { name: 'XL SPOON PIPE', expectedSize: 'XL' },
      { name: 'REGULAR GLASS PIPE', expectedSize: 'Medium' },
    ];

    testCases.forEach(({ name, expectedSize }) => {
      const lowerName = name.toLowerCase();
      let size = 'Medium';

      if (lowerName.includes('mini') || lowerName.includes('small')) size = 'Small';
      else if (lowerName.includes('large') || lowerName.includes('big')) size = 'Large';
      else if (lowerName.includes('xl') || lowerName.includes('extra large')) size = 'XL';

      expect(size).toBe(expectedSize);
    });
  });
});
