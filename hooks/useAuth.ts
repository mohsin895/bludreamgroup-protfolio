// hooks/useAuth.ts
"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    setCredentials, setUser, setError, setLoading, logout as logoutAction,
    selectUser, selectToken, selectIsAuth, selectAuthLoading, selectAuthError,
} from "@/store/authSlice"
import {
    authApi,
    type LoginPayload,
    type RegisterPayload,
    type UpdateProfilePayload,
    type ChangePasswordPayload,
    type ForgotPasswordPayload,
    type ResetPasswordPayload,
} from "@/lib/api/authApi"

export function useAuth() {
    const dispatch = useAppDispatch()
    const router   = useRouter()

    const user      = useAppSelector(selectUser)
    const token     = useAppSelector(selectToken)
    const isAuth    = useAppSelector(selectIsAuth)
    const isLoading = useAppSelector(selectAuthLoading)
    const error     = useAppSelector(selectAuthError)

    // ── Register ──────────────────────────────────────────────────────────────
    const register = useCallback(async (data: RegisterPayload) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await authApi.register(data)
            dispatch(setCredentials({ user: res.user, token: res.token }))
            router.push("/")
            return { success: true }
        } catch (err: any) {
            const msg = err?.errors
                ? Object.values(err.errors as Record<string, string[]>).flat()[0]
                : err?.message ?? "Registration failed."
            dispatch(setError(msg))
            return { success: false, error: msg, errors: err?.errors }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, router])

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = useCallback(async (data: LoginPayload, redirectTo = "/") => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await authApi.login(data)
            dispatch(setCredentials({ user: res.user, token: res.token }))
            router.push(redirectTo)
            return { success: true }
        } catch (err: any) {
            const msg = err?.message ?? "Invalid email or password."
            dispatch(setError(msg))
            return { success: false, error: msg }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, router])

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        if (token) await authApi.logout(token).catch(() => {})
        dispatch(logoutAction())
        router.push("/login")
    }, [dispatch, router, token])

    // ── Update profile ────────────────────────────────────────────────────────
    const updateProfile = useCallback(async (data: UpdateProfilePayload) => {
        if (!token) return { success: false, error: "Not authenticated." }
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await authApi.updateProfile(data, token)
            dispatch(setUser(res.user))
            return { success: true }
        } catch (err: any) {
            const msg = err?.message ?? "Update failed."
            dispatch(setError(msg))
            return { success: false, error: msg, errors: err?.errors }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, token])

    // ── Change password (while logged in) ─────────────────────────────────────
    const changePassword = useCallback(async (data: ChangePasswordPayload) => {
        if (!token) return { success: false, error: "Not authenticated." }
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            await authApi.changePassword(data, token)
            return { success: true }
        } catch (err: any) {
            const msg = err?.message ?? "Password change failed."
            dispatch(setError(msg))
            return { success: false, error: msg, errors: err?.errors }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, token])

    // ── Forgot password — send reset email ────────────────────────────────────
    const forgotPassword = useCallback(async (data: ForgotPasswordPayload) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await authApi.forgotPassword(data)
            return { success: true, message: res.message }
        } catch (err: any) {
            const msg = err?.errors?.email?.[0] ?? err?.message ?? "Failed to send reset email."
            dispatch(setError(msg))
            return { success: false, error: msg }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    // ── Reset password — consume token from email link ────────────────────────
    const resetPassword = useCallback(async (data: ResetPasswordPayload) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await authApi.resetPassword(data)
            return { success: true, message: res.message }
        } catch (err: any) {
            const msg = err?.errors?.token?.[0] ?? err?.message ?? "Password reset failed."
            dispatch(setError(msg))
            return { success: false, error: msg, errors: err?.errors }
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    // ── Upload avatar ─────────────────────────────────────────────────────────
    const uploadAvatar = useCallback(async (file: File) => {
        if (!token) return { success: false }
        try {
            const res = await authApi.uploadAvatar(file, token)
            if (res.user) dispatch(setUser(res.user))
            return { success: true }
        } catch {
            return { success: false }
        }
    }, [dispatch, token])

    return {
        user, token, isAuth, isLoading, error,
        register, login, logout,
        updateProfile, changePassword,
        forgotPassword, resetPassword,
        uploadAvatar,
    }
}