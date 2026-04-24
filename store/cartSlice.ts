import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

// ─── Shape ────────────────────────────────────────────────────────────────────

export interface CartProduct {
    id:           number;
    slug:         string;
    name:         string;
    image:        string | null;
    price:        number;
    formatId?:    number;
    formatLabel?: string;
    color?:       string;
    colorHex?:    string;
    size?:        string;
    stock?:       number;
    category?:    string;
}

export interface CartItem {
    cartKey:  string;
    product:  CartProduct;
    quantity: number;
}

export interface CartState {
    items:        CartItem[];
    isDrawerOpen: boolean;
}

// ─── Initial state ────────────────────────────────────────────────────────────
// NOTE: Do NOT loadState() here — redux-persist handles rehydration.
// The persisted items will be injected automatically.

const initialState: CartState = {
    items:        [],
    isDrawerOpen: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCartKey(product: CartProduct): string {
    const parts = [String(product.id)];
    if (product.formatId) parts.push(String(product.formatId));
    if (product.color)    parts.push(product.color);
    if (product.size)     parts.push(product.size);
    return parts.join("-");
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addItem(
            state,
            action: PayloadAction<{ product: CartProduct; quantity?: number }>
        ) {
            const { product, quantity = 1 } = action.payload;
            const cartKey = makeCartKey(product);
            const existing = state.items.find((i) => i.cartKey === cartKey);

            if (existing) {
                const max = product.stock ?? Infinity;
                existing.quantity = Math.min(existing.quantity + quantity, max);
            } else {
                state.items.push({ cartKey, product, quantity });
            }

            state.isDrawerOpen = true;
        },

        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.cartKey !== action.payload);
        },

        updateQuantity(
            state,
            action: PayloadAction<{ cartKey: string; quantity: number }>
        ) {
            const { cartKey, quantity } = action.payload;
            const item = state.items.find((i) => i.cartKey === cartKey);
            if (!item) return;
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.cartKey !== cartKey);
            } else {
                item.quantity = Math.min(quantity, item.product.stock ?? Infinity);
            }
        },

        clearCart(state) {
            state.items = [];
        },

        openDrawer(state)   { state.isDrawerOpen = true;  },
        closeDrawer(state)  { state.isDrawerOpen = false; },
        toggleDrawer(state) { state.isDrawerOpen = !state.isDrawerOpen; },
    },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
} = cartSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCartItems    = (s: RootState) => s.cart.items;
export const selectIsDrawerOpen = (s: RootState) => s.cart.isDrawerOpen;
export const selectTotalItems   = (s: RootState) =>
    s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectTotalPrice   = (s: RootState) =>
    s.cart.items.reduce((n, i) => n + i.product.price * i.quantity, 0);

export default cartSlice.reducer;