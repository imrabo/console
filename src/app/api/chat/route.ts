import { NextRequest, NextResponse } from "next/server";
import { jarvisBrain } from "@/lib/jarvis/brain";

export async function POST(req: NextRequest) {
    const body = (await req.json()) as { message?: string };
    const message = body.message?.trim();

    if (!message) {
        return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const result = await jarvisBrain.chat(message);
    return NextResponse.json(result);
}
