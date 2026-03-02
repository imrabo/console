"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import { ResponsiveGridLayout } from "react-grid-layout";
import { Bell, Calendar, CheckSquare, CircleAlert, Database, LayoutGrid, Mic, MicOff, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PanelId = "plan" | "alerts" | "metrics" | "situation" | "timeline" | "agents" | "tasks" | "calendar" | "dialog";

interface DashboardData {
    todayPlan: string[];
    alerts: string[];
    metrics: {
        tasksPending: number;
        tasksDoneToday: number;
        goalsActive: number;
        eventsToday: number;
    };
    timeline: Array<{ time: string; text: string }>;
}

interface Agent {
    id: string;
    name: "Daily Agent" | "Monitoring Agent" | "Reminder Agent" | "Research Agent";
    schedule: string;
    status: "ACTIVE" | "PAUSED";
    lastRun?: string;
    lastLog?: string;
}

interface Task {
    id: string;
    title: string;
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
}

interface ConsoleMessage {
    id: string;
    role: "user" | "jarvis";
    text: string;
}

const defaultPanels: Record<PanelId, boolean> = {
    plan: true,
    alerts: true,
    metrics: true,
    situation: true,
    timeline: true,
    agents: true,
    tasks: false,
    calendar: false,
    dialog: false,
};

const defaultLayout = [
    { i: "situation", x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
    { i: "timeline", x: 0, y: 0, w: 3, h: 6, minW: 3, minH: 4 },
    { i: "plan", x: 8, y: 3, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "alerts", x: 8, y: 7, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "metrics", x: 3, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "agents", x: 4, y: 3, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "tasks", x: 3, y: 7, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "calendar", x: 0, y: 6, w: 3, h: 4, minW: 3, minH: 2 },
    { i: "dialog", x: 7, y: 10, w: 5, h: 3, minW: 3, minH: 2 },
];

const defaultLayouts = {
    lg: defaultLayout,
    md: defaultLayout,
    sm: defaultLayout,
    xs: defaultLayout,
    xxs: defaultLayout,
};

const minimalMenu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/memory", label: "Memory", icon: Database },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/agents", label: "Settings", icon: Settings2 },
];

