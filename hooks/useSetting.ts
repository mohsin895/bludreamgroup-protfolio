"use client"

import { useState, useEffect } from "react"
import { apiUrl, imgUrl } from "@/lib/config"

// ── Shape of the /api/setting response ──────────────────────────────────────
export interface SiteSettings {
    id: number
    site_name: string
    logo: string | null
    whitebglogo: string | null
    favicon: string | null
    email: string | null
    phone: string | null
    currency: string
    address: string | null
    footer_content: string | null
    fb: string | null
    wp: string | null
    twitter: string | null
    youtube: string | null
    linkdi: string | null
    videoUrl: string | null
    iosUrl: string | null
    androidUrl: string | null
    webUrl: string | null
    term_condition: string | null
    privacy_policy: string | null
    return_policy: string | null
    about_us: string | null
    seo_title: string | null
    seo_description: string | null
    google_pixle: string | null
    facebook_pixle: string | null
}

interface UseSettingReturn {
    setting: SiteSettings | null
    loading: boolean
    error: string | null
    /** Convenience: full URL for the main (light-bg) logo */
    logoUrl: string
    /** Convenience: full URL for the white-background logo */
    whiteLogoUrl: string
}

// Module-level cache so the fetch only runs once per page lifecycle
let _cache: SiteSettings | null = null
let _promise: Promise<SiteSettings> | null = null

async function fetchSetting(): Promise<SiteSettings> {
    if (_cache) return _cache
    if (!_promise) {
        _promise = fetch(apiUrl("setting"))
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then((json) => {
                _cache = json.data as SiteSettings
                return _cache
            })
    }
    return _promise
}

export function useSetting(): UseSettingReturn {
    const [setting, setSetting] = useState<SiteSettings | null>(_cache)
    const [loading, setLoading] = useState(!_cache)
    const [error, setError]     = useState<string | null>(null)

    useEffect(() => {
        if (_cache) return // already fetched
        setLoading(true)
        fetchSetting()
            .then((data) => { setSetting(data); setLoading(false) })
            .catch((err) => { setError(err.message); setLoading(false) })
    }, [])

    return {
        setting,
        loading,
        error,
        logoUrl:      imgUrl(setting?.logo),
        whiteLogoUrl: imgUrl(setting?.logo),
    }
}