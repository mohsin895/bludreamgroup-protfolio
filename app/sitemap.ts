import type { MetadataRoute } from "next";
import { apiUrl } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://shopnillchowdhury.com"; // 👈 replace with your real domain

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        // add other static pages here
    ];

    // Dynamic routes, e.g. products/blog posts from your API
    let dynamicRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(apiUrl("books")); // adjust endpoint to your actual API
        if (res.ok) {
            const json = await res.json();
            const items = json.data ?? [];
            dynamicRoutes = items.map((item: { slug: string; updated_at?: string }) => ({
                url: `${baseUrl}/books/${item.slug}`,
                lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
                changeFrequency: "weekly",
                priority: 0.6,
            }));
        }
    } catch {
        // fail silently — sitemap still returns static routes
    }

    return [...staticRoutes, ...dynamicRoutes];
}