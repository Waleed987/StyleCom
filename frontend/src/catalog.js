import api from './api';
import { demoProducts } from './data/demoProducts';

// Set VITE_DEMO_DATA=false to use the backend inventory.
export const demoMode = import.meta.env.VITE_DEMO_DATA !== 'false';

export async function getInventory() {
  if (demoMode) return demoProducts;
  const response = await api.get('/api/inventory/collection');
  return response.data.inventoryItems;
}
