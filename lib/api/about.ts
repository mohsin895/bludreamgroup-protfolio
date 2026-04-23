// ─── Base URLs ────────────────────────────────────────────────────────────────

const API_BASE   = process.env.NEXT_PUBLIC_API_BASE_URL   ?? "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiAbout {
    id:          number;
    name:        string;           // author display name
    quote:       string | null;    // pull-quote for homepage strip
    page_title:  string;
    about_title: string;
    logo:        string | null;
    resume:      string | null;
    description: string;           // rich HTML
    created_at:  string;
    updated_at:  string;
}

export interface ApiCareerJourney {
    id:          number;
    title:       string;
    description: string;
    year:        string;
    status:      "active" | "inactive";
    created_at:  string;
    updated_at:  string;
}

interface ApiResponse<T> {
    status:  boolean;
    message: string;
    data:    T;
}

// ─── Mapped / UI shapes ────────────────────────────────────────────────────────

export interface MappedAbout {
    name:        string;
    quote:       string | null;
    pageTitle:   string;
    aboutTitle:  string;
    description: string;           // raw HTML
    logoUrl:     string | null;
    resumeUrl:   string | null;
}

export interface MappedMilestone {
    id:          number;
    year:        string;
    title:       string;
    description: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE}${path}`;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapAbout(raw: ApiAbout): MappedAbout {
    return {
        name:        raw.name,
        quote:       raw.quote,
        pageTitle:   raw.page_title,
        aboutTitle:  raw.about_title,
        description: raw.description,
        logoUrl:     buildUrl(raw.logo),
        resumeUrl:   buildUrl(raw.resume),
    };
}

export function mapMilestone(raw: ApiCareerJourney): MappedMilestone {
    return {
        id:          raw.id,
        year:        raw.year,
        title:       raw.title,
        description: raw.description,
    };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchAbout(): Promise<MappedAbout> {
    const res = await fetch(`${API_BASE}/about`, { cache: "no-store" });
    if (!res.ok) throw new Error(`About fetch failed: ${res.status}`);
    const json: ApiResponse<ApiAbout> = await res.json();
    if (!json.status) throw new Error(json.message ?? "About error.");
    return mapAbout(json.data);
}

export async function fetchCareerJourney(): Promise<MappedMilestone[]> {
    const res = await fetch(`${API_BASE}/career-journey`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Career journey fetch failed: ${res.status}`);
    const json: ApiResponse<ApiCareerJourney[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Career journey error.");
    return json.data
        .filter((m) => m.status === "active")
        .map(mapMilestone)
        .sort((a, b) => Number(a.year) - Number(b.year));
}

export async function fetchAboutPageData(): Promise<{
    about:      MappedAbout;
    milestones: MappedMilestone[];
}> {
    const [about, milestones] = await Promise.all([
        fetchAbout(),
        fetchCareerJourney(),
    ]);
    return { about, milestones };
}