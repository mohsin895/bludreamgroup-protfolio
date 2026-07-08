import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const host = request.headers.get("host") || "";

    if (host.startsWith("www.")) {
        url.hostname = host.replace(/^www\./, "");
        url.protocol = "https:";
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};