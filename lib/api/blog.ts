// ─── Base URLs ────────────────────────────────────────────────────────────────

const API_BASE   = process.env.NEXT_PUBLIC_API_BASE_URL   ?? "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiBlogCategory {
    id:          number;
    image:       string | null;
    title:       string;
    description: string | null;
    status:      "active" | "inactive";
    created_at:  string;
    updated_at:  string;
}

export interface ApiBlogTag {
    id:         number;
    title:      string;
    status:     "active" | "inactive";
    created_at: string;
    updated_at: string;
    pivot:      { blog_id: number; tag_id: number };
}

export interface ApiBlogWriter {
    id:          number;
    image:       string | null;
    name:        string;
    designation: string | null;
    description: string | null;
    fb:          string | null;
    wp:          string | null;
    twitter:     string | null;
    youtube:     string | null;
    linkdi:      string | null;
    status:      "active" | "inactive";
    created_at:  string;
    updated_at:  string;
    pivot:       { blog_id: number; writer_id: number };
}

export interface ApiBlog {
    id:               number;
    image:            string | null;
    title:            string;
    short_description:string | null;
    description:      string | null;
    meta_title:       string | null;
    meta_description: string | null;
    status:           "active" | "inactive";
    slug:             string;
    featured:         0 | 1;
    seo_title:        string | null;
    seo_description:  string | null;
    seo_image:        string | null;
    created_at:       string;
    updated_at:       string;
    category_id:      number;
    imageTitle:       string | null;
    totalViews:       number | null;
    readingTime:      string | null;   // seconds as string e.g. "223"
    createdTime:      string | null;
    tags:             ApiBlogTag[];
    category:         ApiBlogCategory | null;
    writers:          ApiBlogWriter[];
}

interface ApiResponse<T> {
    status:  boolean;
    message: string;
    data:    T;
}

// ─── Mapped / UI shapes ────────────────────────────────────────────────────────

export interface MappedWriter {
    id:          number;
    name:        string;
    designation: string;
    description: string;
    imageUrl:    string | null;
    initials:    string;
    twitter:     string | null;
    linkedin:    string | null;
}

export interface MappedBlog {
    id:           number;
    slug:         string;
    title:        string;
    excerpt:      string;
    description:  string | null;      // raw HTML
    imageUrl:     string | null;
    category:     string;
    categoryId:   number;
    tag:          string;             // first tag title or category title
    tags:         string[];
    date:         string;             // "Apr 20, 2026"
    readTime:     string;             // "4 min read"
    featured:     boolean;
    writers:      MappedWriter[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildImageUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE}${path}`;
}

function buildInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

/** Convert readingTime (seconds as string) → "N min read" */
function formatReadTime(seconds: string | null): string {
    if (!seconds) return "1 min read";
    const mins = Math.max(1, Math.round(Number(seconds) / 60));
    return `${mins} min read`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapWriter(raw: ApiBlogWriter): MappedWriter {
    return {
        id:          raw.id,
        name:        raw.name,
        designation: raw.designation ?? "",
        description: raw.description ?? "",
        imageUrl:    buildImageUrl(raw.image),
        initials:    buildInitials(raw.name),
        twitter:     raw.twitter,
        linkedin:    raw.linkdi,
    };
}

export function mapBlog(raw: ApiBlog): MappedBlog {
    const tags    = raw.tags.map((t) => t.title);
    const catTitle = raw.category?.title ?? "General";

    return {
        id:          raw.id,
        slug:        raw.slug,
        title:       raw.title,
        excerpt:     raw.short_description ?? "",
        description: raw.description,
        imageUrl:    buildImageUrl(raw.image),
        category:    catTitle,
        categoryId:  raw.category_id,
        tag:         tags[0] ?? catTitle,
        tags,
        date:        formatDate(raw.created_at),
        readTime:    formatReadTime(raw.readingTime),
        featured:    raw.featured == 1,
        writers:     raw.writers.map(mapWriter),
    };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchBlogCategories(): Promise<ApiBlogCategory[]> {
    const res = await fetch(`${API_BASE}/blog/category`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Blog categories fetch failed: ${res.status}`);
    const json: ApiResponse<ApiBlogCategory[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Blog categories error.");
    return json.data;
}

export async function fetchBlogs(): Promise<MappedBlog[]> {
    const res = await fetch(`${API_BASE}/blog`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Blogs fetch failed: ${res.status}`);
    const json: ApiResponse<ApiBlog[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Blogs error.");
    return json.data
        .filter((b) => b.status === "active")
        .map(mapBlog);
}

export async function fetchBlogBySlug(slug: string): Promise<MappedBlog | null> {
    const res = await fetch(`${API_BASE}/blog/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Blog fetch failed: ${res.status}`);
    const json: ApiResponse<ApiBlog> = await res.json();
    if (!json.status) return null;
    return mapBlog(json.data);
}