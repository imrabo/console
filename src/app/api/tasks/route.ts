import { NextRequest, NextResponse } from "next/server";
import { jarvisStore } from "@/lib/jarvis/store";
import { Priority, Task } from "@/lib/jarvis/types";

const validPriorities = new Set<Priority>(["LOW", "MEDIUM", "HIGH"]);

export async function GET() {
    const store = await jarvisStore.getStore();
    return NextResponse.json({ items: store.tasks });
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as {
        title?: string;
        description?: string;
        dueDate?: string;
        priority?: Priority;
        id?: string;
        status?: Task["status"];
        mode?: "create" | "status";
    };

    if (body.mode === "status") {
        if (!body.id || !body.status) {
            return NextResponse.json({ error: "id and status are required for status updates" }, { status: 400 });
        }

        const updated = await jarvisStore.updateTask(body.id, body.status);
        if (!updated) {
            return NextResponse.json({ error: "task not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    }

    const title = body.title?.trim();
    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const priority = body.priority && validPriorities.has(body.priority) ? body.priority : "MEDIUM";

    const task = await jarvisStore.addTask({
        title,
        description: body.description,
        dueDate: body.dueDate,
        priority,
    });

    return NextResponse.json(task, { status: 201 });
}
