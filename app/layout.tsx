import { AuthProvider } from "@/components/AuthProvider";
import SeoHead from "@/components/SeoHead";
import SmoothScroll from "@/components/SmoothScroll";
import { apiUrl, imgUrl } from "@/lib/config";
import { ReduxProvider } from "@/store/ReduxProvider";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

async function fetchSettings() {
  try {
    const res = await fetch(apiUrl("setting"), {
      next: { revalidate: 3600 }, // re-fetch at most once per hour
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ── generateMetadata replaces the static `metadata` export ────────────────
export async function generateMetadata(): Promise<Metadata> {
  const s = await fetchSettings();

  // Fallbacks used when API is unreachable or fields are null
  const title = s?.seo_title ?? "";
  const description = s?.seo_description ?? "";
  const faviconHref = s?.favicon ? imgUrl(s.favicon) : "/favicon.ico";
  const logoHref = s?.logo ? imgUrl(s.logo) : undefined;

  return {
    // ── Basic ──────────────────────────────────────────────────────────────
    title,
    description,
    generator: "v0.app",

    // ── Favicon / icons ────────────────────────────────────────────────────
    icons: {
      icon: faviconHref,
      shortcut: faviconHref,
      apple: faviconHref,
    },

    // ── Open Graph ─────────────────────────────────────────────────────────
    openGraph: {
      title,
      description,
      siteName: s?.site_name ?? "",
      ...(logoHref && {
        images: [{ url: logoHref }],
      }),
    },

    // ── Twitter card ───────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(logoHref && { images: [logoHref] }),
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
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
