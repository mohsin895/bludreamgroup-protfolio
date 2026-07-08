import { AuthProvider } from "@/components/AuthProvider";
import SeoHead from "@/components/SeoHead";
import SmoothScroll from "@/components/SmoothScroll";
import { apiUrl, imgUrl } from "@/lib/config";
import { ReduxProvider } from "@/store/ReduxProvider";
import type { Metadata } from "next";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

/* ================= SEO DYNAMIC ================= */
async function fetchSettings() {
    try {
        const res = await fetch(apiUrl("setting"), {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const s = await fetchSettings();

    const title = s?.seo_title ?? "KSM Shopnill Chowdhury Shohag";
    const description = s?.seo_description ?? "";
    const faviconHref = s?.favicon ? imgUrl(s.favicon) : "/favicon.ico";
    const logoHref = s?.logo ? imgUrl(s.logo) : undefined;

    return {
        title,
        description,
        generator: "v0.app",

        icons: {
            icon: faviconHref,
            shortcut: faviconHref,
            apple: faviconHref,
        },

        openGraph: {
            title,
            description,
            siteName: s?.site_name ?? "",
            images: logoHref ? [{ url: logoHref }] : [],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: logoHref ? [logoHref] : [],
        },

        verification: {
            google: "GxuNdLuxmbvGjyuovjq68Wkfw7gODl5eGo1HmknpzM8",
        },
    };
}

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            {/* Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond&family=DM+Sans:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />

            {/* ================= GTM SCRIPT ================= */}
            <Script
                id="gtm-script"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MCH4M5QQ');
            `,
                }}
            />

            {/* ================= GOOGLE ANALYTICS (gtag.js) ================= */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-E8ST0FBGCD"
                strategy="afterInteractive"
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E8ST0FBGCD');
            `,
                }}
            />
        </head>

        <body>
        {/* ================= GTM NOSCRIPT ================= */}
        <noscript>
            <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MCH4M5QQ"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
            />
        </noscript>

        {/* ================= APP ================= */}
        <SmoothScroll>
            <ReduxProvider>
                <SeoHead />
                <AuthProvider>{children}</AuthProvider>
                <ToastContainer position="top-right" autoClose={3000} />
            </ReduxProvider>
        </SmoothScroll>
        </body>
        </html>
    );
}