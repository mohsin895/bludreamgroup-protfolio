import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export interface User {
    id:          number
    name:        string
    fName:       string
    lName:       string
    email:       string
    phone?:      string
    avatar?:     string
    address?:    string
    city?:       string
    zip?:        string
    country?:    string
    roleType?:   "admin" | "user"
    status?:     "active" | "inactive"
    created_at?: string
}

export interface AuthState {
    user:        User | null
    token:       string | null
    isLoading:   boolean
    error:       string | null
    initialized: boolean
}

const initialState: AuthState = {
    user:        null,
    token:       null,
    isLoading:   false,
    error:       null,
    initialized: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user  = action.payload.user
            state.token = action.payload.token
            state.error = null
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
        setInitialized(state) {
            state.initialized = true
        },
        logout(state) {
            state.user        = null
            state.token       = null
            state.error       = null
            state.initialized = true
        },
    },
})

export const {
    setCredentials, setUser, setError,
    setLoading, setInitialized, logout,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectUser        = (state: RootState) => state.auth.user
export const selectToken       = (state: RootState) => state.auth.token
export const selectIsAuth      = (state: RootState) => !!state.auth.token && !!state.auth.user
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError   = (state: RootState) => state.auth.error
export const selectInitialized = (state: RootState) => state.auth.initialized