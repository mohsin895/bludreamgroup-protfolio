"use client"

import { useState, useEffect } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export interface ShippingZone {
    name:   string
    charge: number
}

export interface CartSettings {
    // ── Order limits ─────────────────────────────────────
    minimum_order_amount:          number | null
    minimum_order_amount_enabled:  boolean
    maximum_order_amount:          number | null
    maximum_order_amount_enabled:  boolean

    // ── Pre-order ─────────────────────────────────────────
    pre_order_enabled:             boolean
    pre_order_type:                "cart" | "item"
    pre_order_amount:              number

    // ── Shipping ──────────────────────────────────────────
    free_shipping_enabled:         boolean
    free_shipping_amount:          number | null
    default_shipping_charge:       number | null
    shipping_zones:                ShippingZone[]

    // ── Tax / Coupon / COD / Guest ────────────────────────
    tax_enabled:                   boolean
    tax_percentage:                number | null
    coupon_enabled:                boolean
    cod_enabled:                   boolean
    guest_checkout_enabled:        boolean

    // ── Payment gateways ──────────────────────────────────
    sslcommerz_enabled:            boolean
    sslcommerz_mode:               "sandbox" | "live"
    bkash_enabled:                 boolean
    bkash_mode:                    "sandbox" | "live"
    steadfast_enabled:             boolean
    pathao_enabled:                boolean
    pathao_mode:                   "staging" | "live"
}

const DEFAULT: CartSettings = {
    minimum_order_amount:         null,
    minimum_order_amount_enabled: false,
    maximum_order_amount:         null,
    maximum_order_amount_enabled: false,
    pre_order_enabled:            false,
    pre_order_type:               "cart",
    pre_order_amount:             0,
    free_shipping_enabled:        false,
    free_shipping_amount:         null,
    default_shipping_charge:      60,
    shipping_zones:               [],
    tax_enabled:                  false,
    tax_percentage:               null,
    coupon_enabled:               true,
    cod_enabled:                  true,
    guest_checkout_enabled:       true,
    sslcommerz_enabled:           false,
    sslcommerz_mode:              "sandbox",
    bkash_enabled:                false,
    bkash_mode:                   "sandbox",
    steadfast_enabled:            false,
    pathao_enabled:               false,
    pathao_mode:                  "staging",
}

function parse(raw: any): CartSettings {
    return {
        minimum_order_amount:         raw.minimum_order_amount != null ? Number(raw.minimum_order_amount) : null,
        minimum_order_amount_enabled: Boolean(raw.minimum_order_amount_enabled),
        maximum_order_amount:         raw.maximum_order_amount != null ? Number(raw.maximum_order_amount) : null,
        maximum_order_amount_enabled: Boolean(raw.maximum_order_amount_enabled),
        pre_order_enabled:            Boolean(raw.pre_order_enabled),
        pre_order_type:               raw.pre_order_type ?? "cart",
        pre_order_amount:             raw.pre_order_amount != null ? Number(raw.pre_order_amount) : 0,
        free_shipping_enabled:        Boolean(raw.free_shipping_enabled),
        free_shipping_amount:         raw.free_shipping_amount != null ? Number(raw.free_shipping_amount) : null,
        default_shipping_charge:      raw.default_shipping_charge != null ? Number(raw.default_shipping_charge) : 60,
        shipping_zones:               Array.isArray(raw.shipping_zones)
            ? raw.shipping_zones.map((z: any) => ({ name: String(z.name), charge: Number(z.charge) }))
            : [],
        tax_enabled:                  Boolean(raw.tax_enabled),
        tax_percentage:               raw.tax_percentage != null ? Number(raw.tax_percentage) : null,
        coupon_enabled:               Boolean(raw.coupon_enabled),
        cod_enabled:                  Boolean(raw.cod_enabled),
        guest_checkout_enabled:       Boolean(raw.guest_checkout_enabled),
        sslcommerz_enabled:           Boolean(raw.sslcommerz_enabled),
        sslcommerz_mode:              raw.sslcommerz_mode ?? "sandbox",
        bkash_enabled:                Boolean(raw.bkash_enabled),
        bkash_mode:                   raw.bkash_mode ?? "sandbox",
        steadfast_enabled:            Boolean(raw.steadfast_enabled),
        pathao_enabled:               Boolean(raw.pathao_enabled),
        pathao_mode:                  raw.pathao_mode ?? "staging",
    }
}

export function useCartSettings() {
    const [settings, setSettings] = useState<CartSettings>(DEFAULT)
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        fetch(`${API_BASE}/cart/setting`)
            .then(r => r.json())
            .then(json => {
                if (json?.status && json?.data) setSettings(parse(json.data))
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    return { settings, loading }
}