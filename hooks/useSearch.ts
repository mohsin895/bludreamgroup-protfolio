// hooks/useSearch.ts
"use client"

import { useState, useEffect, useRef } from "react"
import { apiUrl, imgUrl } from "@/lib/config"

export interface SearchProduct {
    id: number
    name: string
    slug: string
    main_image?: { small?: string; original?: string } | null
}

export function useSearch() {
    const [query,   setQuery]   = useState("")
    const [results, setResults] = useState<SearchProduct[]>([])
    const [loading, setLoading] = useState(false)
    const [open,    setOpen]    = useState(false)
    const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!query.trim()) { setResults([]); setOpen(false); return }

        if (debounce.current) clearTimeout(debounce.current)
        debounce.current = setTimeout(async () => {
            setLoading(true)
            try {
                const res  = await fetch(apiUrl(`products?search=${encodeURIComponent(query)}&per_page=8`))
                const json = await res.json()
                const list: SearchProduct[] = (json.data?.data ?? json.data ?? []).slice(0, 8)
                setResults(list)
                setOpen(true)
            } catch {
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)
    }, [query])

    const clear = () => { setQuery(""); setResults([]); setOpen(false) }

    return { query, setQuery, results, loading, open, setOpen, clear }
}