"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = message.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setMessage("");
        setLoading(true);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });

        const data = (await res.json()) as { reply: string };
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Jarvis Chat</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Brain Interface</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3 rounded-md border p-4">
                        {messages.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Try: What should I focus on today?</p>
                        ) : (
                            messages.map((item, index) => (
                                <div key={`${item.role}-${index}`} className="text-sm">
                                    <span className="font-medium">{item.role === "user" ? "You" : "Jarvis"}:</span> {item.content}
                                </div>
                            ))
                        )}
                    </div>

                    <form className="space-y-3" onSubmit={submit}>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask Jarvis for plans, insights, or decisions..."
                        />
                        <Button type="submit" disabled={loading}>{loading ? "Thinking..." : "Send"}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
