// lib/api/productapi.tsx

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductImage {
    id: number;
    product_id: number;
    product_variant_color_id: number | null;
    original: string;
    small: string;
    medium: string;
    large: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface ProductFormat {
    id: number;
    product_id: number;
    label: string;
    price: string;
    badge: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    image: string | null;
    status: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    author: string | null;
    author_bio: string | null;
    genre: string | null;
    isbn: string | null;
    language: string | null;
    publisher: string | null;
    year: string | null;
    pages: number | null;
    cover_color: string | null;
    cover_accent: string | null;
    tagline: string | null;
    description: string | null;
    praise: string | null;
    praise_author: string | null;
    stock: number;
    short_description: string | null;
    meta_description: string | null;
    meta_keyword: string | null;
    meta_title: string | null;
    meta_image: string | null;
    discount_type: string | null;
    discount_amount: string | null;
    discount_start_date: string | null;
    discount_end_date: string | null;
    has_discount: "yes" | "no";
    has_pre_order: "yes" | "no";
    pre_order_amount: string | null;
    status: "active" | "inactive";
    main_image_id: number | null;
    created_at: string;
    updated_at: string;
    main_image: ProductImage | null;
    formats: ProductFormat[];
    category: ProductCategory | null;
}

export interface ProductListResponse {
    status: boolean;
    message: string;
    data: Product[];
}

export interface ProductDetailResponse {
    status: boolean;
    message: string;
    data: {
        product: Product;
        related_products: Product[];
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve a relative image path to an absolute URL */
export function imageUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // Strip any leading slash from path to avoid double slashes
    const clean = path.replace(/^\/+/, "");
    const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    return `${base}/${clean}`;
}

/** Format a price string to locale currency */
export function formatPrice(price: string | number | null, currency = "BDT"): string {
    if (!price) return "";
    const n = typeof price === "string" ? parseFloat(price) : price;
    return `${currency} ${n.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Return the lowest-price format for a product */
export function lowestPrice(formats: ProductFormat[]): ProductFormat | null {
    if (!formats?.length) return null;
    return formats.reduce((a, b) => parseFloat(a.price) < parseFloat(b.price) ? a : b);
}

// ─────────────────────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all active products
 */
export async function getAllProducts(): Promise<Product[]> {
    try {
        const url = `${API_BASE}/product`;
        const res = await fetch(url, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            // Log the actual response body so you can see the server error message
            const body = await res.text().catch(() => "(unreadable)");
            console.error(`[productapi] getAllProducts HTTP ${res.status}:`, body);
            throw new Error(`HTTP ${res.status}`);
        }

        const json: ProductListResponse = await res.json();
        if (!json.status) throw new Error(json.message);
        return json.data ?? [];
    } catch (err) {
        console.error("[productapi] getAllProducts:", err);
        return [];
    }
}
/**
 * Fetch a single product by slug along with related products
 */
export async function getProductBySlug(slug: string): Promise<{
    product: Product | null;
    related_products: Product[];
}> {
    try {
        const res = await fetch(`${API_BASE}/product-details/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ProductDetailResponse = await res.json();
        if (!json.status) throw new Error(json.message);
        return {
            product: json.data?.product ?? null,
            related_products: json.data?.related_products ?? [],
        };
    } catch (err) {
        console.error("[productapi] getProductBySlug:", err);
        return { product: null, related_products: [] };
    }
}

/**
 * Fetch products by category id
 */
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
        const res = await fetch(`${API_BASE}/product?category_id=${categoryId}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ProductListResponse = await res.json();
        if (!json.status) throw new Error(json.message);
        return json.data ?? [];
    } catch (err) {
        console.error("[productapi] getProductsByCategory:", err);
        return [];
    }
}

/**
 * Fetch featured / homepage products (first N)
 */
export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
    const all = await getAllProducts();
    return all.slice(0, limit);
}