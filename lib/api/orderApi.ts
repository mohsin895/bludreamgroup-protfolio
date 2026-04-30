/**
 * Order API Module
 * Handles all order placement, validation, and payment processing
 */

"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentMethod = "cod" | "card" | "bkash" | "nagad" | "bank" | "sslcommerz"

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"

export interface Order {
    id: number
    user_id?: number
    order_number?: string
    tracking_number: string
    status: OrderStatus
    payment_method?: string
    payment_status: string
    subtotal: number
    shipping: number
    tax?: number
    total: number
    created_at: string
    updated_at?: string
    items?: Array<{
        id: number
        product_id: number
        product_name: string
        image?: string | null
        quantity: number
        price: number
        subtotal: number
        format?: string | null
        color?: string | null
        size?: string | null
    }>
    billing_name?: string
    billing_address?: string
    billing_city?: string
    billing_country?: string
    billing_phone?: string
    shipping_name?: string
    shipping_address?: string
    shipping_city?: string
    shipping_country?: string
    shipping_phone?: string
    notes?: string
    coupon_code?: string
}

export interface PlaceOrderPayload {
    contact: {
        first_name: string
        last_name: string
        email: string
        phone: string
    }
    address: {
        street: string
        city: string
        state?: string
        zip: string
        country: string
    }
    delivery_method: "standard" | "express"
    items: Array<{
        product_id: number | string
        quantity: number
        format_id?: number | null
        format_details?: {
            color?: string | null
            size?: string | null
            format_label?: string | null
        }
    }>
    payment_method: PaymentMethod
    payment_payload: Record<string, string>
    pricing: {
        subtotal: number
        shipping: number
        tax: number
        cod_fee: number
        full_order_total: number
        total: number
        pre_order_fee?: number
        due_on_delivery?: number
    }
    delivery_detail: {
        method: "standard" | "express"
        shipping: number
        is_free: boolean
        zone_name?: string
    }
    coupon_code?: string
    notes?: string
}

export interface PlaceOrderResponse {
    status: boolean
    message: string
    order_id?: number | string
    tracking_number?: string
    payment_redirect?: string
    redirect_url?: string
    order?: {
        id: number
        user_id: number
        order_number: string
        status: string
        payment_status: string
        total_amount: number
        created_at: string
    }
}

export interface ApiErrorResponse {
    status: false
    message: string
    errors?: Record<string, string[]>
}

export interface ValidationErrors {
    [key: string]: string
}

// Custom error class for API errors
export class OrderApiError extends Error {
    status: boolean
    errors?: Record<string, string[]>
    fieldErrors?: Record<string, string>

    constructor(message: string, errors?: Record<string, string[]>) {
        super(message)
        this.name = "OrderApiError"
        this.status = false
        this.errors = errors
        this.fieldErrors = this.flattenErrors(errors)
    }

