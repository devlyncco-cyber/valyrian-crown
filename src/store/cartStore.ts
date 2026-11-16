import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedVariant?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedSize, selectedVariant) => {
        const sizeKey = selectedSize || 'Standard';
        const variantKey = selectedVariant || 'Default';
        const itemId = `${product.id}-${sizeKey}-${variantKey}`;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === itemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                product,
                quantity,
                selectedSize,
                selectedVariant,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price =
            item.product.sale_price !== null && item.product.sale_price !== undefined
              ? Number(item.product.sale_price)
              : Number(item.product.price);
          return sum + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'valyrian_crown_cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
