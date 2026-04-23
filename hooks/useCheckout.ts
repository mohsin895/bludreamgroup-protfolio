"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { orderApi, type PaymentMethod, type PlaceOrderResponse } from "@/lib/api/orderApi"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { selectCartItems, selectTotalPrice, clearCart } from "@/store/cartSlice"
import { useCartSettings } from "@/hooks/useCartSettings"

export interface ContactForm {
    firstName: string
    lastName:  string
    email:     string
    phone:     string
}

export interface AddressForm {
    street:  string
    city:    string
    state:   string
    zip:     string
    country: string
}

export interface CardForm {
    cardNumber: string
    cardName:   string
    expiry:     string
    cvv:        string
}

export function resolvePaymentMethods(settings: {
    cod_enabled:        boolean
    bkash_enabled:      boolean
    sslcommerz_enabled: boolean
}): PaymentMethod[] {
    const methods: PaymentMethod[] = []
    if (settings.cod_enabled)        methods.push("cod")
    if (settings.bkash_enabled)      methods.push("bkash")
    if (settings.sslcommerz_enabled) methods.push("sslcommerz")
    return methods
}

function pickDefault(settings: {
    cod_enabled:        boolean
    bkash_enabled:      boolean
    sslcommerz_enabled: boolean
}): PaymentMethod {
    if (settings.cod_enabled)        return "cod"
    if (settings.bkash_enabled)      return "bkash"
    if (settings.sslcommerz_enabled) return "sslcommerz"
    return "cod"
}

