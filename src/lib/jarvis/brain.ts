import { aiProvider } from "@/lib/jarvis/ai";
import { jarvisStore } from "@/lib/jarvis/store";

export const jarvisBrain = {
    async chat(message: string): Promise<{ reply: string }> {
        const store = await jarvisStore.getStore();
        const context = [
            `Goals: ${store.goals.slice(0, 3).map((item) => item.title).join(", ") || "none"}`,
            `Pending tasks: ${store.tasks.filter((item) => item.status !== "DONE").length}`,
            `Recent events: ${store.events.slice(0, 3).map((item) => item.type).join(", ") || "none"}`,
        ].join(" | ");

        await jarvisStore.addConversation("user", message);
        const reply = await aiProvider.generateResponse({ message, context });
        await jarvisStore.addConversation("assistant", reply);

        const shouldStore = message.length > 24 && !/^(hi|hello|thanks|ok)$/i.test(message.trim());
        if (shouldStore) {
            const embedding = await aiProvider.embedText({ text: message });
            await jarvisStore.addMemory({ kind: "NOTE", content: message, embedding });
        }

        return { reply };
    },

    async createDailyPlan(): Promise<{ title: string; steps: string[] }> {
        const store = await jarvisStore.getStore();
        const topGoal = store.goals.find((item) => item.status !== "DONE")?.title || "Improve core system outcomes";
        const steps = await aiProvider.planTasks({ objective: topGoal });
        const title = `Daily Plan - ${new Date().toLocaleDateString()}`;
        await jarvisStore.addPlan(title, steps);
        await jarvisStore.updateAgentHeartbeat("Daily Agent", "Generated daily priorities and plan.");

        const summary = await aiProvider.summarize({ text: steps.join(". ") });
        const embedding = await aiProvider.embedText({ text: summary });
        await jarvisStore.addMemory({ kind: "PLAN", content: summary, embedding });

        return { title, steps };
    },
};
