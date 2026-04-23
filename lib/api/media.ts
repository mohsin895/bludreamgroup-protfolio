// lib/api.ts
// ─── Typed API client for the Laravel Media Items backend ────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export type MediaType = "photo" | "video" | "press" | "event";
export type SpanType  = "wide" | "tall" | "normal";

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
    media_url:   string | null;
    press_url:   string | null;
    description: string | null;
    is_featured: boolean;
    sort_order:  number;
    created_at:  string;
    updated_at:  string;
}

export interface MediaItemPayload {
    type:          MediaType;
    category:      string;
    title:         string;
    subtitle:      string;
    date:          string;
    tag:           string;
    aspect_ratio?: string;
    accent_color?: string;
    span?:         SpanType;
    media_url?:    string | null;
    press_url?:    string | null;
    description?:  string | null;
    is_featured?:  boolean;
    sort_order?:   number;
}

export interface MediaStats {
    total: number;
    photo: number;
    video: number;
    press: number;
    event: number;
}

export interface MediaListResponse {
    success: boolean;
    data:    MediaItem[];
    stats:   MediaStats;
}

export interface MediaSingleResponse {
    success: boolean;
    data:    MediaItem;
}

export interface MediaMutateResponse {
    success: boolean;
    message: string;
    data:    MediaItem;
}

export interface MediaDeleteResponse {
    success: boolean;
    message: string;
}

// ── Filters ───────────────────────────────────────────────────────────────────

export interface MediaListFilters {
    type?:     MediaType;
    featured?: boolean;
    per_page?: number;
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
        },
        ...options,
    });

    const json = await res.json();

    if (!res.ok) {
        const message =
            json?.message ?? json?.error ?? `API error ${res.status}`;
        throw new Error(message);
    }

    return json as T;
}

// ── Build query string ────────────────────────────────────────────────────────

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null && val !== "") {
            qs.set(key, String(val));
        }
    }
    const str = qs.toString();
    return str ? `?${str}` : "";
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Fetch all media items (optionally filtered) */
export async function getMediaItems(
    filters: MediaListFilters = {}
): Promise<MediaListResponse> {
    const query = buildQuery({
        type:     filters.type,
        featured: filters.featured ? "1" : undefined,
        per_page: filters.per_page,
    } as Record<string, string | number | boolean | undefined>);

    return apiFetch<MediaListResponse>(`/media-items${query}`);
}

/** Fetch a single media item by ID */
export async function getMediaItem(id: number): Promise<MediaSingleResponse> {
    return apiFetch<MediaSingleResponse>(`/media-items/${id}`);
}

/** Create a new media item */
export async function createMediaItem(
    payload: MediaItemPayload
): Promise<MediaMutateResponse> {
    return apiFetch<MediaMutateResponse>("/media-items", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Update an existing media item (full or partial) */
export async function updateMediaItem(
    id: number,
    payload: Partial<MediaItemPayload>
): Promise<MediaMutateResponse> {
    return apiFetch<MediaMutateResponse>(`/media-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

/** Delete a media item */
export async function deleteMediaItem(id: number): Promise<MediaDeleteResponse> {
    return apiFetch<MediaDeleteResponse>(`/media-items/${id}`, {
        method: "DELETE",
    });
}

/** Update sort_order of a media item */
export async function reorderMediaItem(
    id: number,
    sort_order: number
): Promise<MediaMutateResponse> {
    return apiFetch<MediaMutateResponse>(`/media-items/${id}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ sort_order }),
    });
}