// lib/api/resourceapi.tsx

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Resource {
    id: number;
    title: string;
    description: string | null;
    resource_categoriey_id: number | null;
    type: string;          // "Guide" | "Template" | "Checklist" | "Worksheet" | "Video"
    icon: string | null;
    color: string | null;
    bg: string | null;
    read_time: string | null;
    pages: string | null;
    format: string | null;
    href: string | null;
    tags: string[] | null; // JSON array in DB, parsed array here
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface ResourceListResponse {
    status: boolean;
    message: string;
    data: Resource[];
}

export interface ResourceDetailResponse {
    status: boolean;
    message: string;
    data: Resource;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const TYPE_STYLES: Record<string, { color: string; bg: string; icon: string }> = {
    Guide:     { color: "#C9A84C", bg: "rgba(201,168,76,0.10)",   icon: "▣" },
    Template:  { color: "#7DD4B0", bg: "rgba(125,212,176,0.10)",  icon: "▤" },
    Checklist: { color: "#8BA7E0", bg: "rgba(139,167,224,0.10)",  icon: "✓" },
    Worksheet: { color: "#C97B8C", bg: "rgba(201,123,140,0.10)",  icon: "◎" },
    Video:     { color: "#7DD4B0", bg: "rgba(125,212,176,0.10)",  icon: "▶" },
};

export const RESOURCE_TYPES = ["Guide", "Template", "Checklist", "Worksheet", "Video"] as const;

/** Resolve type style, falling back to a gold default */
export function typeStyle(type: string) {
    return TYPE_STYLES[type] ?? { color: "#C9A84C", bg: "rgba(201,168,76,0.10)", icon: "★" };
}

/** Normalise tags — DB may return JSON string or already-parsed array */
export function parseTags(tags: string[] | string | null): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────────────────────

/** All resources */
export async function getAllResources(): Promise<Resource[]> {
    try {
        const res = await fetch(`${API_BASE}/resources`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ResourceListResponse = await res.json();
        if (!json.status) throw new Error(json.message);
        return (json.data ?? []).map(normalise);
    } catch (err) {
        console.error("[resourceapi] getAllResources:", err);
        return [];
    }
}

/** Featured resource (is_featured = true, first result) */
export async function getFeaturedResource(): Promise<Resource | null> {
    const all = await getAllResources();
    return all.find((r) => r.is_featured) ?? all[0] ?? null;
}

/** Non-featured resources */
export async function getGridResources(): Promise<Resource[]> {
    const all = await getAllResources();
    const featured = all.find((r) => r.is_featured) ?? all[0];
    if (!featured) return all;
    return all.filter((r) => r.id !== featured.id);
}

/** Single resource by id */
export async function getResourceById(id: number): Promise<Resource | null> {
    try {
        const res = await fetch(`${API_BASE}/resources/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ResourceDetailResponse = await res.json();
        if (!json.status) throw new Error(json.message);
        return normalise(json.data);
    } catch (err) {
        console.error("[resourceapi] getResourceById:", err);
        return null;
    }
}

/** Resources by type */
export async function getResourcesByType(type: string): Promise<Resource[]> {
    const all = await getAllResources();
    if (type === "All") return all;
    return all.filter((r) => r.type === type);
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Ensure tags is always a plain array, apply fallback type styling */
function normalise(r: Resource): Resource {
    const ts = typeStyle(r.type);
    return {
        ...r,
        tags: parseTags(r.tags as unknown as string),
        color: r.color ?? ts.color,
        bg:    r.bg    ?? ts.bg,
        icon:  r.icon  ?? ts.icon,
    };
}