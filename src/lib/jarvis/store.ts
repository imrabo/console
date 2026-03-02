import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { DashboardSnapshot, JarvisEvent, JarvisStore, MemoryItem, Plan, Task } from "@/lib/jarvis/types";

const STORE_PATH = path.join(process.cwd(), "jarvis-store.json");

const defaultStore: JarvisStore = {
    goals: [],
    tasks: [],
    decisions: [],
    events: [],
    plans: [],
    memories: [],
    conversations: [],
    reports: [],
    agents: [
        { id: randomUUID(), name: "Daily Agent", schedule: "0 8 * * *", status: "ACTIVE" },
        { id: randomUUID(), name: "Monitoring Agent", schedule: "*/15 * * * *", status: "ACTIVE" },
        { id: randomUUID(), name: "Reminder Agent", schedule: "*/30 * * * *", status: "ACTIVE" },
        { id: randomUUID(), name: "Research Agent", schedule: "0 */4 * * *", status: "ACTIVE" },
    ],
};

let memoryStore: JarvisStore | null = null;

const ensureStore = async (): Promise<JarvisStore> => {
    if (memoryStore) {
        return memoryStore;
    }

    try {
        const content = await fs.readFile(STORE_PATH, "utf8");
        memoryStore = JSON.parse(content) as JarvisStore;
        return memoryStore;
    } catch {
        memoryStore = structuredClone(defaultStore);
        await fs.writeFile(STORE_PATH, JSON.stringify(memoryStore, null, 2), "utf8");
        return memoryStore;
    }
};

const saveStore = async (store: JarvisStore): Promise<void> => {
    memoryStore = store;
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
};

export const jarvisStore = {
    async getStore(): Promise<JarvisStore> {
        return ensureStore();
    },

    async addTask(input: Pick<Task, "title" | "description" | "dueDate" | "priority">): Promise<Task> {
        const store = await ensureStore();
        const now = new Date().toISOString();
        const task: Task = {
            id: randomUUID(),
            title: input.title,
            description: input.description,
            dueDate: input.dueDate,
            priority: input.priority,
            status: "PENDING",
            createdAt: now,
            updatedAt: now,
        };

        store.tasks.unshift(task);
        await saveStore(store);
        return task;
    },

    async updateTask(id: string, status: Task["status"]): Promise<Task | null> {
        const store = await ensureStore();
        const task = store.tasks.find((item) => item.id === id);
        if (!task) return null;
        task.status = status;
        task.updatedAt = new Date().toISOString();
        await saveStore(store);
        return task;
    },

    async addGoal(input: { title: string; description?: string; deadline?: string; priority: "LOW" | "MEDIUM" | "HIGH" }) {
        const store = await ensureStore();
        const now = new Date().toISOString();
        const goal = {
            id: randomUUID(),
            title: input.title,
            description: input.description,
            deadline: input.deadline,
            priority: input.priority,
            status: "PENDING" as const,
            createdAt: now,
            updatedAt: now,
        };
        store.goals.unshift(goal);
        await saveStore(store);
        return goal;
    },

    async addEvent(input: Pick<JarvisEvent, "type" | "source" | "data">): Promise<JarvisEvent> {
        const store = await ensureStore();
        const event: JarvisEvent = {
            id: randomUUID(),
            type: input.type,
            source: input.source,
            data: input.data,
            timestamp: new Date().toISOString(),
        };

        store.events.unshift(event);
        await saveStore(store);
        return event;
    },

    async addPlan(title: string, steps: string[]): Promise<Plan> {
        const store = await ensureStore();
        const now = new Date().toISOString();
        const plan: Plan = {
            id: randomUUID(),
            title,
            steps,
            status: "IN_PROGRESS",
            createdAt: now,
            updatedAt: now,
        };
        store.plans.unshift(plan);
        await saveStore(store);
        return plan;
    },

    async addMemory(input: Pick<MemoryItem, "kind" | "content" | "embedding">): Promise<MemoryItem> {
        const store = await ensureStore();
        const memory: MemoryItem = {
            id: randomUUID(),
            kind: input.kind,
            content: input.content,
            embedding: input.embedding,
            createdAt: new Date().toISOString(),
        };
        store.memories.unshift(memory);
        await saveStore(store);
        return memory;
    },

    async addConversation(role: "user" | "assistant", content: string): Promise<void> {
        const store = await ensureStore();
        store.conversations.unshift({
            id: randomUUID(),
            role,
            content,
            createdAt: new Date().toISOString(),
        });
        await saveStore(store);
    },

    async updateAgentHeartbeat(name: string, log: string): Promise<void> {
        const store = await ensureStore();
        const agent = store.agents.find((item) => item.name === name);
        if (!agent) return;
        agent.lastRun = new Date().toISOString();
        agent.lastLog = log;
        await saveStore(store);
    },

    async getDashboard(): Promise<DashboardSnapshot> {
        const store = await ensureStore();
        const now = new Date();
        const today = now.toISOString().slice(0, 10);

        const tasksPending = store.tasks.filter((task) => task.status !== "DONE").length;
        const tasksDoneToday = store.tasks.filter(
            (task) => task.status === "DONE" && task.updatedAt.slice(0, 10) === today
        ).length;
        const goalsActive = store.goals.filter((goal) => goal.status !== "DONE").length;
        const eventsToday = store.events.filter((event) => event.timestamp.slice(0, 10) === today).length;

        const latestPlan = store.plans[0];

        const alerts = [
            ...store.tasks
                .filter((task) => task.status !== "DONE" && task.dueDate)
                .filter((task) => (task.dueDate as string) < new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
                .slice(0, 3)
                .map((task) => `Task due soon: ${task.title}`),
            ...store.events.slice(0, 2).map((event) => `Event received: ${event.type}`),
        ].slice(0, 5);

        const timeline = [
            ...store.events.slice(0, 5).map((event) => ({
                time: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: `${event.type} from ${event.source}`,
            })),
            ...store.plans.slice(0, 2).map((plan) => ({
                time: new Date(plan.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: `Plan created: ${plan.title}`,
            })),
        ]
            .sort((a, b) => (a.time > b.time ? -1 : 1))
            .slice(0, 8);

        return {
            todayPlan: latestPlan?.steps ?? ["No daily plan yet. Run Daily Agent from Agents page."],
            alerts,
            metrics: {
                tasksPending,
                tasksDoneToday,
                goalsActive,
                eventsToday,
            },
            timeline,
        };
    },
};
