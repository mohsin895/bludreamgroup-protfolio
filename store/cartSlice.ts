// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartProduct {
    id:           number
    slug:         string
    name:         string
    image:        string | null
    price:        number
    formatId?:    number | null
    formatLabel?: string | null
    stock?:       number | null
    color?:       string | null
    colorHex?:    string | null
    size?:        string | null
    category?:    string | null
}

export interface CartItem {
    cartKey:  string      // unique: `${product.id}-${formatId ?? "default"}`
    product:  CartProduct
    quantity: number
}

export interface CartState {
    items:        CartItem[]
    isDrawerOpen: boolean
}

const STORAGE_KEY = "cart_items"

function loadFromStorage(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveToStorage(items: CartItem[]) {
    if (typeof window === "undefined") return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
}

function makeCartKey(productId: number, formatId?: number | null): string {
    return `${productId}-${formatId ?? "default"}`
}

const initialState: CartState = {
    items:        [],           // hydrated client-side in slice actions
    isDrawerOpen: false,
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Must be called once on app mount to hydrate from localStorage
        hydrateCart(state) {
            state.items = loadFromStorage()
        },

        openDrawer(state)   { state.isDrawerOpen = true  },
        closeDrawer(state)  { state.isDrawerOpen = false },
        toggleDrawer(state) { state.isDrawerOpen = !state.isDrawerOpen },

        addItem(
            state,
            action: PayloadAction<{ product: CartProduct; quantity?: number }>
        ) {
            const { product, quantity = 1 } = action.payload
            const key = makeCartKey(product.id, product.formatId)
            const existing = state.items.find((i) => i.cartKey === key)

            if (existing) {
                const maxQty = product.stock ?? Infinity
                existing.quantity = Math.min(existing.quantity + quantity, maxQty)
            } else {
                state.items.push({ cartKey: key, product, quantity })
            }

            saveToStorage(state.items)
            state.isDrawerOpen = true
        },

        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.cartKey !== action.payload)
            saveToStorage(state.items)
        },

        updateQuantity(
            state,
            action: PayloadAction<{ cartKey: string; quantity: number }>
        ) {
            const { cartKey, quantity } = action.payload
            const item = state.items.find((i) => i.cartKey === cartKey)
            if (!item) return

            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.cartKey !== cartKey)
            } else {
                const maxQty = item.product.stock ?? Infinity
                item.quantity = Math.min(quantity, maxQty)
            }

            saveToStorage(state.items)
        },

        clearCart(state) {
            state.items = []
            saveToStorage([])
        },
    },
})

export const {
    hydrateCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
} = cartSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectCartItems    = (state: RootState) => state.cart.items
export const selectIsDrawerOpen = (state: RootState) => state.cart.isDrawerOpen

export const selectTotalItems = (state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectTotalPrice = (state: RootState) =>
    state.cart.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
    )

export default cartSlice.reducer