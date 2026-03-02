"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MemoryItem {
    id: string;
    kind: string;
    content: string;
    createdAt: string;
}

export default function MemoryPage() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<MemoryItem[]>([]);

    const load = async (q = "") => {
        const res = await fetch(`/api/memory${q ? `?q=${encodeURIComponent(q)}` : ""}`);
        const data = (await res.json()) as { items: MemoryItem[] };
        setItems(data.items);
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await load(query);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Memory</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Search Memory</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex gap-3">
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes, plans, decisions..." />
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Stored Memory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.length ? (
                        items.map((item) => (
                            <div key={item.id} className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground">{item.kind} • {new Date(item.createdAt).toLocaleString()}</p>
                                <p className="mt-1 text-sm">{item.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No memory found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
