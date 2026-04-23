// lib/api/order.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentMethod = "cod" | "card" | "bkash" | "nagad" | "bank" | "sslcommerz"
export type OrderStatus   = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface ApiError {
    message: string
    error?:  string
    errors?: Record<string, string[]>
}

// Shape expected by checkout/page.tsx
export interface PlaceOrderPayload {
    billing_name:     string
    billing_email:    string
    billing_phone:    string
    billing_address:  string
    billing_city:     string
    billing_state:    string
    billing_zip:      string
    billing_country:  string
    ship_to_different?: boolean
    shipping_name?:    string
    shipping_address?: string
    shipping_city?:    string
    shipping_state?:   string
    shipping_zip?:     string
    shipping_country?: string
    payment_method:   PaymentMethod
    notes?:           string
    items: {
        product_id: number
        format_id:  number | null
        name:       string
        price:      number
        quantity:   number
    }[]
}

export interface PlaceOrderResult {
    orderNumber: string
    orderId:     number
    total:       number | string
}

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Returns shipping cost based on subtotal.
 * Free shipping on orders ≥ 100, otherwise flat 15.
 */
export function calcShipping(subtotal: number): number {
    return subtotal >= 100 ? 0 : 15
}

/**
 * Formats a number as a taka price string.
 * e.g. 1500 → "৳1,500"
 */
export function formatPrice(amount: number | string | null | undefined): string {
    const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0)
    if (isNaN(num)) return "৳0"
    return "৳" + num.toLocaleString("en-BD")
}

// ── Core fetcher ──────────────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null

    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept":       "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...((options.headers as Record<string, string>) ?? {}),
        },
        ...options,
    })

    if (!res.ok) {
        const errBody: ApiError = await res.json().catch(() => ({ message: "Network error" }))
        throw { status: res.status, ...errBody }
    }

    return res.json() as Promise<T>
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
    const data = await apiFetch<{
        message:          string
        order_id:         number
        tracking_number:  string
        total:            number | string
        payment_redirect?: string
    }>("/orders", {
        method: "POST",
        body:   JSON.stringify(payload),
    })

    return {
        orderNumber: data.tracking_number ?? String(data.order_id),
        orderId:     data.order_id,
        total:       data.total,
    }
}

export async function getOrder(id: number) {
    return apiFetch<any>(`/orders/${id}`)
}