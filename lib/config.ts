// ── Global environment config ─────────────────────────────────────────────
// Use these everywhere instead of repeating process.env calls

export const API_BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL   ?? "http://localhost/tashonupdate/public/api"
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost/tashonupdate/public/"

/**
 * Build a full image URL from a relative path.
 * Usage: imgUrl("storage/products/abc.jpg")
 */
export function imgUrl(path: string | null | undefined): string {
    if (!path) return ""
    if (path.startsWith("http")) return path          // already absolute
    return `${IMAGE_BASE_URL}${path}`
}

/**
 * Build a full API endpoint URL.
 * Usage: apiUrl("products/1")
 */
export function apiUrl(endpoint: string): string {
    const base = API_BASE_URL.replace(/\/$/, "")
    const ep   = endpoint.replace(/^\//, "")
    return `${base}/${ep}`
}