import { NextRequest, NextResponse } from "next/server";
import { aiProvider } from "@/lib/jarvis/ai";
import { jarvisStore } from "@/lib/jarvis/store";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim();
    const store = await jarvisStore.getStore();
    const memories = q
        ? store.memories.filter((item) => item.content.toLowerCase().includes(q))
        : store.memories;

    return NextResponse.json({ items: memories.slice(0, 50) });
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as { kind?: "NOTE" | "SUMMARY" | "PLAN" | "DECISION" | "EVENT"; content?: string };
    const content = body.content?.trim();

    if (!content) {
        return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const embedding = await aiProvider.embedText({ text: content });
    const memory = await jarvisStore.addMemory({ kind: body.kind ?? "NOTE", content, embedding });

    return NextResponse.json(memory, { status: 201 });
}
