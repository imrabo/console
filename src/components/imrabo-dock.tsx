"use client";

import type { ComponentType } from "react";
import { Activity, Bot, Brain, CheckSquare, Settings } from "lucide-react";

export type DockAction = "activity" | "tasks" | "memory" | "agents" | "settings";

const dockItems: Array<{ id: DockAction; icon: ComponentType<{ className?: string }>; label: string }> = [
    { id: "activity", icon: Activity, label: "Activity" },
    { id: "tasks", icon: CheckSquare, label: "Tasks" },
    { id: "memory", icon: Brain, label: "Memory" },
    { id: "agents", icon: Bot, label: "Agents" },
    { id: "settings", icon: Settings, label: "Settings" },
];

export function ImraboDock({ onAction }: { onAction: (action: DockAction) => void }) {
    return (
        <div className="fixed bottom-5 right-5 z-20 flex flex-col gap-2">
            {dockItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onAction(item.id)}
                        title={item.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-blue-100 transition hover:shadow-[0_0_16px_rgba(0,255,255,0.35)]"
                        style={{ background: "rgba(10,15,25,0.8)", borderColor: "rgba(0,255,255,0.3)" }}
                    >
                        <Icon className="h-4.5 w-4.5" />
                    </button>
                );
            })}
        </div>
    );
}
