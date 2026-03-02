import { jarvisStore } from "@/lib/jarvis/store";
import { jarvisBrain } from "@/lib/jarvis/brain";

export const jarvisAgents = {
    async list() {
        const store = await jarvisStore.getStore();
        return store.agents;
    },

    async run(agentName: "Daily Agent" | "Monitoring Agent" | "Reminder Agent" | "Research Agent") {
        if (agentName === "Daily Agent") {
            const plan = await jarvisBrain.createDailyPlan();
            return { ok: true, log: `Created plan: ${plan.title}` };
        }

        await jarvisStore.updateAgentHeartbeat(agentName, `${agentName} checked current state.`);
        return { ok: true, log: `${agentName} executed successfully.` };
    },
};
