import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  url: string;
  isFacebook: boolean;
  isActive: boolean;
  order: number;
}

interface CategoryState {
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, cat: Partial<Omit<Category, 'id' | 'order'>>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (activeId: string, overId: string) => void;
  toggleCategoryStatus: (id: string) => void;
}

const initialCategories: Category[] = [
  { id: 'cat_1', name: 'Thời tiết', url: '', isFacebook: false, isActive: true, order: 0 },
  { id: 'cat_2', name: 'Thị trường Tài chính', url: '', isFacebook: false, isActive: true, order: 1 },
  { id: 'cat_3', name: 'Lịch trình (Google Calendar)', url: '', isFacebook: false, isActive: true, order: 2 },
  { id: 'cat_4', name: 'Beatvn (Facebook Page)', url: 'https://facebook.com/beatvn', isFacebook: true, isActive: false, order: 3 },
  { id: 'cat_5', name: 'J2TEAM Community', url: 'https://facebook.com/j2team', isFacebook: true, isActive: false, order: 4 },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: initialCategories,

      addCategory: (cat) => set((state) => {
        const newId = `cat_${Date.now()}`;
        const maxOrder = state.categories.length > 0 ? Math.max(...state.categories.map(c => c.order)) : -1;
        return {
          categories: [...state.categories, { ...cat, id: newId, order: maxOrder + 1 }]
        };
      }),

      updateCategory: (id, updatedCat) => set((state) => ({
        categories: state.categories.map(cat => cat.id === id ? { ...cat, ...updatedCat } : cat)
      })),

      deleteCategory: (id) => set((state) => {
        const filtered = state.categories.filter(cat => cat.id !== id);
        // Re-assign orders
        const reordered = filtered.map((cat, index) => ({ ...cat, order: index }));
        return { categories: reordered };
      }),

      reorderCategories: (activeId, overId) => set((state) => {
        const oldIndex = state.categories.findIndex(cat => cat.id === activeId);
        const newIndex = state.categories.findIndex(cat => cat.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedArray = [...state.categories];
          const [movedItem] = reorderedArray.splice(oldIndex, 1);
          reorderedArray.splice(newIndex, 0, movedItem);
          
          // Update order property to match new array index
          const finalArray = reorderedArray.map((cat, index) => ({ ...cat, order: index }));
          return { categories: finalArray };
        }
        return state;
      }),

      toggleCategoryStatus: (id) => set((state) => ({
        categories: state.categories.map(cat => cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)
      })),
    }),
    {
      name: 'category-storage', // key in localStorage
    }
  )
);
