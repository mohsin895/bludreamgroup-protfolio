import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/api"], // adjust to whatever paths shouldn't be indexed
        },
        sitemap: "https://shopnillchowdhury.com/sitemap.xml", // 👈 replace with your real domain
    };
}