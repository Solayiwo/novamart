const { listProducts, findProduct } = require('../src/logic');

describe('product logic', () => {
  test('lists all products when no category is given', () => {
    expect(listProducts()).toHaveLength(4);
  });
  test('filters by category', () => {
    expect(listProducts('food')).toEqual([expect.objectContaining({ name: 'Rice 5kg' })]);
  });
  test('returns an empty list for an unknown category', () => {
    expect(listProducts('toys')).toEqual([]);
  });
  test('finds a product by id', () => {
    expect(findProduct('2').name).toBe('Smartphone X');
  });
  test('returns null for non-numeric or unknown ids', () => {
    expect(findProduct('abc')).toBeNull();
    expect(findProduct(99)).toBeNull();
  });
});
