import { RootState } from "."

export const selectCartItems      = (s: RootState) => s.cart.items
export const selectCartTotalItems = (s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotalPrice = (s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
//                                              ^^^^^^^^ was i.price