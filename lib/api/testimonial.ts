// ─── Base URLs ────────────────────────────────────────────────────────────────

const API_BASE      = process.env.NEXT_PUBLIC_API_BASE_URL  ?? "";
const IMAGE_BASE    = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiTestimonialCategory {
    id:         number;
    title:      string;
    status:     "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface ApiTestimonial {
    id:                      number;
    testimonial_category_id: number;
    name:                    string;
    role:                    string;
    company:                 string;
    avatar:                  string | null;   // relative path e.g. "uploads/testimonial/xyz.jpeg"
    color:                   string | null;
    bg:                      string | null;
    rating:                  number;
    featured:                0 | 1;
    quote:                   string;
    tag:                     string;
    joined:                  string;
    status:                  "active" | "inactive";
    created_at:              string;
    updated_at:              string;
    category:                ApiTestimonialCategory | null;
}

interface ApiResponse<T> {
    status:  boolean;
    message: string;
    data:    T;
}

// ─── Mapped / UI shape ─────────────────────────────────────────────────────────

/** Palette for when the API returns null color/bg */
const FALLBACK_PALETTES = [
    { color: "#C9A84C", bg: "rgba(201,168,76,0.08)"  },
    { color: "#7DD4B0", bg: "rgba(125,212,176,0.08)" },
    { color: "#C97B8C", bg: "rgba(201,123,140,0.08)" },
    { color: "#8BA7E0", bg: "rgba(139,167,224,0.08)" },
];

export interface MappedTestimonial {
    id:            number;
    name:          string;
    role:          string;
    company:       string;
    /** Initials fallback when no image */
    initials:      string;
    /** Full URL or null */
    avatarUrl:     string | null;
    color:         string;
    bg:            string;
    rating:        number;
    featured:      boolean;
    quote:         string;
    tag:           string;
    joined:        string;
    categoryTitle: string;
}

function buildInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function buildAvatarUrl(path: string | null): string | null {
    if (!path) return null;
    // Already absolute
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE}${path}`;
}

export function mapTestimonial(
    raw: ApiTestimonial,
    index: number
): MappedTestimonial {
    const palette = FALLBACK_PALETTES[index % FALLBACK_PALETTES.length]!;
    return {
        id:            raw.id,
        name:          raw.name,
        role:          raw.role,
        company:       raw.company,
        initials:      buildInitials(raw.name),
        avatarUrl:     buildAvatarUrl(raw.avatar),
        color:         raw.color  ?? palette.color,
        bg:            raw.bg     ?? palette.bg,
        rating:        raw.rating,
        featured:      raw.featured === 1,
        quote:         raw.quote,
        tag:           raw.tag,
        joined:        raw.joined,
        categoryTitle: raw.category?.title ?? "General",
    };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchTestimonialCategories(): Promise<ApiTestimonialCategory[]> {
    const res = await fetch(`${API_BASE}/testimonial/category`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Testimonial categories fetch failed: ${res.status}`);
    const json: ApiResponse<ApiTestimonialCategory[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Testimonial categories error.");
    return json.data;
}

export async function fetchTestimonials(): Promise<ApiTestimonial[]> {
    const res = await fetch(`${API_BASE}/testimonial`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Testimonials fetch failed: ${res.status}`);
    const json: ApiResponse<ApiTestimonial[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Testimonials error.");
    return json.data;
}

/**
 * Fetch testimonials + categories in parallel, map to UI shape.
 * Featured testimonial is always first; rest sorted by id ascending.
 */
export async function fetchMappedTestimonials(): Promise<{
    testimonials: MappedTestimonial[];
    categories:   ApiTestimonialCategory[];
}> {
    const [rawList, categories] = await Promise.all([
        fetchTestimonials(),
        fetchTestimonialCategories(),
    ]);

    const active = rawList.filter((t) => t.status === "active");

    // Sort: featured first, then by id
    active.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return  1;
        return a.id - b.id;
    });

    const testimonials = active.map((t, i) => mapTestimonial(t, i));

    return { testimonials, categories };
}