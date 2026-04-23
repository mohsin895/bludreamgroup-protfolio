"use client"

import { useEffect } from "react"
import { useSetting } from "@/hooks/useSetting"
import { imgUrl } from "@/lib/config"

// Strips HTML comments and extracts only <script> tags from a raw HTML string
function injectRawHtmlScripts(rawHtml: string, guardId: string) {
    if (document.getElementById(guardId)) return // already injected

    // Parse the HTML string in a detached container
    const tpl = document.createElement("template")
    tpl.innerHTML = rawHtml.trim()

    tpl.content.querySelectorAll("script").forEach((originalScript, i) => {
        const s = document.createElement("script")

        // Copy all attributes (async, src, type, etc.)
        Array.from(originalScript.attributes).forEach((attr) =>
            s.setAttribute(attr.name, attr.value)
        )

        // Copy inline content if any
        if (originalScript.textContent) {
            s.textContent = originalScript.textContent
        }

        // Mark the first tag with our guard id
        if (i === 0) s.id = guardId

        document.head.appendChild(s)
    })
}

// Upsert a <meta> tag
function setMeta(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.content = content
}

// Upsert a <link> tag
function setLink(rel: string, href: string, type?: string) {
    let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    if (!el) {
        el = document.createElement("link")
        el.rel = rel
        document.head.appendChild(el)
    }
    el.href = href
    if (type) el.type = type
}

export default function SeoHead() {
    const { setting } = useSetting()

    useEffect(() => {
        if (!setting) return

        // ── Title ──────────────────────────────────────────────────────────────
        if (setting.seo_title) {
            document.title = setting.seo_title
            setMeta("property", "og:title", setting.seo_title)
        }

        // ── Description ────────────────────────────────────────────────────────
        if (setting.seo_description) {
            setMeta("name", "description", setting.seo_description)
            setMeta("property", "og:description", setting.seo_description)
        }

        // ── Favicon ────────────────────────────────────────────────────────────
        if (setting.favicon) {
            const href = imgUrl(setting.favicon)
            setLink("icon", href, "image/x-icon")
            setLink("shortcut icon", href)
        }

        // ── Google Tag — raw HTML from API ─────────────────────────────────────
        if (setting.google_pixle) {
            injectRawHtmlScripts(setting.google_pixle, "gtag-guard")
        }

        // ── Facebook Pixel — raw HTML from API ────────────────────────────────
        if (setting.facebook_pixle) {
            injectRawHtmlScripts(setting.facebook_pixle, "fbpixel-guard")
        }
    }, [setting])

    return null
}