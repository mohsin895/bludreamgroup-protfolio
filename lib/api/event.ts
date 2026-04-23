// ─── Base URL ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

export interface ApiEventCategory {
    id: number;
    title: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface ApiEvent {
    id: number;
    event_category_id: number;
    title: string;
    description: string; // HTML from rich-text editor
    event_date: string;  // "YYYY-MM-DD"
    start_time: string;  // "HH:MM:SS"
    end_time: string;    // "HH:MM:SS"
    location: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

// ─── Mapped / UI shape ─────────────────────────────────────────────────────────

export type EventStatus = "upcoming" | "past" | "soldout";
export type EventType   = "reading" | "workshop" | "signing" | "festival" | "talk";

export interface MappedEvent {
    id: number;
    status: EventStatus;
    type: EventType;
    title: string;
    venue: string;
    city: string;
    address: string;
    date: string;         // "April 22, 2026"
    day: string;          // "22"
    month: string;        // "APR"
    year: string;         // "2026"
    time: string;         // "2:03 PM – 4:04 PM"
    description: string;  // plain text (HTML stripped)
    categoryTitle: string;
    isFeatured?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_ABBR = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC",
];

function parseDate(dateStr: string) {
    const [year, mo, day] = dateStr.split("-");
    const monthIndex = parseInt(mo, 10) - 1;
    const dateObj = new Date(dateStr + "T00:00:00"); // avoid TZ off-by-one
    return {
        day: day.padStart(2, "0"),
        month: MONTH_ABBR[monthIndex] ?? mo,
        year,
        dateLabel: dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    };
}

function formatTime(timeStr: string): string {
    const [hh, mm] = timeStr.split(":").map(Number);
    const period = hh >= 12 ? "PM" : "AM";
    const hour   = hh % 12 || 12;
    return `${hour}:${String(mm).padStart(2, "0")} ${period}`;
}

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g,  "<")
        .replace(/&gt;/g,  ">")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function deriveStatus(eventDate: string): EventStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(eventDate + "T00:00:00");
    return date >= today ? "upcoming" : "past";
}

function categoryToType(title: string): EventType {
    const map: Record<string, EventType> = {
        reading:          "reading",
        workshop:         "workshop",
        signing:          "signing",
        festival:         "festival",
        talk:             "talk",
        "talk / keynote": "talk",
    };
    return map[title.toLowerCase()] ?? "talk";
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

export function mapEvent(
    raw: ApiEvent,
    categories: ApiEventCategory[]
): MappedEvent {
    const category      = categories.find((c) => c.id === raw.event_category_id);
    const categoryTitle = category?.title ?? "Unknown";
    const { day, month, year, dateLabel } = parseDate(raw.event_date);

    return {
        id:            raw.id,
        status:        deriveStatus(raw.event_date),
        type:          categoryToType(categoryTitle),
        title:         raw.title,
        venue:         raw.location,
        city:          raw.location,
        address:       raw.location,
        date:          dateLabel,
        day,
        month,
        year,
        time:          `${formatTime(raw.start_time)} – ${formatTime(raw.end_time)}`,
        description:   stripHtml(raw.description),
        categoryTitle,
        isFeatured:    false,
    };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchEventCategories(): Promise<ApiEventCategory[]> {
    const res = await fetch(`${API_BASE}/event/category`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Event categories fetch failed: ${res.status}`);
    const json: ApiResponse<ApiEventCategory[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Event categories error.");
    return json.data;
}

export async function fetchEvents(): Promise<ApiEvent[]> {
    const res = await fetch(`${API_BASE}/event`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
    const json: ApiResponse<ApiEvent[]> = await res.json();
    if (!json.status) throw new Error(json.message ?? "Events error.");
    return json.data;
}

/**
 * Fetch both endpoints in parallel, map to UI shape, sort, and flag featured.
 */
export async function fetchMappedEvents(): Promise<MappedEvent[]> {
    const [rawEvents, categories] = await Promise.all([
        fetchEvents(),
        fetchEventCategories(),
    ]);

    // Only show active events
    const active = rawEvents.filter((e) => e.status === "active");

    const mapped = active.map((e) => mapEvent(e, categories));

    // Upcoming first → ascending date; past events → descending date
    mapped.sort((a, b) => {
        const aIsPast = a.status === "past";
        const bIsPast = b.status === "past";
        if (!aIsPast && bIsPast) return -1;
        if (aIsPast && !bIsPast) return  1;
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return aIsPast ? -diff : diff;
    });

    // Auto-feature the earliest upcoming event
    const firstUpcoming = mapped.find((e) => e.status === "upcoming");
    if (firstUpcoming) firstUpcoming.isFeatured = true;

    return mapped;
}