"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AgentName = "Daily Agent" | "Monitoring Agent" | "Reminder Agent" | "Research Agent";

interface Agent {
    id: string;
    name: AgentName;
    schedule: string;
    status: "ACTIVE" | "PAUSED";
    lastRun?: string;
    lastLog?: string;
}

export default function AgentsPage() {
    const [items, setItems] = useState<Agent[]>([]);
    const [running, setRunning] = useState<AgentName | null>(null);

    const load = async () => {
        const res = await fetch("/api/agents");
        const data = (await res.json()) as { items: Agent[] };
        setItems(data.items);
    };

    useEffect(() => {
        load();
    }, []);

    const runAgent = async (name: AgentName) => {
        setRunning(name);
        await fetch("/api/agents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        setRunning(null);
        await load();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Automatic Agents</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Agent Status and Logs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Schedule: {item.schedule} • Status: {item.status}</p>
                                <p className="text-xs text-muted-foreground">Last run: {item.lastRun ? new Date(item.lastRun).toLocaleString() : "Never"}</p>
                                {item.lastLog ? <p className="mt-1 text-xs">{item.lastLog}</p> : null}
                            </div>
                            <Button onClick={() => runAgent(item.name)} disabled={running === item.name}>
                                {running === item.name ? "Running..." : "Run Now"}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
