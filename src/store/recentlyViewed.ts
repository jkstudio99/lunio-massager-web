import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface RecentlyViewedState {
  items: RecentItem[];
  addItem: (item: RecentItem) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== item.id);
          return { items: [item, ...filtered].slice(0, 12) };
        });
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'lunio-recently-viewed',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
