"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Task {
    id: string;
    title: string;
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
}

export default function TasksPage() {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
    const [items, setItems] = useState<Task[]>([]);

    const load = async () => {
        const res = await fetch("/api/tasks");
        const data = (await res.json()) as { items: Task[] };
        setItems(data.items);
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim()) return;

        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, priority }),
        });

        setTitle("");
        await load();
    };

    const markDone = async (id: string) => {
        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "status", id, status: "DONE" }),
        });
        await load();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Create Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-3 md:flex-row">
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Task["priority"])}
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                        </select>
                        <Button type="submit">Add</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Live Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <div className="mt-1 flex gap-2">
                                    <Badge variant="outline">{item.priority}</Badge>
                                    <Badge variant={item.status === "DONE" ? "default" : "secondary"}>{item.status}</Badge>
                                </div>
                            </div>
                            {item.status !== "DONE" && (
                                <Button variant="outline" onClick={() => markDone(item.id)}>Mark Done</Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
