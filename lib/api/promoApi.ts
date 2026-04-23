const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export interface PromoCodeResponse {
    message:         string
    code:            string
    discount_type:   "percentage" | "fixed"
    discount_value:  number
    discount_amount: number
    final_amount:    number
}

export interface PromoCodeError {
    message: string
    errors?: Record<string, string[]>
}

export const promoApi = {
    apply: async (code: string, orderAmount: number): Promise<PromoCodeResponse> => {
        const token = typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null

        const res = await fetch(`${API_BASE}/promo-codes/apply`, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept":       "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ code, order_amount: orderAmount }),
        })

        const json = await res.json()

        if (!res.ok) {
            throw { message: json.message ?? "Invalid promo code.", ...json } as PromoCodeError
        }

        return json as PromoCodeResponse
    },
}