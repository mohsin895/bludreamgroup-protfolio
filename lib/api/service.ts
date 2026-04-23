// ─── Base URLs ────────────────────────────────────────────────────────────────

const API_BASE   = process.env.NEXT_PUBLIC_API_BASE_URL   ?? "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiServiceCategory {
    id:          number;
    title:       string;
    note_icon:   string;          // Font Awesome class e.g. "fa-microphone"
    description: string;
    status:      "active" | "inactive";
    created_at:  string;
    updated_at:  string;
}

export interface ApiServiceImageSizes {
    original: string;
    small:    string;
    medium:   string;
    large:    string;
}

export interface ApiServiceNote {
    note_icon:        string;   // FA class
    note_title:       string;
    note_description: string;
}

export interface ApiService {
    id:                  number;
    service_category_id: number | null;
    title:               string;
    slug:                string;
    serviceNote:         string | null;   // JSON string → ApiServiceNote[]
    image:               string | null;   // JSON string → ApiServiceImageSizes
    description:         string | null;   // HTML
    type:                number;
    status:              "active" | "inactive";
    created_at:          string;
    updated_at:          string;
    category:            ApiServiceCategory | null;
}

interface ApiResponse<T> {
    status:  boolean;
    message: string;
    data:    T;
}

// ─── Mapped / UI shapes ────────────────────────────────────────────────────────

export interface MappedServiceNote {
    icon:        string;
    title:       string;
    description: string;
}

export interface MappedServiceImage {
    original: string;
    small:    string;
    medium:   string;
    large:    string;
}

export interface MappedService {
    id:           number;
    slug:         string;
    title:        string;
    description:  string | null;          // raw HTML
    excerpt:      string;                 // plain text, max 140 chars
    imageUrl:     string | null;          // medium image
    imageSet:     MappedServiceImage | null;
    notes:        MappedServiceNote[];
    categoryId:   number | null;
    categoryTitle:string;
    categoryIcon: string;
    createdAt:    string;
}

export interface MappedServiceCategory {
    id:          number;
    title:       string;
    icon:        string;
    description: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE}${path}`;
}

function parseImageJson(raw: string | null): MappedServiceImage | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as ApiServiceImageSizes;
        return {
            original: buildUrl(parsed.original) ?? "",
            small:    buildUrl(parsed.small)    ?? "",
            medium:   buildUrl(parsed.medium)   ?? "",
            large:    buildUrl(parsed.large)    ?? "",
        };
    } catch {
        return null;
    }
}

function parseNotesJson(raw: string | null): MappedServiceNote[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as ApiServiceNote[];
        return parsed.map((n) => ({
            icon:        n.note_icon,
            title:       n.note_title,
            description: n.note_description,
        }));
    } catch {
        return [];
    }
}

function stripHtml(html: string | null): string {
    if (!html) return "";
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g,  "&")
        .replace(/&lt;/g,   "<")
        .replace(/&gt;/g,   ">")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g,    " ")
        .trim();
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapService(raw: ApiService): MappedService {
    const imageSet  = parseImageJson(raw.image);
    const plainText = stripHtml(raw.description);
    return {
        id:            raw.id,
        slug:          raw.slug,
        title:         raw.title,
        description:   raw.description,
        excerpt:       plainText.length > 140 ? plainText.slice(0, 140).trimEnd() + "…" : plainText,
        imageUrl:      imageSet?.medium ?? null,
        imageSet,
        notes:         parseNotesJson(raw.serviceNote),
        categoryId:    raw.service_category_id,
        categoryTitle: raw.category?.title      ?? "General",
        categoryIcon:  raw.category?.note_icon  ?? "fa-circle",
        createdAt:     new Date(raw.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
}

export function mapCategory(raw: ApiServiceCategory): MappedServiceCategory {
    return {
        id:          raw.id,
        title:       raw.title,
        icon:        raw.note_icon,
        description: raw.description,
    };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchServiceCategories(): Promise<MappedServiceCategory[]> {
    const res = await fetch(`${API_BASE}/service-category`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Service categories fetch failed: ${res.status}`);
    const json: ApiResponse<ApiServiceCategory[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Service categories error.");
    return json.data
        .filter((c) => c.status === "active")
        .map(mapCategory);
}

export async function fetchServices(): Promise<MappedService[]> {
    const res = await fetch(`${API_BASE}/service`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Services fetch failed: ${res.status}`);
    const json: ApiResponse<ApiService[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Services error.");
    return json.data
        .filter((s) => s.status === "active")
        .map(mapService);
}

export async function fetchServiceBySlug(slug: string): Promise<MappedService | null> {
    // API uses numeric ID in the route; slug == id for now — try slug as-is first,
    // fallback: fetch all and find by slug client-side
    const res = await fetch(`${API_BASE}/service-details/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) {
        // Fallback: fetch list and find by slug
        const all = await fetchServices();
        return all.find((s) => s.slug === slug) ?? null;
    }
    const json: ApiResponse<ApiService> = await res.json();
    if (!json.status) return null;
    return mapService(json.data);
}

/** Fetch services + categories in parallel */
export async function fetchServicesPageData(): Promise<{
    services:   MappedService[];
    categories: MappedServiceCategory[];
}> {
    const [services, categories] = await Promise.all([
        fetchServices(),
        fetchServiceCategories(),
    ]);
    return { services, categories };
}