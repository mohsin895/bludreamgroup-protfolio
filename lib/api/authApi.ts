import {AuthUser} from "@/store/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"

async function apiFetch<T>(
    endpoint: string,
    options:  RequestInit = {},
    token?:   string | null,
): Promise<T> {
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
        const err = await res.json().catch(() => ({ message: "Network error" }))
        throw { status: res.status, ...err }
    }

    return res.json() as Promise<T>
}

// ── Payload types ─────────────────────────────────────────────────────────────

export interface RegisterPayload {
    name:                  string
    email:                 string
    password:              string
    password_confirmation: string
    phone?:                string
}

export interface LoginPayload {
    email:    string
    password: string
}

export interface UpdateProfilePayload {
    name?:    string
    email?:   string
    phone?:   string
    address?: string
    city?:    string
    zip?:     string
    country?: string
}

export interface ChangePasswordPayload {
    current_password:      string
    password:              string
    password_confirmation: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token:                 string
    email:                 string
    password:              string
    password_confirmation: string
}

// ── Response types ────────────────────────────────────────────────────────────

export interface AuthResponse {
    user:    import("@/store/authSlice").AuthUser
    token:   string
    message: string
}

// ── API ───────────────────────────────────────────────────────────────────────

export const authApi = {
    register: (data: RegisterPayload) =>
        apiFetch<AuthResponse>("/auth/register", {
            method: "POST",
            body:   JSON.stringify(data),
        }),

    login: (data: LoginPayload) =>
        apiFetch<AuthResponse>("/auth/login", {
            method: "POST",
            body:   JSON.stringify(data),
        }),

    logout: (token: string) =>
        apiFetch<{ message: string }>("/auth/logout", { method: "POST" }, token),

    me: (token: string) =>
        apiFetch<{ user: import("@/store/authSlice").AuthUser }>("/auth/me", {}, token),

    updateProfile: (data: UpdateProfilePayload, token: string) =>
        apiFetch<{ user: import("@/store/authSlice").AuthUser; message: string }>(
            "/auth/profile", { method: "PUT", body: JSON.stringify(data) }, token,
        ),

    changePassword: (data: ChangePasswordPayload, token: string) =>
        apiFetch<{ message: string }>(
            "/auth/password", { method: "PUT", body: JSON.stringify(data) }, token,
        ),

    forgotPassword: (data: ForgotPasswordPayload) =>
        apiFetch<{ message: string }>("/auth/forgot-password", {
            method: "POST",
            body:   JSON.stringify(data),
        }),

    resetPassword: (data: ResetPasswordPayload) =>
        apiFetch<{ message: string }>("/auth/reset-password", {
            method: "POST",
            body:   JSON.stringify(data),
        }),

    uploadAvatar: (file: File, token: string) => {
        const form = new FormData()
        form.append("avatar", file)
        return fetch(`${API_BASE}/auth/avatar`, {
            method:  "POST",
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            body:    form,
        }).then(r => r.json()) as Promise<{ user: import("@/store/authSlice").AuthUser }>
    },
}