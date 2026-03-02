import { NextRequest, NextResponse } from "next/server";
import { aiProvider } from "@/lib/jarvis/ai";
import { jarvisStore } from "@/lib/jarvis/store";

export async function POST(req: NextRequest) {
    const body = (await req.json()) as {
        type?: string;
        source?: string;
        data?: Record<string, unknown>;
    };

    const type = body.type?.trim();
    const source = body.source?.trim();

    if (!type || !source) {
        return NextResponse.json({ error: "type and source are required" }, { status: 400 });
    }

    const event = await jarvisStore.addEvent({
        type,
        source,
        data: body.data ?? {},
    });

    const summary = await aiProvider.summarize({ text: `${event.type} from ${event.source}` });
    const embedding = await aiProvider.embedText({ text: summary });
    await jarvisStore.addMemory({ kind: "EVENT", content: summary, embedding });

    return NextResponse.json(event, { status: 201 });
}