export function useCheckout({ agree }: { agree: boolean }) {
    const dispatch   = useAppDispatch()
    const cartItems  = useAppSelector(selectCartItems)
    const totalPrice = useAppSelector(selectTotalPrice)


    const { settings, loading: settingsLoading } = useCartSettings()

    // ── Contact & Address ─────────────────────────────────────────────────────
    const [contact, setContact] = useState<ContactForm>({
        firstName: "", lastName: "", email: "", phone: "",
    })
    const [address, setAddress] = useState<AddressForm>({
        street: "", city: "", state: "", zip: "", country: "Bangladesh",
    })

    // ── Shipping zone ─────────────────────────────────────────────────────────
    const [selectedZoneIndex, setSelectedZoneIndex] = useState(0)
    useEffect(() => { setSelectedZoneIndex(0) }, [settings.shipping_zones.length])

    // ── Payment method ────────────────────────────────────────────────────────
    const [payMethod, setPayMethod] = useState<PaymentMethod>("cod")
    useEffect(() => {
        if (!settingsLoading) setPayMethod(pickDefault(settings))
    }, [settingsLoading])
    useEffect(() => {
        if (settingsLoading) return
        const enabled = resolvePaymentMethods(settings)
        if (enabled.length > 0 && !enabled.includes(payMethod)) setPayMethod(enabled[0])
    }, [settingsLoading, settings.cod_enabled, settings.bkash_enabled, settings.sslcommerz_enabled])

    // ── Coupon local state ────────────────────────────────────────────────────
    const [couponInput,   setCouponInput]   = useState("")
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponError,   setCouponError]   = useState<string | null>(null)

    // ── Sync couponInput from Redux (handles rehydration + cross-page nav) ────

    // ── Other form state ──────────────────────────────────────────────────────

    const [cardForm,     setCardForm] = useState<CardForm>({
        cardNumber: "", cardName: "", expiry: "", cvv: "",
    })
    const [mobileNumber, setMobileNumber] = useState("")
    const [bankRef,      setBankRef]      = useState("")

    // ── Request state ─────────────────────────────────────────────────────────
    const [loading,     setLoading]     = useState(false)
    const [error,       setError]       = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [orderResult, setOrderResult] = useState<PlaceOrderResponse | null>(null)

    // ── Pricing ───────────────────────────────────────────────────────────────
    const pricing = useMemo(() => {
        const subtotal   = totalPrice
        const zones      = settings.shipping_zones ?? []
        const baseCharge = zones.length > 0
            ? (zones[selectedZoneIndex]?.charge ?? 60)
            : (settings.default_shipping_charge ?? 60)

        let shipping = baseCharge
        if (
            settings.free_shipping_enabled &&
            settings.free_shipping_amount != null &&
            subtotal >= settings.free_shipping_amount
        ) {
            shipping = 0
        }

        const tax           = settings.tax_enabled && settings.tax_percentage
            ? Math.round(subtotal * (settings.tax_percentage / 100))
            : 0
        const codFee        = 0
        // ── guard: only apply discount when promo is actually applied ─────────


        const fullOrderTotal = subtotal + shipping + tax + codFee
        const isPreOrder     = settings.pre_order_enabled && settings.cod_enabled && payMethod === "cod"
        const preOrderFee    = isPreOrder ? Math.round(fullOrderTotal * (settings.pre_order_amount / 100)) : 0
        const dueOnDelivery  = isPreOrder ? fullOrderTotal - preOrderFee : 0
        const total          = isPreOrder ? preOrderFee : fullOrderTotal

        return {
            subtotal, shipping, tax, codFee,

            fullOrderTotal, preOrderFee, dueOnDelivery,
            isPreOrder, total, baseCharge,
        }
    }, [totalPrice, selectedZoneIndex, payMethod, settings,])

    // ── Order amount guard ────────────────────────────────────────────────────
    const orderAmountError = useMemo(() => {
        if (
            settings.minimum_order_amount_enabled &&
            settings.minimum_order_amount != null &&
            pricing.subtotal < settings.minimum_order_amount
        ) return `Minimum order amount is ৳${settings.minimum_order_amount.toFixed(0)}`
        if (
            settings.maximum_order_amount_enabled &&
            settings.maximum_order_amount != null &&
            pricing.subtotal > settings.maximum_order_amount
        ) return `Maximum order amount is ৳${settings.maximum_order_amount.toFixed(0)}`
        return null
    }, [pricing.subtotal, settings])

    // ── Apply promo ───────────────────────────────────────────────────────────



    // ── Payment payload ───────────────────────────────────────────────────────
    const buildPayload = useCallback((): Record<string, string> => {
        switch (payMethod) {
            case "card":       return { card_number: cardForm.cardNumber.replace(/\s/g, ""), card_name: cardForm.cardName, expiry: cardForm.expiry, cvv: cardForm.cvv }
            case "bkash":      return mobileNumber ? { mobile_number: mobileNumber } : {}
            case "bank":       return bankRef ? { transaction_reference: bankRef } : {}
            case "sslcommerz": return { name: `${contact.firstName} ${contact.lastName}`.trim(), email: contact.email, phone: contact.phone }
            case "cod":        return { cod_fee: "0" }
            default:           return {}
        }
    }, [payMethod, cardForm, mobileNumber, bankRef, contact])

    // ── Submit ────────────────────────────────────────────────────────────────
    const submit = useCallback(async () => {
        if (!agree)                 { setError("Please accept the terms to continue."); return }
        if (cartItems.length === 0) { setError("Your cart is empty."); return }
        if (orderAmountError)       { setError(orderAmountError); return }

        setLoading(true)
        setError(null)
        setFieldErrors({})

        const zones            = settings.shipping_zones ?? []
        const shippingZoneName = zones[selectedZoneIndex]?.name ?? null

        try {
            const result = await orderApi.place({
                contact: {
                    first_name: contact.firstName,
                    last_name:  contact.lastName,
                    email:      contact.email,
                    phone:      contact.phone,
                },
                address: {
                    street:  address.street,
                    city:    address.city,
                    state:   address.state || undefined,
                    zip:     address.zip,
                    country: address.country,
                },
                delivery_method: "standard",
                items: cartItems.map(({ product, quantity }) => ({
                    product_id: product.id,
                    quantity,

                })),
                payment_method:  payMethod,
                payment_payload: buildPayload(),

                pricing: {
                    subtotal:         pricing.subtotal,
                    shipping:         pricing.shipping,
                    tax:              pricing.tax,
                    cod_fee:          pricing.codFee,

                    full_order_total: pricing.fullOrderTotal,
                    total:            pricing.total,
                    ...(pricing.isPreOrder ? {
                        pre_order_fee:   pricing.preOrderFee,
                        due_on_delivery: pricing.dueOnDelivery,
                    } : {}),
                },
                delivery_detail: {
                    method:   "standard",
                    shipping: pricing.shipping,
                    is_free:  pricing.shipping === 0,
                    ...(shippingZoneName ? { zone_name: shippingZoneName } : {}),
                },
            })

            const redirectUrl = result.payment_redirect ?? (result as any).redirect_url
            if (redirectUrl) {
                sessionStorage.setItem("pending_order_id", String(result.order_id))
                window.location.href = redirectUrl
                return
            }

            dispatch(clearCart())

            setOrderResult(result)

        } catch (err: any) {
            if (err?.errors) {
                const mapped: Record<string, string> = {}
                for (const [field, msgs] of Object.entries(err.errors as Record<string, string[]>)) {
                    const key = field.split(".").pop() ?? field
                    mapped[key] = (msgs as string[])[0]
                }
                setFieldErrors(mapped)
                setError("Please fix the errors above.")
            } else {
                setError(err?.message ?? "Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }, [
        agree, cartItems, contact, address,
        selectedZoneIndex, payMethod,
       pricing, buildPayload,
        dispatch, orderAmountError, settings,
    ])

    return {
        contact,           setContact,
        address,           setAddress,
        selectedZoneIndex, setSelectedZoneIndex,
        payMethod,         setPayMethod,
        couponInput,       setCouponInput,

        couponLoading,
        couponError,


        cardForm,          setCardForm,
        mobileNumber,      setMobileNumber,
        bankRef,           setBankRef,
        pricing,
        orderAmountError,
        settings,
        settingsLoading,
        loading,
        error,
        fieldErrors,
        orderResult,
        submit,
    }
}