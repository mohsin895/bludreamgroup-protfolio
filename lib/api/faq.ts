// ─── Base URL ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiFaqCategory {
    id:         number;
    title:      string;
    status:     "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface ApiFaq {
    id:              number;
    faq_category_id: number;
    question:        string;
    answer:          string;
    type:            number;
    status:          "active" | "inactive";
    created_at:      string;
    updated_at:      string;
    category:        ApiFaqCategory | null;
}

interface ApiResponse<T> {
    status:  boolean;
    message: string;
    data:    T;
}

// ─── Mapped / UI shapes ────────────────────────────────────────────────────────

export interface MappedFaq {
    id:            number;
    question:      string;
    answer:        string;
    categoryId:    number;
    categoryTitle: string;
}

export interface MappedFaqSection {
    categoryId:    number;
    category:      string;
    icon:          string;
    items:         MappedFaq[];
}

// ─── Category icon map ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
    "orders & payments":   "💳",
    "books & editions":    "📚",
    "shipping & delivery": "📦",
    "author & portfolio":  "✍️",
    "returns & refunds":   "↩️",
};

function getCategoryIcon(title: string): string {
    return CATEGORY_ICONS[title.toLowerCase()] ?? "❓";
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapFaq(raw: ApiFaq): MappedFaq {
    return {
        id:            raw.id,
        question:      raw.question,
        answer:        raw.answer,
        categoryId:    raw.faq_category_id,
        categoryTitle: raw.category?.title ?? "General",
    };
}

/**
 * Groups mapped FAQs into sections by category,
 * preserving the order categories appear in the categories list.
 */
export function groupIntoSections(
    faqs:       MappedFaq[],
    categories: ApiFaqCategory[]
): MappedFaqSection[] {
    // Build ordered category list
    const orderedCats = categories.filter((c) => c.status === "active");

    return orderedCats
        .map((cat) => ({
            categoryId: cat.id,
            category:   cat.title,
            icon:       getCategoryIcon(cat.title),
            items:      faqs.filter((f) => f.categoryId === cat.id),
        }))
        .filter((s) => s.items.length > 0);
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchFaqCategories(): Promise<ApiFaqCategory[]> {
    const res = await fetch(`${API_BASE}/faq/category`, { cache: "no-store" });
    if (!res.ok) throw new Error(`FAQ categories fetch failed: ${res.status}`);
    const json: ApiResponse<ApiFaqCategory[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "FAQ categories error.");
    return json.data;
}

export async function fetchFaqs(): Promise<ApiFaq[]> {
    const res = await fetch(`${API_BASE}/faq`, { cache: "no-store" });
    if (!res.ok) throw new Error(`FAQs fetch failed: ${res.status}`);
    const json: ApiResponse<ApiFaq[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "FAQs error.");
    return json.data;
}

/**
 * Fetch both endpoints in parallel and return grouped sections
 * ready for the UI, plus the flat category list for filter pills.
 */
export async function fetchMappedFaqs(): Promise<{
    sections:   MappedFaqSection[];
    categories: ApiFaqCategory[];
}> {
    const [rawFaqs, categories] = await Promise.all([
        fetchFaqs(),
        fetchFaqCategories(),
    ]);

    const activeFaqs = rawFaqs
        .filter((f) => f.status === "active")
        .map(mapFaq);

    const sections = groupIntoSections(activeFaqs, categories);

    return { sections, categories };
}