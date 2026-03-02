import { NextResponse } from "next/server";
import { jarvisStore } from "@/lib/jarvis/store";

export async function GET() {
    const dashboard = await jarvisStore.getDashboard();
    return NextResponse.json(dashboard);
}
