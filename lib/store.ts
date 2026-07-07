import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, Category, Blog, Settings } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  savedProducts: Product[];
  addSavedProduct: (product: Product) => void;
  removeSavedProduct: (id: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface UIState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface SavedProductsState {
  savedProducts: Product[];
  addSavedProduct: (product: Product) => void;
  removeSavedProduct: (productId: string) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      savedProducts: [],

  addSavedProduct: (product) =>
    set((state) => ({
      savedProducts: [...state.savedProducts, product],
    })),

  removeSavedProduct: (id) =>
    set((state) => ({
      savedProducts: state.savedProducts.filter(
        (p) => p._id !== id
      ),
    })),

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Saved Products Store
export const useSavedProductsStore = create<SavedProductsState>()(
  persist(
    (set) => ({
      savedProducts: [],
      addSavedProduct: (product) =>
        set((state) => ({
          savedProducts: [...state.savedProducts, product],
        })),
      removeSavedProduct: (productId) =>
        set((state) => ({
          savedProducts: state.savedProducts.filter(
            (p) => p._id !== productId
          ),
        })),
    }),
    {
      name: 'saved-products-storage',
    }
  )
);