    private flattenErrors(errors?: Record<string, string[]>): Record<string, string> {
        const flattened: Record<string, string> = {}
        if (errors) {
            for (const [field, messages] of Object.entries(errors)) {
                if (Array.isArray(messages) && messages.length > 0) {
                    flattened[field] = messages[0]
                }
            }
        }
        return flattened
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function validateContact(contact: {
    first_name: string
    last_name: string
    email: string
    phone: string
}): ValidationErrors {
    const errors: ValidationErrors = {}

    if (!contact.first_name?.trim()) {
        errors.first_name = "First name is required"
    }

    if (!contact.last_name?.trim()) {
        errors.last_name = "Last name is required"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contact.email?.trim() || !emailRegex.test(contact.email)) {
        errors.email = "Valid email is required"
    }

    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/
    const cleanPhone = contact.phone?.replace(/\s/g, "") || ""
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        errors.phone = "Valid phone number is required (01X XXXXXXXX or +88)"
    }

    return errors
}

function validateAddress(address: {
    street: string
    city: string
    state?: string
    zip: string
    country: string
}): ValidationErrors {
    const errors: ValidationErrors = {}

    if (!address.street?.trim()) {
        errors.street = "Street address is required"
    }

    if (!address.city?.trim()) {
        errors.city = "City is required"
    }

    if (!address.zip?.trim()) {
        errors.zip = "ZIP/Postal code is required"
    }

    if (!address.country?.trim()) {
        errors.country = "Country is required"
    }

    return errors
}

function validatePaymentPayload(
    method: PaymentMethod,
    payload: Record<string, string>
): ValidationErrors {
    const errors: ValidationErrors = {}

    switch (method) {
        case "card": {
            const cardNum = payload.card_number?.replace(/\s/g, "") || ""
            if (!cardNum) {
                errors.card_number = "Card number is required"
            } else if (!/^\d{13,19}$/.test(cardNum)) {
                errors.card_number = "Invalid card number (13-19 digits)"
            }

            if (!payload.card_name?.trim()) {
                errors.card_name = "Cardholder name is required"
            }

            if (!payload.expiry?.trim()) {
                errors.expiry = "Expiry is required"
            } else if (!/^\d{2}\/\d{2}$/.test(payload.expiry)) {
                errors.expiry = "Use MM/YY format"
            }

            if (!payload.cvv?.trim()) {
                errors.cvv = "CVV is required"
            } else if (!/^\d{3,4}$/.test(payload.cvv)) {
                errors.cvv = "Invalid CVV (3-4 digits)"
            }
            break
        }

        case "bkash": {
            const bkashNum = payload.mobile_number?.replace(/\s/g, "") || ""
            if (!bkashNum) {
                errors.mobile_number = "bKash number is required"
            } else if (!/^(\+88)?01[3-9]\d{8}$/.test(bkashNum)) {
                errors.mobile_number = "Invalid mobile number"
            }
            break
        }

        case "bank":
            if (!payload.transaction_reference?.trim()) {
                errors.transaction_reference = "Transaction reference is required"
            }
            break

        case "nagad": {
            const nagadNum = payload.mobile_number?.replace(/\s/g, "") || ""
            if (!nagadNum) {
                errors.mobile_number = "Nagad number is required"
            } else if (!/^(\+88)?01[3-9]\d{8}$/.test(nagadNum)) {
                errors.mobile_number = "Invalid Nagad number"
            }
            break
        }

        case "cod":
        case "sslcommerz":
            // No additional validation needed
            break

        default:
            errors.payment_method = "Invalid payment method"
    }

    return errors
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

export function formatPrice(amount: number | string): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount
    if (isNaN(num)) return "৳0"

    // Bengali-style formatting: 1,23,45,000 instead of 123,450,000
    const str = Math.round(num).toString()
    const isNegative = num < 0
    const absStr = isNegative ? str.slice(1) : str

    // Split into integer and decimal parts
    let formatted = ""
    if (absStr.length <= 3) {
        formatted = absStr
    } else {
        const lastThree = absStr.slice(-3)
        const beforeLastThree = absStr.slice(0, -3)
        const withCommas = beforeLastThree.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
        formatted = withCommas + "," + lastThree
    }

    return `৳${isNegative ? "-" : ""}${formatted}`
}

// ─────────────────────────────────────────────────────────────────────────────
// API REQUEST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

async function makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options)

        // Try to parse JSON response regardless of status
        let data: any
        try {
            data = await response.json()
        } catch {
            // If JSON parsing fails, throw HTTP error
            if (!response.ok) {
                throw new OrderApiError(
                    `HTTP ${response.status}: ${response.statusText}`
                )
            }
            throw new OrderApiError("Invalid response format from server")
        }

        // Check if response indicates an error
        if (!response.ok) {
            throw new OrderApiError(
                data.message || `HTTP ${response.status}: ${response.statusText}`,
                data.errors
            )
        }

        return data as T
    } catch (error) {
        if (error instanceof OrderApiError) {
            throw error
        }
        throw new OrderApiError(
            error instanceof Error ? error.message : "An unknown error occurred"
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER API OBJECT
// ─────────────────────────────────────────────────────────────────────────────

export const orderApi = {
    /**
     * Place a new order
     * @param payload Order payload with contact, address, items, and payment info
     * @returns Order response with ID and optional payment redirect URL
     * @throws OrderApiError if validation or API call fails
     */
    async place(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
        // Validate contact information
        const contactErrors = validateContact(payload.contact)
        if (Object.keys(contactErrors).length > 0) {
            throw new OrderApiError("Contact validation failed", {
                ...Object.entries(contactErrors).reduce(
                    (acc, [key, val]) => ({ ...acc, [key]: [val] }),
                    {}
                ),
            })
        }

        // Validate address
        const addressErrors = validateAddress(payload.address)
        if (Object.keys(addressErrors).length > 0) {
            throw new OrderApiError("Address validation failed", {
                ...Object.entries(addressErrors).reduce(
                    (acc, [key, val]) => ({ ...acc, [key]: [val] }),
                    {}
                ),
            })
        }

        // Validate payment payload
        const paymentErrors = validatePaymentPayload(
            payload.payment_method,
            payload.payment_payload
        )
        if (Object.keys(paymentErrors).length > 0) {
            throw new OrderApiError("Payment information validation failed", {
                ...Object.entries(paymentErrors).reduce(
                    (acc, [key, val]) => ({ ...acc, [key]: [val] }),
                    {}
                ),
            })
        }

        // Validate items
        if (!payload.items || payload.items.length === 0) {
            throw new OrderApiError("Cart is empty", {
                items: ["At least one item is required"],
            })
        }

        // Validate pricing
        if (!payload.pricing || payload.pricing.total <= 0) {
            throw new OrderApiError("Invalid pricing information", {
                pricing: ["Order total must be greater than 0"],
            })
        }

        // Make API request
        const response = await makeRequest<PlaceOrderResponse>(
            "/orders/place",
            "POST",
            payload
        )

        if (!response.status) {
            throw new OrderApiError(
                response.message || "Failed to place order",
                {}
            )
        }

        return response
    },

    /**
     * Get order details by ID
     */
    async getOrder(orderId: number | string): Promise<Order> {
        if (!orderId) {
            throw new OrderApiError("Order ID is required")
        }
        return makeRequest<Order>(`/orders/${orderId}`)
    },

    /**
     * Alias for getOrder (for consistency with page component usage)
     */
    async get(orderId: number | string): Promise<Order> {
        return this.getOrder(orderId)
    },

    /**
     * Cancel an order
     */
    async cancelOrder(
        orderId: number | string,
        reason?: string
    ): Promise<{ status: boolean; message: string }> {
        if (!orderId) {
            throw new OrderApiError("Order ID is required")
        }
        return makeRequest(
            `/orders/${orderId}/cancel`,
            "POST",
            reason ? { reason } : {}
        )
    },

    /**
     * Alias for cancelOrder (for consistency with page component usage)
     */
    async cancel(
        orderId: number | string,
        reason?: string
    ): Promise<{ status: boolean; message: string }> {
        return this.cancelOrder(orderId, reason)
    },

    /**
     * Verify payment for SSLCommerz, bKash, etc.
     */
    async verifyPayment(
        orderId: number | string,
        gateway: string,
        transactionId: string
    ): Promise<{ status: boolean; message: string; order_id: number }> {
        if (!orderId || !gateway || !transactionId) {
            throw new OrderApiError("Order ID, gateway, and transaction ID are required")
        }
        return makeRequest("/orders/verify-payment", "POST", {
            order_id: orderId,
            gateway,
            transaction_id: transactionId,
        })
    },

    /**
     * Get order by tracking number
     */
    async getOrderByTracking(trackingNumber: string): Promise<Order> {
        if (!trackingNumber) {
            throw new OrderApiError("Tracking number is required")
        }
        return makeRequest<Order>(`/orders/track/${trackingNumber}`)
    },

    /**
     * Calculate order total with current settings
     */
    async calculateTotal(payload: {
        subtotal: number
        shipping_zone_id?: number
        coupon_code?: string
    }): Promise<{
        status: boolean
        subtotal: number
        shipping: number
        tax: number
        discount: number
        total: number
    }> {
        if (!payload.subtotal || payload.subtotal <= 0) {
            throw new OrderApiError("Subtotal must be greater than 0")
        }
        return makeRequest("/orders/calculate", "POST", payload)
    },

    /**
     * Get list of all orders for the current user
     */
    async listOrders(params?: {
        page?: number
        limit?: number
        status?: OrderStatus
        sort?: "newest" | "oldest" | "total_asc" | "total_desc"
    }): Promise<Order[]> {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append("page", String(params.page))
        if (params?.limit) queryParams.append("limit", String(params.limit))
        if (params?.status) queryParams.append("status", params.status)
        if (params?.sort) queryParams.append("sort", params.sort)

        const query = queryParams.toString()
        const endpoint = `/orders${query ? `?${query}` : ""}`

        const response = await makeRequest<{ status: boolean; data: Order[] }>(endpoint)
        return response.data || []
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLER UTILITY
// ─────────────────────────────────────────────────────────────────────────────

export function handleOrderError(error: any): {
    message: string
    fieldErrors: Record<string, string>
} {
    const fieldErrors: Record<string, string> = {}

    if (error instanceof OrderApiError) {
        return {
            message: error.message,
            fieldErrors: error.fieldErrors || {},
        }
    }

    if (error.errors && typeof error.errors === "object") {
        for (const [field, messages] of Object.entries(error.errors)) {
            if (Array.isArray(messages) && messages.length > 0) {
                fieldErrors[field] = messages[0]
            }
        }
    }

    return {
        message: error.message || "An error occurred",
        fieldErrors,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHOD HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const paymentMethodInfo: Record<
    PaymentMethod,
    {
        name: string
        description: string
        emoji: string
        icon?: string
    }
> = {
    cod: {
        name: "Cash on Delivery",
        description: "Pay when your order arrives",
        emoji: "💵",
    },
    card: {
        name: "Credit/Debit Card",
        description: "Visa, Mastercard, Amex",
        emoji: "💳",
    },
    bkash: {
        name: "bKash",
        description: "Mobile banking — fast & secure",
        emoji: "📱",
    },
    nagad: {
        name: "Nagad",
        description: "Mobile financial service",
        emoji: "📲",
    },
    bank: {
        name: "Bank Transfer",
        description: "Direct bank transfer",
        emoji: "🏦",
    },
    sslcommerz: {
        name: "SSLCommerz",
        description: "Secure online payment gateway",
        emoji: "🔐",
    },
}