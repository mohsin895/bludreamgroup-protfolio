// lib/api/media.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type MediaType = "photo" | "video" | "press" | "event";
export type SpanType = "wide" | "tall" | "normal";

export interface MediaItem {
    id: number;
    type: MediaType;
    category: string;
    title: string;
    subtitle: string;
    date: string;
    tag: string;
    aspect_ratio: string;
    accent_color: string;
    span: SpanType;
    media_url: string | null;
    press_url: string | null;
    description: string | null;
    is_featured: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface MediaListResponse {
    data: MediaItem[];
}

export async function getMediaItems(filters?: { type?: MediaType }): Promise<MediaListResponse> {
    if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL not set");

    const url = new URL(`${BASE_URL}/media`);
    if (filters?.type) url.searchParams.set("type", filters.type);

    const res = await fetch(url.toString());
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "Failed to fetch media");

    // Your backend returns { status, message, data }
    return { data: json.data };
}