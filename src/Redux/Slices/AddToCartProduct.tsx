import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Product type
interface CartProduct {
  qty: number;
  productData: any;
}

interface CartState {
  cartProducts: Record<string, CartProduct>;
}

const initialState: CartState = {
  cartProducts: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    // ADD PRODUCT TO CART
    addToCart: (
      state,
      action: PayloadAction<{
        productId: string;
        qty: number;
        productData: any;
      }>
    ) => {
      const { productId, qty, productData } = action.payload;

      state.cartProducts[productId] = {
        qty,
        productData,
      };
    },

    // REMOVE PRODUCT
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      delete state.cartProducts[productId];
    },

    // INCREMENT QTY
    incrementQty: (
      state,
      action: PayloadAction<{ productId: string; newQty?: number }>
    ) => {
      const { productId, newQty } = action.payload;
      const product = state.cartProducts[productId];

      if (product) {
        product.qty = newQty !== undefined ? newQty : product.qty + 1;
      }
    },

    // DECREMENT QTY
    decrementQty: (
      state,
      action: PayloadAction<{ productId: string; newQty?: number }>
    ) => {
      const { productId, newQty } = action.payload;
      const product = state.cartProducts[productId];

      if (product) {
        const calculatedQty =
          newQty !== undefined ? newQty : product.qty - 1;

        if (calculatedQty <= 0) {
          delete state.cartProducts[productId];
        } else {
          product.qty = calculatedQty;
        }
      }
    },

    // CLEAR CART
    clearCart: (state) => {
      state.cartProducts = {};
    },

    // SET QTY
    setQuantity: (
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) => {
      const { productId, qty } = action.payload;

      if (qty <= 0) {
        delete state.cartProducts[productId];
      } else {
        const existingProduct = state.cartProducts[productId];

        if (existingProduct) {
          existingProduct.qty = qty;
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
  setQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;