export function JarvisControlCenter() {
    const mapRef = useRef<MapLibreMap | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const latestAgentSignature = useRef<string>("");

    const [panels, setPanels] = useState(defaultPanels);
    const [layouts, setLayouts] = useState(defaultLayouts);
    const [gridWidth, setGridWidth] = useState(1400);
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [consoleInput, setConsoleInput] = useState("");
    const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
    const [timeText, setTimeText] = useState("");
    const [listening, setListening] = useState(false);
    const [dialogText, setDialogText] = useState("Waiting for command...");
    const [dialogTitle, setDialogTitle] = useState("Jarvis Dialog");
    const [activeFiles, setActiveFiles] = useState<string[]>([]);
    const [location, setLocation] = useState({
        lat: 18.5204,
        lng: 73.8567,
        accuracy: 0,
        label: "Pune",
    });

    const agentsRunning = useMemo(() => agents.filter((agent) => agent.status === "ACTIVE").length, [agents]);

    function openPanel(id: PanelId) {
        setPanels((prev) => ({ ...prev, [id]: true }));
    }

    function closePanel(id: PanelId) {
        setPanels((prev) => ({ ...prev, [id]: false }));
    }

    function openDialogPanel(title: string, text: string) {
        setDialogTitle(title);
        setDialogText(text);
        openPanel("dialog");
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }, 1000);

        setTimeText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const [dashboardRes, agentsRes, tasksRes] = await Promise.all([
                fetch("/api/dashboard"),
                fetch("/api/agents"),
                fetch("/api/tasks"),
            ]);

            const dashboardData = (await dashboardRes.json()) as DashboardData;
            const agentsData = (await agentsRes.json()) as { items: Agent[] };
            const tasksData = (await tasksRes.json()) as { items: Task[] };

            setDashboard(dashboardData);
            setAgents(agentsData.items);
            setTasks(tasksData.items.slice(0, 5));

            const signature = agentsData.items
                .map((item) => `${item.name}:${item.lastRun ?? "none"}:${item.lastLog ?? ""}`)
                .join("|");

            if (latestAgentSignature.current && signature !== latestAgentSignature.current) {
                const research = agentsData.items.find((item) => item.name === "Research Agent" && item.lastRun);
                if (research?.lastLog) {
                    openDialogPanel("Research Completed", research.lastLog);
                }
            }

            latestAgentSignature.current = signature;
        };

        loadData();
        const poll = setInterval(loadData, 7000);
        return () => clearInterval(poll);
    }, []);

    useEffect(() => {
        const updateWidth = () => {
            setGridWidth(Math.max(900, window.innerWidth - 32));
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [location.lng, location.lat],
            zoom: 11,
            pitch: 40,
            bearing: -10,
            attributionControl: false,
        });

        map.on("load", () => {
            map.addSource("jarvis-accuracy", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: { accuracy: location.accuracy || 40 },
                            geometry: {
                                type: "Point",
                                coordinates: [location.lng, location.lat],
                            },
                        },
                    ],
                },
            });

            map.addLayer({
                id: "jarvis-accuracy-circle",
                type: "circle",
                source: "jarvis-accuracy",
                paint: {
                    "circle-color": "#22d3ee",
                    "circle-opacity": 0.16,
                    "circle-stroke-color": "#86efac",
                    "circle-stroke-width": 1,
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 8, 12, ["/", ["get", "accuracy"], 2], 16, ["get", "accuracy"]],
                },
            });
        });

        markerRef.current = new maplibregl.Marker({ color: "#34d399" }).setLngLat([location.lng, location.lat]).addTo(map);
        mapRef.current = map;

        return () => {
            markerRef.current?.remove();
            map.remove();
            mapRef.current = null;
        };
    }, [location.lat, location.lng, location.accuracy]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: Math.max(30, Math.round(position.coords.accuracy)),
                    label: "Live",
                });
            },
            () => undefined,
            { enableHighAccuracy: true }
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: Math.max(30, Math.round(position.coords.accuracy)),
                    label: "Live",
                });
            },
            () => undefined,
            { enableHighAccuracy: true, maximumAge: 5000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        markerRef.current?.setLngLat([location.lng, location.lat]);
        const source = mapRef.current.getSource("jarvis-accuracy") as maplibregl.GeoJSONSource | undefined;
        if (source) {
            source.setData({
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: { accuracy: location.accuracy || 40 },
                        geometry: {
                            type: "Point",
                            coordinates: [location.lng, location.lat],
                        },
                    },
                ],
            });
        }

        mapRef.current.easeTo({ center: [location.lng, location.lat], duration: 1200, essential: true });
    }, [location]);

    const speak = (text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const appendConsole = (role: ConsoleMessage["role"], text: string) => {
        setConsoleMessages((prev) => [...prev.slice(-11), { id: crypto.randomUUID(), role, text }]);
    };

    const handleCommand = async (rawInput: string, fromVoice = false) => {
        const text = rawInput.trim();
        if (!text) return;

        appendConsole("user", text);
        const lower = text.toLowerCase();

        if (lower.includes("show tasks")) {
            openPanel("tasks");
            const reply = "Tasks panel opened.";
            appendConsole("jarvis", reply);
            openDialogPanel("Tasks Panel", "Showing task status and priorities for today.");
            if (fromVoice) speak(reply);
            return;
        }

        if (lower.includes("what should i do") || lower.includes("today plan") || lower.includes("show plan")) {
            openPanel("plan");
            const reply = "Today plan panel opened.";
            appendConsole("jarvis", reply);
            openDialogPanel("Today Plan", "Panel opened with your generated priority steps.");
            if (fromVoice) speak(reply);
            return;
        }

        if (lower.includes("show calendar")) {
            openPanel("calendar");
            const reply = "Calendar panel opened.";
            appendConsole("jarvis", reply);
            openDialogPanel("Calendar", "Calendar overlay is now visible.");
            if (fromVoice) speak(reply);
            return;
        }

        if (lower.includes("show alerts")) {
            openPanel("alerts");
            const reply = "Alerts panel opened.";
            appendConsole("jarvis", reply);
            openDialogPanel("Alerts", "Showing current generated alerts.");
            if (fromVoice) speak(reply);
            return;
        }

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });
        const data = (await response.json()) as { reply?: string };
        const reply = data.reply ?? "Command acknowledged.";
        appendConsole("jarvis", reply);
        openDialogPanel("Jarvis Response", reply);
        if (fromVoice) speak(reply);
    };

    const startVoiceCommand = () => {
        const Recognition =
            typeof window !== "undefined"
                ? ((window as Window & { webkitSpeechRecognition?: any; SpeechRecognition?: any }).SpeechRecognition ||
                    (window as Window & { webkitSpeechRecognition?: any; SpeechRecognition?: any }).webkitSpeechRecognition)
                : undefined;

        if (!Recognition) {
            const fallback = "Speech recognition is not supported in this browser.";
            appendConsole("jarvis", fallback);
            openDialogPanel("Voice Unavailable", fallback);
            return;
        }

        const recognition = new Recognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        setListening(true);

        recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
            const transcript = event.results[0]?.[0]?.transcript ?? "";
            void handleCommand(transcript, true);
        };

        recognition.onerror = () => {
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    const submitConsole = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = consoleInput.trim();
        if (!text) return;
        setConsoleInput("");
        await handleCommand(text);
    };

    const panelKeys = (Object.entries(panels)
        .filter(([, isOpen]) => isOpen)
        .map(([id]) => id)) as PanelId[];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background text-foreground">
            <div ref={mapContainerRef} className="absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),rgba(2,6,23,0.72)_55%,rgba(2,6,23,0.9)_100%)]" />

            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md">
                {minimalMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="absolute left-0 right-0 top-0 z-20 border-b border-white/10 bg-black/35 px-5 py-3 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between text-xs text-emerald-100">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold tracking-wide">Jarvis Online</span>
                        <Badge variant="outline" className="border-emerald-300/40 text-emerald-100">
                            Location: {location.label}
                        </Badge>
                        <Badge variant="outline" className="border-blue-300/40 text-blue-100">
                            Agents: {agentsRunning} Running
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>{timeText}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-200">
                            {listening ? <Mic className="h-4 w-4 animate-pulse" /> : <MicOff className="h-4 w-4" />}
                            {listening ? "Listening" : "Voice Ready"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 top-14 bottom-28 z-10 px-4 pb-4">
                <ResponsiveGridLayout
                    className="layout"
                    width={gridWidth}
                    layouts={layouts}
                    rowHeight={52}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    margin={[12, 12]}
                    dragConfig={{ enabled: true, bounded: false, handle: ".jarvis-panel-handle", threshold: 3 }}
                    resizeConfig={{ enabled: true, handles: ["se"] }}
                    onLayoutChange={(layout) => setLayouts((prev) => ({ ...prev, lg: layout as typeof defaultLayout }))}
                >
                    {panelKeys.map((panelId) => (
                        <div key={panelId} className="pointer-events-auto">
                            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                <PanelCard title={panelTitle(panelId)} onClose={() => closePanel(panelId)}>
                                    {renderPanelContent(panelId, {
                                        dashboard,
                                        agents,
                                        tasks,
                                        dialogText,
                                        dialogTitle,
                                    })}
                                </PanelCard>
                            </motion.div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            <div className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={startVoiceCommand}
                    className={cn(
                        "relative h-14 w-14 rounded-full border border-emerald-300/40 bg-black/50 text-emerald-100 shadow-lg backdrop-blur-md",
                        listening && "animate-pulse"
                    )}
                    aria-label="Start voice command"
                >
                    <Mic className="mx-auto h-6 w-6" />
                    {listening && <span className="absolute inset-0 rounded-full border border-emerald-300/40" />}
                </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-emerald-300/20 bg-black/65 px-4 py-3 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3">
                    <div className="max-h-28 overflow-auto rounded-md border border-emerald-300/20 bg-black/45 px-3 py-2 text-xs text-emerald-100">
                        {consoleMessages.length === 0 ? (
                            <p>&gt; Jarvis console ready. Try: “Show tasks for today”</p>
                        ) : (
                            consoleMessages.map((message) => (
                                <p key={message.id} className="mb-1">
                                    <span className="text-emerald-300">{message.role === "user" ? ">" : "jarvis>"}</span> {message.text}
                                </p>
                            ))
                        )}
                    </div>

                    <form className="flex flex-wrap items-center gap-2" onSubmit={submitConsole}>
                        <Input
                            value={consoleInput}
                            onChange={(event) => setConsoleInput(event.target.value)}
                            placeholder="Type command: What should I do today?"
                            className="h-10 flex-1 border-emerald-300/30 bg-black/40 text-emerald-100 placeholder:text-emerald-300/60"
                        />
                        <label className="rounded-md border border-emerald-300/30 px-3 py-2 text-xs text-emerald-100">
                            File
                            <input
                                type="file"
                                className="hidden"
                                onChange={(event) => {
                                    const names = Array.from(event.target.files ?? []).map((file) => file.name);
                                    setActiveFiles(names);
                                }}
                            />
                        </label>
                        <Button type="submit" className="h-10">
                            Execute
                        </Button>
                    </form>

                    {activeFiles.length > 0 && (
                        <p className="text-xs text-emerald-200">Attached: {activeFiles.join(", ")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PanelCard({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <Card className="h-full border-blue-300/30 bg-black/50 text-emerald-50 backdrop-blur-md">
            <CardHeader className="jarvis-panel-handle flex cursor-move flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm tracking-wide text-blue-100">{title}</CardTitle>
                <Button variant="ghost" size="icon-xs" onClick={onClose} className="text-emerald-100 hover:bg-white/10">
                    ×
                </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-xs leading-5 text-emerald-100">{children}</CardContent>
        </Card>
    );
}

function panelTitle(id: PanelId): string {
    const titleMap: Record<PanelId, string> = {
        plan: "Today Plan",
        alerts: "Alerts",
        metrics: "Metrics Overlay",
        situation: "Situation Awareness",
        timeline: "Activity Timeline",
        agents: "Agent Visualization",
        tasks: "Tasks Panel",
        calendar: "Calendar Panel",
        dialog: "AI Dialog",
    };

    return titleMap[id];
}

function renderPanelContent(
    id: PanelId,
    data: {
        dashboard: DashboardData | null;
        agents: Agent[];
        tasks: Task[];
        dialogText: string;
        dialogTitle: string;
    }
) {
    const { dashboard, agents, tasks, dialogText, dialogTitle } = data;

    if (id === "plan") {
        return (
            <div>
                {(dashboard?.todayPlan ?? ["No daily plan yet."]).map((item, index) => (
                    <p key={`${item}-${index}`}>• {item}</p>
                ))}
            </div>
        );
    }

    if (id === "alerts") {
        return (
            <div className="space-y-1">
                {(dashboard?.alerts ?? ["No active alerts"]).map((item, index) => (
                    <p key={`${item}-${index}`} className="inline-flex items-center gap-1">
                        <CircleAlert className="h-3.5 w-3.5 text-amber-300" /> {item}
                    </p>
                ))}
            </div>
        );
    }

    if (id === "metrics") {
        return (
            <div className="grid grid-cols-2 gap-2">
                <Metric label="Leads Today" value={dashboard?.metrics.eventsToday ?? 0} />
                <Metric label="Customers" value={dashboard?.metrics.goalsActive ?? 0} />
                <Metric label="Revenue" value={dashboard?.metrics.tasksDoneToday ?? 0} />
                <Metric label="Pending" value={dashboard?.metrics.tasksPending ?? 0} />
            </div>
        );
    }

    if (id === "situation") {
        return (
            <div className="space-y-1">
                <p>Tasks Pending: {dashboard?.metrics.tasksPending ?? 0}</p>
                <p>Agents Running: {agents.filter((agent) => agent.status === "ACTIVE").length}</p>
                <p>Alerts: {(dashboard?.alerts ?? []).length}</p>
            </div>
        );
    }

    if (id === "timeline") {
        return (
            <div className="space-y-1">
                {(dashboard?.timeline ?? [{ time: "--:--", text: "No timeline activity" }]).map((item, index) => (
                    <p key={`${item.time}-${index}`}>{item.time} {item.text}</p>
                ))}
            </div>
        );
    }

    if (id === "agents") {
        return (
            <div className="space-y-2">
                {agents.length === 0 ? (
                    <p>No agents active.</p>
                ) : (
                    agents.map((agent) => (
                        <div key={agent.id} className="rounded border border-blue-300/20 p-2">
                            <p className="font-medium">{agent.name}</p>
                            <p>Status: {agent.status}</p>
                            <p className="inline-flex items-center gap-1 text-blue-100">
                                <Bell className={cn("h-3.5 w-3.5", agent.status === "ACTIVE" && "animate-pulse")} />
                                {agent.lastLog ?? "Running monitor loop"}
                            </p>
                        </div>
                    ))
                )}
            </div>
        );
    }

    if (id === "tasks") {
        return (
            <div className="space-y-1">
                {tasks.length === 0 ? (
                    <p>No tasks yet.</p>
                ) : (
                    tasks.map((task) => (
                        <p key={task.id}>• {task.title} ({task.status})</p>
                    ))
                )}
            </div>
        );
    }

    if (id === "calendar") {
        return (
            <div className="space-y-1">
                <p className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Day / Week / Month</p>
                <p>Calendar panel ready for task and meeting overlays.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <p className="font-semibold text-blue-100">{dialogTitle}</p>
            <p>{dialogText}</p>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded border border-blue-300/30 bg-black/35 p-2">
            <p className="text-[10px] uppercase tracking-wide text-blue-200">{label}</p>
            <p className="text-sm font-semibold text-emerald-100">{value}</p>
        </div>
    );
}
