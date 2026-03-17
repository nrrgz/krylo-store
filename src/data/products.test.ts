import { describe, expect, it } from 'vitest';
import { products } from './products';

describe('products data integrity', () => {
  it('keeps imagesByColor mappings aligned with product colors and images', () => {
    for (const product of products) {
      if (!product.imagesByColor) continue;

      const colorSet = new Set(product.colors.map((color) => color.name));
      const imageSet = new Set(product.images);

      for (const [colorName, imagePath] of Object.entries(product.imagesByColor)) {
        expect(colorSet.has(colorName)).toBe(true);
        expect(imageSet.has(imagePath)).toBe(true);
      }
    }
  });
});
