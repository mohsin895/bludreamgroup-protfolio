// promoSlice.ts — full correct file
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface PromoState {
    code:     string
    applied:  boolean
    discount: number
}

const initialState: PromoState = {
    code:     "",
    applied:  false,
    discount: 0,
}

const promoSlice = createSlice({
    name: "promo",
    initialState,
    reducers: {
        setPromo(state, action: PayloadAction<{ code: string; discount: number }>) {
            state.code     = action.payload.code
            state.discount = Math.round(Number(action.payload.discount) * 100) / 100
            state.applied  = true
        },
        clearPromo(state) {
            state.code     = ""
            state.discount = 0
            state.applied  = false
        },
    },
})

export const { setPromo, clearPromo } = promoSlice.actions

export const selectPromo = (state: { promo: PromoState & { _persist?: unknown } }): PromoState => ({
    code:     state.promo?.code    ?? "",
    applied:  state.promo?.applied ?? false,
    discount: Number(state.promo?.discount ?? 0),
})

export default promoSlice.reducer