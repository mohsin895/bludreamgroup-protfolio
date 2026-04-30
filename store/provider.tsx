"use client"
// store/Providers.tsx
// Wrap your root layout with this component.

import { Provider } from "react-redux"
import { store }    from "./store"
import { useEffect } from "react"
import { useAppDispatch } from "./hooks"
import { hydrateCart } from "./cartSlice"

function CartHydrator({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(hydrateCart())
    }, [dispatch])
    return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <CartHydrator>{children}</CartHydrator>
        </Provider>
    )
}