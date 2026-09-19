// Stable IDs keep product links and saved carts usable across reloads.
export const demoProducts = [
  ['demo-01', 'Everyday Cotton Shirt', 4500, '/home3.webp', 'male', 'Shirts'],
  ['demo-02', 'Relaxed Summer Set', 7900, '/home4.webp', 'female', 'Co-ords'],
  ['demo-03', 'Core Oversized Tee', 3200, '/home5.webp', 'male', 'T-Shirts'],
  ['demo-04', 'Printed Everyday Shirt', 5200, '/home6.webp', 'female', 'Shirts'],
  ['demo-05', 'Heritage Overshirt', 8500, '/home7.webp', 'male', 'Outerwear'],
  ['demo-06', 'Weekend Relaxed Set', 8900, '/home8.jpg', 'female', 'Co-ords'],
  ['demo-07', 'Signature Summer Shirt', 5900, '/hero.webp', 'male', 'Shirts'],
  ['demo-08', 'Soft Cotton Tunic', 6200, '/hero2.webp', 'female', 'Tunics'],
  ['demo-09', 'Essential Layering Shirt', 4800, '/home3.webp', 'male', 'Shirts'],
  ['demo-10', 'Summer Statement Set', 9500, '/home4.webp', 'female', 'Co-ords'],
  ['demo-11', 'Studio Relaxed Tee', 3500, '/home5.webp', 'male', 'T-Shirts'],
  ['demo-12', 'Classic Everyday Top', 4200, '/home6.webp', 'female', 'Tops'],
].map(([_id, productName, price, imageUrl, gender, subcategory]) => ({
  _id, productName, price, imageUrl, gender, subcategory,
  availability: 'in-stock',
  size: 'XS, S, M, L, XL, XXL',
}));
