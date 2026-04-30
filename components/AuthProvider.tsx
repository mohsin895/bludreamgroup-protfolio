// components/AuthProvider.tsx
"use client"


import { useAppDispatch } from "@/store/hooks"



/**
 * Wrap your layout with this to rehydrate the user on page load.
 * It reads the token from localStorage (via Redux), calls /auth/me,
 * and sets the user — or clears the token if it's expired.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch     = useAppDispatch()




    return <>{children}</>
}