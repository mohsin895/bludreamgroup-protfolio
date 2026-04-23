"use client"

import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    closeDrawer,
    removeItem,
    updateQuantity,
    selectCartItems,
    selectIsDrawerOpen,
    selectTotalItems,
    selectTotalPrice,
} from "@/store/cartSlice"
import { useEffect } from "react"

export function CartDrawer() {
    const dispatch   = useAppDispatch()
    const items      = useAppSelector(selectCartItems)
    const isOpen     = useAppSelector(selectIsDrawerOpen)
    const totalItems = useAppSelector(selectTotalItems)
    const totalPrice = useAppSelector(selectTotalPrice)

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") dispatch(closeDrawer()) }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [dispatch])

    const shipping = totalPrice > 100 ? 0 : 15
    const total    = totalPrice + shipping

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => dispatch(closeDrawer())}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-base font-semibold text-gray-900">
                            Your Cart
                            {totalItems > 0 && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={() => dispatch(closeDrawer())}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm mb-1">Your cart is empty</p>
                            <p className="text-gray-400 text-xs mb-6">Add items to get started</p>
                            <Link
                                href="/"
                                onClick={() => dispatch(closeDrawer())}
                                className="text-sm font-medium text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Free shipping progress */}
                            {totalPrice < 100 && (
                                <div className="bg-red-50 rounded-lg px-4 py-3">
                                    <p className="text-xs text-red-700 font-medium mb-1.5">
                                        Add <span className="font-bold">৳{(100 - totalPrice).toFixed(0)}</span> more for free shipping!
                                    </p>
                                    <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Cart rows */}
                            {items.map(({ cartKey, product, quantity }) => {
                                const maxQty = product.stock ?? Infinity

                                return (
                                    <div key={cartKey} className="flex gap-3 pb-5 border-b border-gray-100 last:border-0">

                                        {/* Product image */}
                                        <Link
                                            href={`/details/${product.id}`}
                                            onClick={() => dispatch(closeDrawer())}
                                            className="shrink-0"
                                        >
                                            {/* ✅ plain <img> — avoids Next.js URL validation on relative/partial URLs */}
                                            <div className="w-20 h-24 overflow-hidden bg-gray-100">
                                                <img
                                                    src={product.image || ""}
                                                    alt={product.name}
                                                    className="object-cover w-full h-full"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = ""
                                                    }}
                                                />
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    {product.category && (
                                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
                                                            {product.category}
                                                        </p>
                                                    )}
                                                    <Link
                                                        href={`/details/${product.slug}`}
                                                        onClick={() => dispatch(closeDrawer())}
                                                    >
                                                        <h3 className="text-sm font-medium text-gray-900 truncate hover:text-red-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    {/* Color & Size badges */}
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                        {product.color && (
                                                            <div className="flex items-center gap-1">
                                                                <span
                                                                    className="inline-block w-3 h-3 rounded-full border border-gray-300 shrink-0"
                                                                    style={{ backgroundColor: product.colorHex ?? "#d1d5db" }}
                                                                />
                                                                <span className="text-[11px] text-gray-500 capitalize">{product.color}</span>
                                                            </div>
                                                        )}
                                                        {product.color && product.size && (
                                                            <span className="text-gray-300 text-[11px]">|</span>
                                                        )}
                                                        {product.size && (
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-[11px] font-medium text-gray-600 uppercase">
                                                                {product.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remove button */}
                                                <button
                                                    onClick={() => dispatch(removeItem(cartKey))}
                                                    className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                {/* Quantity stepper */}
                                                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ cartKey, quantity: quantity - 1 }))}
                                                        disabled={quantity <= 1}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Decrease"
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="w-7 text-center text-sm font-medium text-gray-900">{quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ cartKey, quantity: quantity + 1 }))}
                                                        disabled={quantity >= maxQty}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Increase"
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ৳{(product.price * quantity).toLocaleString()}
                                                    </p>
                                                    {quantity > 1 && (
                                                        <p className="text-[10px] text-gray-400">৳{product.price.toLocaleString()} each</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stock warning when at limit */}
                                            {quantity >= maxQty && maxQty !== Infinity && (
                                                <p className="text-[10px] text-orange-500 mt-1 font-medium">
                                                    Max stock reached ({maxQty})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-white">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">৳{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>৳{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={() => dispatch(closeDrawer())}
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-colors"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/cart"
                            onClick={() => dispatch(closeDrawer())}
                            className="block text-center text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
                        >
                            View full cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}