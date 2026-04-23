// ─── lib/product-utils.ts ─────────────────────────────────────────────────────

import type { ProductAPI, ProductImageAPI, NormalizedProduct, ColorSwatch, SizePrice } from "@/types/product"

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

export const COLOR_MAP: Record<string, string> = {
    red: "#ef4444",   blue: "#3b82f6",   green: "#22c55e",  black: "#111827",
    white: "#f3f4f6", yellow: "#eab308", orange: "#f97316", purple: "#a855f7",
    pink: "#ec4899",  gray: "#6b7280",   grey: "#6b7280",   navy: "#1e3a5f",
    brown: "#92400e", beige: "#d4b896",  maroon: "#7f1d1d", mustard: "#ca8a04",
    olive: "#65a30d", teal: "#0d9488",   cyan: "#06b6d4",   indigo: "#6366f1",
    violet: "#7c3aed", silver: "#9ca3af", gold: "#d97706",
}

export function colorToHex(name: string): string {
    return COLOR_MAP[name?.toLowerCase().trim()] ?? "#d1d5db"
}

export function isLight(hex: string): boolean {
    const h = hex.replace("#", "")
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

export function isDiscountActive(p: ProductAPI): boolean {
    if (p.has_discount !== "yes" || !p.discount_amount) return false
    const now   = Date.now()
    const start = p.discount_start_date ? new Date(p.discount_start_date).getTime() : -Infinity
    const end   = p.discount_end_date   ? new Date(p.discount_end_date).getTime()   :  Infinity
    return now >= start && now <= end
}

export function applyDiscount(price: number, p: ProductAPI): number {
    if (!isDiscountActive(p) || !p.discount_amount) return price
    const amt = Number(p.discount_amount)
    if (p.discount_type === "percent") return Math.max(0, price - (price * amt) / 100)
    return Math.max(0, price - amt)
}

export function resolveImage(
    img: ProductImageAPI | null,
    size: "small" | "medium" | "large" | "original" = "medium",
): string {
    if (!img) return ""
    const path = img[size] ?? img.medium ?? img.original ?? ""
    return path ? `${IMAGE_BASE_URL}${path}` : ""
}

export function normalizeProduct(p: ProductAPI): NormalizedProduct {
    const allSalePrices: number[] = []
    const allSizes: string[]      = []
    let   totalStock              = 0
    const colors: ColorSwatch[]   = []
    const discountActive          = isDiscountActive(p)

    for (const cv of p.product_variant_color ?? []) {
        const sizePrices: SizePrice[] = []

        for (const sv of cv?.product_variant_size ?? []) {
            if (!sv) continue
            const sp       = Number(sv.sale_price)
            const sizeName = sv?.sizes?.name
            if (!isNaN(sp) && sp > 0) allSalePrices.push(sp)
            if (sizeName) {
                const upper = sizeName.toUpperCase()
                if (!allSizes.includes(upper)) allSizes.push(upper)
                sizePrices.push({
                    sizeId:          sv.id,              // ← variant size row ID
                    size:            upper,
                    salePrice:       sp,
                    discountedPrice: applyDiscount(sp, p),
                    stock:           sv.stock ?? 0,
                })
            }
            totalStock += sv.stock ?? 0
        }

        const colorPrices    = sizePrices.map((s) => s.salePrice).filter((v) => v > 0)
        const colorMinPrice  = colorPrices.length > 0 ? Math.min(...colorPrices) : 0
        const colorMaxPrice  = colorPrices.length > 0 ? Math.max(...colorPrices) : 0

        if (cv?.colors?.name) {
            colors.push({
                id:                 cv.id,
                colorId:            cv.color_id,         // ← color_id for API submission
                name:               cv.colors.name,
                colorHex:           colorToHex(cv.colors.name),
                sizePrices,
                minPrice:           colorMinPrice,
                maxPrice:           colorMaxPrice,
                minDiscountedPrice: applyDiscount(colorMinPrice, p),
                maxDiscountedPrice: applyDiscount(colorMaxPrice, p),
                hasDiscount:        discountActive,
            })
        }
    }

    const minPrice = allSalePrices.length > 0 ? Math.min(...allSalePrices) : 0
    const maxPrice = allSalePrices.length > 0 ? Math.max(...allSalePrices) : 0

    let discountLabel = ""
    if (discountActive && p.discount_amount) {
        discountLabel = p.discount_type === "percent"
            ? `${Number(p.discount_amount)}% OFF`
            : `৳${Number(p.discount_amount)} OFF`
    }

    return {
        id:                 p.id,
        name:               p.name ?? "",
        slug:               p.slug ?? "",
        image:              resolveImage(p.main_image, "medium"),
        hoverImage:         resolveImage(p.hover_image, "medium"),
        minPrice,
        maxPrice,
        minDiscountedPrice: applyDiscount(minPrice, p),
        maxDiscountedPrice: applyDiscount(maxPrice, p),
        hasDiscount:        discountActive,
        discountLabel,
        colors,
        sizes:              allSizes,
        totalStock,
        brandId:            p.brand_id,
        brandName:          p.brand?.name ?? "",
        categoryId:         p.category_id,
        subcategoryId:      p.subcategory_id,
        childCategoryId:    p.child_category_id,
        createdAt:          p.created_at,
    }
}