"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Goal {
    id: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "DONE";
}

export default function GoalsPage() {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Goal["priority"]>("MEDIUM");
    const [items, setItems] = useState<Goal[]>([]);

    const load = async () => {
        const res = await fetch("/api/goals");
        const data = (await res.json()) as { items: Goal[] };
        setItems(data.items);
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim()) return;

        await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, priority }),
        });

        setTitle("");
        await load();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Goals</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Create Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-3 md:flex-row">
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Goal["priority"])}
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
                    <CardTitle>Active Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                            <p className="text-sm font-medium">{item.title}</p>
                            <div className="flex gap-2">
                                <Badge variant="outline">{item.priority}</Badge>
                                <Badge variant="secondary">{item.status}</Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
