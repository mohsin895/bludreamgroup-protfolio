import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",

        },
        sitemap: "https://shopnillchowdhury.com/sitemap.xml", // 👈 replace with your real domain
    };
}