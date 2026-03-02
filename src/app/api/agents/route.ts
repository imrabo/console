import { NextRequest, NextResponse } from "next/server";
import { jarvisAgents } from "@/lib/jarvis/agents";

export async function GET() {
    const items = await jarvisAgents.list();
    return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as {
        name?: "Daily Agent" | "Monitoring Agent" | "Reminder Agent" | "Research Agent";
    };

    if (!body.name) {
        return NextResponse.json({ error: "agent name is required" }, { status: 400 });
    }

    const result = await jarvisAgents.run(body.name);
    return NextResponse.json(result);
}
