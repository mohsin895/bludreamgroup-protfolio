// lib/api/orderApi.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"

export type PaymentMethod = "card" | "bkash" | "nagad" | "bank" | "sslcommerz" | "cod"
export type OrderStatus   = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface OrderItem {
    product_id: number
    quantity:   number
    color_id?:  number | null
    size_id?:   number | null
}

export interface OrderAddress {
    street:  string
    city:    string
    state?:  string
    zip:     string
    country: string
}

export interface OrderContact {
    first_name: string
    last_name:  string
    email:      string
    phone:      string
}

export interface OrderPricing {
    subtotal:         number
    shipping:         number
    tax:              number
    cod_fee:          number

    full_order_total: number
    total:            number
    pre_order_fee?:   number
    due_on_delivery?: number
}

export interface OrderDeliveryDetail {
    method:    "standard" | "express"
    shipping:  number
    is_free:   boolean
    zone_name?: string
}

export interface PlaceOrderRequest {
    contact:         OrderContact
    address:         OrderAddress
    delivery_method: "standard" | "express"
    items:           OrderItem[]
    payment_method:  PaymentMethod
    payment_payload: Record<string, string>
    coupon_code?:    string
    pricing:         OrderPricing
    delivery_detail: OrderDeliveryDetail
}

export interface PlaceOrderResponse {
    message:           string
    order_id:          number
    tracking_number:   string
    payment_status:    PaymentStatus
    payment_method?:   PaymentMethod
    order_status:      OrderStatus
    total:             number | string
    // ── FIX: Laravel returns "payment_redirect", not "redirect_url" ──
    payment_redirect?: string
}

export interface ApiError {
    message: string
    error?:  string
    errors?: Record<string, string[]>
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

// ── Order API ─────────────────────────────────────────────────────────────────

export const orderApi = {
    place: (body: PlaceOrderRequest) =>
        apiFetch<PlaceOrderResponse>("/orders", {
            method: "POST",
            body:   JSON.stringify(body),
        }),

    get: (id: number) => apiFetch<any>(`/orders/${id}`),
}