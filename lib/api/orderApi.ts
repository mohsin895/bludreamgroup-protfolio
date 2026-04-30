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
    order_id: number | string
    tracking_number?: string
    payment_redirect?: string
    redirect_url?: string
    order: {
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
    status: boolean
    message: string
    errors?: Record<string, string[]>
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationErrors {
    [key: string]: string
}

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
    if (!contact.phone?.trim() || !phoneRegex.test(contact.phone.replace(/\s/g, ""))) {
        errors.phone = "Valid phone number is required (01X XXXXXXXX or +88)"
    }

    return errors
}

function validateAddress(address: {
    street: string
    city: string
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
        case "card":
            if (!payload.card_number?.replace(/\s/g, "")) {
                errors.card_number = "Card number is required"
            } else if (!/^\d{13,19}$/.test(payload.card_number.replace(/\s/g, ""))) {
                errors.card_number = "Invalid card number"
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
                errors.cvv = "Invalid CVV"
            }
            break

        case "bkash":
            if (!payload.mobile_number?.trim()) {
                errors.mobile_number = "bKash number is required"
            } else if (!/^(\+88)?01[3-9]\d{8}$/.test(payload.mobile_number.replace(/\s/g, ""))) {
                errors.mobile_number = "Invalid mobile number"
            }
            break

        case "bank":
            if (!payload.transaction_reference?.trim()) {
                errors.transaction_reference = "Transaction reference is required"
            }
            break

        case "nagad":
            if (!payload.mobile_number?.trim()) {
                errors.mobile_number = "Nagad number is required"
            }
            break
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

    const response = await fetch(`${API_BASE}${endpoint}`, options)

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER API OBJECT
// ─────────────────────────────────────────────────────────────────────────────

export const orderApi = {
    /**
     * Place a new order
     * @param payload Order payload with contact, address, items, and payment info
     * @returns Order response with ID and optional payment redirect URL
     */
    async place(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
        // Validate contact information
        const contactErrors = validateContact(payload.contact)
        if (Object.keys(contactErrors).length > 0) {
            throw {
                status: false,
                message: "Validation failed",
                errors: contactErrors,
            }
        }

        // Validate address
        const addressErrors = validateAddress(payload.address)
        if (Object.keys(addressErrors).length > 0) {
            throw {
                status: false,
                message: "Validation failed",
                errors: addressErrors,
            }
        }

        // Validate payment payload
        const paymentErrors = validatePaymentPayload(
            payload.payment_method,
            payload.payment_payload
        )
        if (Object.keys(paymentErrors).length > 0) {
            throw {
                status: false,
                message: "Validation failed",
                errors: paymentErrors,
            }
        }

        // Validate items
        if (!payload.items || payload.items.length === 0) {
            throw {
                status: false,
                message: "Cart is empty",
                errors: { items: ["At least one item is required"] },
            }
        }

        // Make API request
        try {
            const response = await makeRequest<PlaceOrderResponse>(
                "/orders/place",
                "POST",
                payload
            )

            if (!response.status) {
                throw {
                    status: false,
                    message: response.message || "Failed to place order",
                    errors: response.errors,
                }
            }

            return response
        } catch (error: any) {
            // Handle API errors
            if (error.errors) {
                throw error
            }

            throw {
                status: false,
                message: error.message || "An error occurred while placing the order",
            }
        }
    },

    /**
     * Get order details by ID
     */
    async getOrder(orderId: number | string): Promise<PlaceOrderResponse> {
        return makeRequest<PlaceOrderResponse>(`/orders/${orderId}`)
    },

    /**
     * Cancel an order
     */
    async cancelOrder(orderId: number | string, reason?: string): Promise<{ status: boolean; message: string }> {
        return makeRequest(
            `/orders/${orderId}/cancel`,
            "POST",
            reason ? { reason } : {}
        )
    },

    /**
     * Verify payment for SSLCommerz, bKash, etc.
     */
    async verifyPayment(
        orderId: number | string,
        gateway: string,
        transactionId: string
    ): Promise<{ status: boolean; message: string; order_id: number }> {
        return makeRequest("/orders/verify-payment", "POST", {
            order_id: orderId,
            gateway,
            transaction_id: transactionId,
        })
    },

    /**
     * Get order by tracking number
     */
    async getOrderByTracking(trackingNumber: string): Promise<PlaceOrderResponse> {
        return makeRequest<PlaceOrderResponse>(
            `/orders/track/${trackingNumber}`
        )
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
        return makeRequest("/orders/calculate", "POST", payload)
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLER UTILITY
// ─────────────────────────────────────────────────────────────────────────────

export function handleOrderError(error: any): { message: string; fieldErrors: Record<string, string> } {
    const fieldErrors: Record<string, string> = {}

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

export const paymentMethodInfo: Record<PaymentMethod, {
    name: string
    description: string
    emoji: string
    icon?: string
}> = {
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