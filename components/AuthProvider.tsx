// components/AuthProvider.tsx
"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setUser, setInitialized, logout, selectToken, selectInitialized } from "@/store/authSlice"
import { authApi } from "@/lib/api/authApi"

/**
 * Wrap your layout with this to rehydrate the user on page load.
 * It reads the token from localStorage (via Redux), calls /auth/me,
 * and sets the user — or clears the token if it's expired.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch     = useAppDispatch()
    const token        = useAppSelector(selectToken)
    const initialized  = useAppSelector(selectInitialized)

    useEffect(() => {
        if (initialized) return

        if (!token) {
            dispatch(setInitialized())
            return
        }

        authApi.me(token)
            .then(res => {
                dispatch(setUser(res.user))
            })
            .catch(() => {
                // Token expired or invalid — clear it
                dispatch(logout())
            })
            .finally(() => {
                dispatch(setInitialized())
            })
    }, [token, initialized, dispatch])

    return <>{children}</>
}