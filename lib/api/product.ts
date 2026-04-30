// lib/api/product.ts

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE_URL  ?? ""
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ""

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductImage {
    original?: string | null
    large?:    string | null
    medium?:   string | null
    small?:    string | null
    thumb?:    string | null
}

export interface ProductFormat {
    id:     number
    label:  string          // e.g. "Paperback", "Ebook", "Hardcover"
    price:  number | string
    stock?: number | null
    badge?: string | null   // e.g. "Best Value", "Popular"
    sku?:   string | null
}

export interface ProductCategory {
    id:   number
    name: string
    slug: string
}

export interface Product {
    id:                 number
    slug:               string
    title:              string
    subtitle?:          string | null
    tagline?:           string | null
    short_description?: string | null
    description?:       string | null
    author?:            string | null
    author_bio?:        string | null
    genre?:             string | null
    category?:          ProductCategory | null
    year?:              number | string | null
    pages?:             number | null
    language?:          string | null
    isbn?:              string | null
    publisher?:         string | null
    stock:              number
    status:             "active" | "inactive" | string
    formats:            ProductFormat[]
    main_image?:        ProductImage | null
    cover_color?:       string | null   // hex e.g. "#1e3a5f"
    cover_accent?:      string | null   // hex for accent/title colour
    praise?:            string | null
    praise_author?:     string | null
    has_discount?:      "yes" | "no" | string
    discount_type?:     "percent" | "flat" | string | null
    discount_amount?:   number | string | null
    discount_end_date?: string | null
    has_pre_order?:     "yes" | "no" | string
    pre_order_amount?:  number | string | null
    created_at?:        string
    updated_at?:        string
}

export interface ProductsResponse {
    data?:    Product[]
    products?: Product[]
    // some APIs return an array directly
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resolves an image path to an absolute URL.
 * Handles: null/undefined, already-absolute URLs, and relative paths.
 */
export function imageUrl(path: string | null | undefined): string {
    if (!path) return ""
    if (path.startsWith("http://") || path.startsWith("https://")) return path
    return `${IMAGE_BASE}${path.startsWith("/") ? "" : "/"}${path}`
}

/**
 * Returns the format with the lowest price, or null.
 */
export function lowestPrice(
    formats: ProductFormat[] | null | undefined
): ProductFormat | null {
    if (!formats || formats.length === 0) return null
    return formats.reduce((prev, curr) => {
        const p = typeof prev.price === "string" ? parseFloat(prev.price) : prev.price
        const c = typeof curr.price === "string" ? parseFloat(curr.price) : curr.price
        return c < p ? curr : prev
    })
}

/**
 * Formats a price value as BDT.
 * e.g. 450 → "৳450"
 */
export function formatPrice(
    amount: number | string | null | undefined
): string {
    const num =
        typeof amount === "string" ? parseFloat(amount) : (amount ?? 0)
    if (isNaN(num)) return "৳0"
    return "৳" + num.toLocaleString("en-BD")
}

// ── Core fetcher ──────────────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Accept: "application/json" },
        next:    { revalidate: 60 },   // ISR-friendly; ignored in client components
    })
    if (!res.ok) throw new Error(`API ${res.status}: ${endpoint}`)
    return res.json() as Promise<T>
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Returns all active products.
 * Handles both `{ data: [...] }` and bare-array responses.
 */
export async function getAllProducts(): Promise<Product[]> {
    try {
        const raw = await apiFetch<ProductsResponse | Product[]>("/products")

        if (Array.isArray(raw)) return raw
        if (Array.isArray((raw as ProductsResponse).data))     return (raw as ProductsResponse).data!
        if (Array.isArray((raw as ProductsResponse).products)) return (raw as ProductsResponse).products!
        return []
    } catch {
        return []
    }
}

/**
 * Returns a single product by slug plus related products.
 * Handles many common Laravel/API response shapes:
 *   { data: { ...product, related_products: [] } }
 *   { data: { product: {...}, related_products: [] } }
 *   { product: {...}, related_products: [] }
 *   { status: true, data: {...} }
 *   { ...product } (bare object)
 */
export async function getProductBySlug(
    slug: string
): Promise<{ product: Product; related_products: Product[] }> {
    const raw = await apiFetch<any>(`/products/${slug}`)

    // Unwrap { status, data } envelope common in Laravel APIs
    const envelope = raw?.data ?? raw

    // Try every known location for the product object
    let product: Product
    if (envelope?.product && typeof envelope.product === "object" && envelope.product.id) {
        // { data: { product: {...}, related_products: [] } }
        product = envelope.product
    } else if (envelope?.id) {
        // { data: { id, title, ... } }  or bare  { id, title, ... }
        product = envelope as Product
    } else if (raw?.id) {
        // bare root object
        product = raw as Product
    } else {
        // last resort — pass whatever we have and let the UI show "not found"
        product = (envelope ?? raw) as Product
    }

    // Related products — check multiple keys
    const related: Product[] =
        envelope?.related_products ??
        envelope?.related ??
        raw?.related_products ??
        raw?.related ??
        []

    return { product, related_products: Array.isArray(related) ? related : [] }
}

/**
 * Search products by query string.
 */
export async function searchProducts(q: string): Promise<Product[]> {
    try {
        const raw = await apiFetch<ProductsResponse | Product[]>(
            `/products/search?q=${encodeURIComponent(q)}`
        )
        if (Array.isArray(raw)) return raw
        return (raw as ProductsResponse).data ?? []
    } catch {
        return []
    }
}

/**
 * Returns products by category slug.
 */
export async function getProductsByCategory(
    categorySlug: string
): Promise<Product[]> {
    try {
        const raw = await apiFetch<ProductsResponse | Product[]>(
            `/products?category=${categorySlug}`
        )
        if (Array.isArray(raw)) return raw
        return (raw as ProductsResponse).data ?? []
    } catch {
        return []
    }
}

/**
 * Returns featured products.
 * Tries ?featured=1 first; falls back to slicing getAllProducts.
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
    try {
        const raw = await apiFetch<ProductsResponse | Product[]>(
            `/products?featured=1&limit=${limit}`
        )
        const all = Array.isArray(raw)
            ? raw
            : ((raw as ProductsResponse).data ?? (raw as ProductsResponse).products ?? [])
        return all.slice(0, limit)
    } catch {
        const all = await getAllProducts()
        return all.slice(0, limit)
    }
}