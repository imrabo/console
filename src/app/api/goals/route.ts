import { NextRequest, NextResponse } from "next/server";
import { jarvisStore } from "@/lib/jarvis/store";
import { Priority } from "@/lib/jarvis/types";

const validPriorities = new Set<Priority>(["LOW", "MEDIUM", "HIGH"]);

export async function GET() {
    const store = await jarvisStore.getStore();
    return NextResponse.json({ items: store.goals });
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as {
        title?: string;
        description?: string;
        deadline?: string;
        priority?: Priority;
    };

    const title = body.title?.trim();
    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const priority = body.priority && validPriorities.has(body.priority) ? body.priority : "MEDIUM";
    const goal = await jarvisStore.addGoal({
        title,
        description: body.description,
        deadline: body.deadline,
        priority,
    });

    return NextResponse.json(goal, { status: 201 });
}
