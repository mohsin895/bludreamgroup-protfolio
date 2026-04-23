import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

// ─── Cart product shape ───────────────────────────────────────────────────────
// A lean, serialisable snapshot of whatever was added to cart.
// Works for books (with a selected format) and generic products.

export interface CartProduct {
    id:        number;
    slug:      string;
    name:      string;       // book title or product name
    image:     string | null;
    price:     number;
    // optional variant fields
    formatId?:    number;
    formatLabel?: string;    // "Hardcover", "eBook" …
    color?:    string;
    colorHex?: string;
    size?:     string;
    stock?:    number;
    category?: string;
}

export interface CartItem {
    cartKey:  string;         // `${productId}[-${formatId}][-${color}][-${size}]`
    product:  CartProduct;
    quantity: number;
}

export interface CartState {
    items: CartItem[]
    isDrawerOpen: boolean
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

function loadState(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem("cart_items");
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

function saveState(items: CartItem[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem("cart_items", JSON.stringify(items));
    } catch {/* ignore */}
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: CartState = {
    items:        loadState(),
    isDrawerOpen: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addItem(state, action: PayloadAction<{ product: CartProduct; quantity?: number }>) {
            const { product, quantity = 1 } = action.payload;

            // Build a stable key
            const parts = [String(product.id)];
            if (product.formatId)  parts.push(String(product.formatId));
            if (product.color)     parts.push(product.color);
            if (product.size)      parts.push(product.size);
            const cartKey = parts.join("-");

            const existing = state.items.find((i) => i.cartKey === cartKey);
            if (existing) {
                const max = product.stock ?? Infinity;
                existing.quantity = Math.min(existing.quantity + quantity, max);
            } else {
                state.items.push({ cartKey, product, quantity });
            }

            state.isDrawerOpen = true;
            saveState(state.items);
        },

        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.cartKey !== action.payload);
            saveState(state.items);
        },

        updateQuantity(state, action: PayloadAction<{ cartKey: string; quantity: number }>) {
            const { cartKey, quantity } = action.payload;
            const item = state.items.find((i) => i.cartKey === cartKey);
            if (!item) return;
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.cartKey !== cartKey);
            } else {
                const max = item.product.stock ?? Infinity;
                item.quantity = Math.min(quantity, max);
            }
            saveState(state.items);
        },

        clearCart(state) {
            state.items = [];
            saveState([]);
        },

        openDrawer(state)  { state.isDrawerOpen = true;  },
        closeDrawer(state) { state.isDrawerOpen = false; },
        toggleDrawer(state){ state.isDrawerOpen = !state.isDrawerOpen; },
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

export const selectCartItems      = (s: RootState) => s.cart.items;
export const selectIsDrawerOpen   = (s: RootState) => s.cart.isDrawerOpen;
export const selectTotalItems     = (s: RootState) =>
    s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectTotalPrice     = (s: RootState) =>
    s.cart.items.reduce((n, i) => n + i.product.price * i.quantity, 0);

export default cartSlice.reducer;