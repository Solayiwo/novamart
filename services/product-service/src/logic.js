const PRODUCTS = [
  { id: 1, name: 'Ankara Fabric', category: 'clothing', price: 45 },
  { id: 2, name: 'Smartphone X', category: 'electronics', price: 320 },
  { id: 3, name: 'Blender 1.5L', category: 'household', price: 60 },
  { id: 4, name: 'Rice 5kg', category: 'food', price: 18 },
];

function listProducts(category) {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

function findProduct(id) {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  return PRODUCTS.find((p) => p.id === n) || null;
}

module.exports = { listProducts, findProduct };
