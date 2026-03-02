import { env } from "@/lib/config/env";

export interface AiProvider {
    generateResponse(input: { message: string; context?: string }): Promise<string>;
    planTasks(input: { objective: string }): Promise<string[]>;
    summarize(input: { text: string }): Promise<string>;
    generateInsights(input: { metrics: Record<string, number> }): Promise<string[]>;
    embedText(input: { text: string }): Promise<number[]>;
}

class LocalProvider implements AiProvider {
    async generateResponse(input: { message: string; context?: string }): Promise<string> {
        if (input.message.toLowerCase().includes("focus") || input.message.toLowerCase().includes("today")) {
            return "Focus on the top-priority goal, close one pending task before noon, and schedule one measurable outreach action today.";
        }

        return `Jarvis analysis: ${input.message}${input.context ? ` | Context: ${input.context}` : ""}`;
    }

    async planTasks(input: { objective: string }): Promise<string[]> {
        return [
            `Define measurable outcome for: ${input.objective}`,
            "Break objective into 3 weekly milestones",
            "Assign deadlines and priority",
            "Track daily progress and adjust blockers",
        ];
    }

    async summarize(input: { text: string }): Promise<string> {
        return input.text.slice(0, 240);
    }

    async generateInsights(input: { metrics: Record<string, number> }): Promise<string[]> {
        const entries = Object.entries(input.metrics);
        if (!entries.length) {
            return ["No metrics received."];
        }

        return entries.map(([key, value]) => `${key}: ${value}`);
    }

    async embedText(input: { text: string }): Promise<number[]> {
        const bytes = input.text
            .slice(0, 24)
            .split("")
            .map((char) => char.charCodeAt(0));

        return bytes.map((value) => value / 255);
    }
}

class OpenAiLikeProvider extends LocalProvider {
    private endpoint = process.env.AI_API_BASE_URL;
    private apiKey = process.env.AI_API_KEY;

    async generateResponse(input: { message: string; context?: string }): Promise<string> {
        if (!this.endpoint || !this.apiKey) {
            return super.generateResponse(input);
        }

        const response = await fetch(`${this.endpoint}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL ?? "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are Jarvis, an execution-focused AI strategist." },
                    { role: "user", content: `${input.message}\n\nContext: ${input.context ?? "none"}` },
                ],
            }),
        });

        if (!response.ok) {
            return super.generateResponse(input);
        }

        const json = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
        };

        return json.choices?.[0]?.message?.content?.trim() || super.generateResponse(input);
    }
}

export const aiProvider: AiProvider = env.AI_PROVIDER === "openai" ? new OpenAiLikeProvider() : new LocalProvider();
