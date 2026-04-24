/**
 * Extra cart selectors that complement cartSlice.ts.
 * Import from here OR from cartSlice — both work.
 *
 * These are re-exported for backwards compatibility with any file
 * that imports from "@/store/cartSelectors".
 */
export {
    selectCartItems,
    selectIsDrawerOpen,
    selectTotalItems,
    selectTotalPrice,
} from "./cartSlice";