export type ItemStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Goal {
    id: string;
    title: string;
    description?: string;
    deadline?: string;
    priority: Priority;
    status: ItemStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: ItemStatus;
    priority: Priority;
    createdAt: string;
    updatedAt: string;
}

export interface Decision {
    id: string;
    decision: string;
    reasoning: string;
    date: string;
}

export interface JarvisEvent {
    id: string;
    type: string;
    source: string;
    data: Record<string, unknown>;
    timestamp: string;
}

export interface Plan {
    id: string;
    title: string;
    steps: string[];
    status: ItemStatus;
    createdAt: string;
    updatedAt: string;
}

export interface MemoryItem {
    id: string;
    kind: "NOTE" | "SUMMARY" | "PLAN" | "DECISION" | "EVENT";
    content: string;
    embedding: number[];
    createdAt: string;
}

export interface ConversationItem {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export interface Report {
    id: string;
    type: "DAILY" | "WEEKLY";
    content: string;
    createdAt: string;
}

export interface Agent {
    id: string;
    name: "Daily Agent" | "Monitoring Agent" | "Reminder Agent" | "Research Agent";
    schedule: string;
    status: "ACTIVE" | "PAUSED";
    lastRun?: string;
    lastLog?: string;
}

export interface JarvisStore {
    goals: Goal[];
    tasks: Task[];
    decisions: Decision[];
    events: JarvisEvent[];
    plans: Plan[];
    memories: MemoryItem[];
    conversations: ConversationItem[];
    reports: Report[];
    agents: Agent[];
}

export interface DashboardSnapshot {
    todayPlan: string[];
    alerts: string[];
    metrics: {
        tasksPending: number;
        tasksDoneToday: number;
        goalsActive: number;
        eventsToday: number;
    };
    timeline: Array<{
        time: string;
        text: string;
    }>;
}
