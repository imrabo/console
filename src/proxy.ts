import { NextRequest, NextResponse } from "next/server";
import { edgeLogger, getOrCreateRequestId, REQUEST_ID_HEADER } from "@/lib/request-logger";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const requestId = getOrCreateRequestId(req.headers);

    const buildRequestHeaders = () => {
        const headers = new Headers(req.headers);
        headers.set(REQUEST_ID_HEADER, requestId);
        return headers;
    };

    const setResponseTraceHeader = (res: NextResponse): NextResponse => {
        res.headers.set(REQUEST_ID_HEADER, requestId);
        return res;
    };

    edgeLogger.info("request_received", {
        requestId,
        method: req.method,
        pathname,
    });

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/images")
    ) {
        return setResponseTraceHeader(
            NextResponse.next({
                request: {
                    headers: buildRequestHeaders(),
                },
            })
        );
    }

    return setResponseTraceHeader(
        NextResponse.next({
            request: {
                headers: buildRequestHeaders(),
            },
        })
    );
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

