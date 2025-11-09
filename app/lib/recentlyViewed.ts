// Utility functions for managing recently viewed products in localStorage

interface RecentlyViewedProduct {
  id: string;
  viewedAt: number;
}

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 20; // Keep up to 20 recently viewed products

export function addToRecentlyViewed(productId: string): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecentlyViewedProduct[];

    // Remove the product if it already exists (to update its position)
    const filtered = existing.filter(item => item.id !== productId);

    // Add the product to the beginning of the array
    const updated = [
      { id: productId, viewedAt: Date.now() },
      ...filtered
    ].slice(0, MAX_ITEMS); // Keep only the most recent items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating recently viewed products:', error);
  }
}

export function getRecentlyViewed(): RecentlyViewedProduct[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RecentlyViewedProduct[];
  } catch (error) {
    console.error('Error retrieving recently viewed products:', error);
    return [];
  }
}

export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed products:', error);
  }
}
