"use client";

import { useEffect, useMemo, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { ImraboMap, ImraboMapPointDetail } from "@/components/imrabo-map";
import { ImraboPanel } from "@/components/imrabo-panel";
import { ImraboConsole } from "@/components/imrabo-console";
import { ImraboDock } from "@/components/imrabo-dock";
import { ImraboScope, ImraboScopeMode } from "@/components/imrabo-scope";

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
    status: "ACTIVE" | "PAUSED";
    lastLog?: string;
}

interface Task {
    id: string;
    title: string;
    status: "PENDING" | "IN_PROGRESS" | "DONE";
}

interface MemoryItem {
    id: string;
    content: string;
    kind: string;
}

interface LogItem {
    time: string;
    text: string;
}

interface PublicIntel {
    weather: {
        temperature: number;
        humidity: number;
        wind: number;
        rainChance: number;
        sunrise: string;
        sunset: string;
    };
    aqi: {
        value: number;
        label: string;
    };
    traffic: {
        status: string;
        source: string;
    };
    earthquakes: Array<{ magnitude: number; place: string; lat: number; lng: number }>;
    flights: Array<{ callsign: string; lat: number; lng: number; altitude: number }>;
    iss: { lat: number; lng: number; visibility: string };
    nearbyPlaces: Array<{ lat: number; lng: number; name: string; category: string }>;
    events: Array<{ name: string; date: string }>;
    news: Array<{ title: string; url: string }>;
}

export default function ImraboPage() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [memory, setMemory] = useState<MemoryItem[]>([]);
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [timeText, setTimeText] = useState("");
    const [listening, setListening] = useState(false);
    const [followMode, setFollowMode] = useState(false);
    const [activePanel, setActivePanel] = useState<"activity" | "tasks" | "memory" | "agents" | "settings" | null>("activity");
    const [mapMotion, setMapMotion] = useState({ dx: 0, dy: 0, isDragging: false });
    const [location, setLocation] = useState({ lat: 18.5204, lng: 73.8567, label: "Pune" });
    const [viewport, setViewport] = useState({ width: 1280, height: 720 });
    const [intel, setIntel] = useState<PublicIntel | null>(null);
    const [pointDetail, setPointDetail] = useState<ImraboMapPointDetail | null>(null);
    const [scopeEnabled, setScopeEnabled] = useState(true);
    const [overlayVisibility, setOverlayVisibility] = useState({
        nearbyPlaces: true,
        earthquakes: true,
        flights: true,
        iss: true,
    });

    const agentsRunning = useMemo(() => agents.filter((agent) => agent.status === "ACTIVE").length, [agents]);
    const hideOtherCards = Boolean(pointDetail);
    const scopeMode: ImraboScopeMode = pointDetail ? "target" : listening ? "fixed" : "cursor";
    const scopeActive = scopeEnabled || listening || Boolean(pointDetail);
    const scopeTarget = pointDetail ? { x: pointDetail.x, y: pointDetail.y } : null;
    const scopeFixed = listening ? { x: viewport.width / 2, y: Math.max(160, viewport.height - 150) } : null;
    const scopeRadius = pointDetail ? 160 : listening ? 190 : 180;

    useEffect(() => {
        const clock = setInterval(() => {
            setTimeText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }, 1000);
        setTimeText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        return () => clearInterval(clock);
    }, []);

    useEffect(() => {
        const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            const target = event.target as HTMLElement | null;
            const isTypingTarget =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                Boolean(target?.isContentEditable);
            if (isTypingTarget) return;
            if (event.key.toLowerCase() === "s") {
                setScopeEnabled((prev) => !prev);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const [dashboardRes, agentsRes, tasksRes, memoryRes] = await Promise.all([
                    fetch("/api/dashboard"),
                    fetch("/api/agents"),
                    fetch("/api/tasks"),
                    fetch("/api/memory"),
                ]);

                if (!dashboardRes.ok || !agentsRes.ok || !tasksRes.ok || !memoryRes.ok) {
                    return;
                }

                const dashboardData = (await dashboardRes.json()) as DashboardData;
                const agentsData = (await agentsRes.json()) as { items: Agent[] };
                const tasksData = (await tasksRes.json()) as { items: Task[] };
                const memoryData = (await memoryRes.json()) as { items: MemoryItem[] };

                setDashboard(dashboardData);
                setAgents(agentsData.items);
                setTasks(tasksData.items.slice(0, 5));
                setMemory(memoryData.items.slice(0, 5));

                const timelineLogs = (dashboardData.timeline ?? []).slice(0, 8).map((item) => ({
                    time: item.time,
                    text: item.text,
                }));
                setLogs(timelineLogs);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        load();
        const poll = setInterval(load, 7000);
        return () => clearInterval(poll);
    }, []);

    useEffect(() => {
        const loadIntel = async () => {
            try {
                const response = await fetch(`/api/public/intelligence?lat=${location.lat}&lng=${location.lng}`);
                if (!response.ok) return;
                const data = (await response.json()) as PublicIntel;
                setIntel(data);
            } catch (error) {
                console.error("Failed to fetch public intelligence", error);
            }
        };

        loadIntel();
        const poll = setInterval(loadIntel, 60000);
        return () => clearInterval(poll);
    }, [location.lat, location.lng]);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const handleCommand = async (command: string) => {
        const lower = command.toLowerCase();

        if (lower.includes("show tasks")) {
            setActivePanel("tasks");
            speak("Opening tasks panel");
            return;
        }

        if (lower.includes("show memory")) {
            setActivePanel("memory");
            speak("Opening memory panel");
            return;
        }

        if (lower.includes("show agents")) {
            setActivePanel("agents");
            speak("Opening agents panel");
            return;
        }

        if (lower.includes("show activity") || lower.includes("timeline")) {
            setActivePanel("activity");
            speak("Opening activity panel");
            return;
        }

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: command }),
        });
        const data = (await res.json()) as { reply?: string };
        if (data.reply) {
            setLogs((prev) => [
                { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), text: `ImRabo: ${data.reply}` },
                ...prev,
            ].slice(0, 12));
            speak(data.reply);
        }
    };

    const startVoice = () => {
        const Recognition =
            (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
            (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

        if (!Recognition) return;

        const recognition = new Recognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        setListening(true);

        recognition.onresult = async (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
            const text = event.results[0]?.[0]?.transcript ?? "";
            await handleCommand(text);
        };

        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognition.start();
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-black text-blue-100">
            <ImraboMap
                onMotion={setMapMotion}
                onLocation={setLocation}
                onPointHover={setPointDetail}
                nearbyPlaces={intel?.nearbyPlaces}
                earthquakes={intel?.earthquakes}
                flights={intel?.flights}
                iss={intel?.iss ?? null}
                visibility={overlayVisibility}
            />

            <div className="imrabo-grid-overlay fixed inset-0 z-1 pointer-events-none" />
            <div className="fixed inset-0 z-2 bg-black/35 pointer-events-none" />
            <ImraboScope
                active={scopeActive}
                mode={scopeMode}
                target={scopeTarget}
                fixedPoint={scopeFixed}
                radius={scopeRadius}
                darkness={0.7}
                showPulse
            />

            <div className="fixed left-0 right-0 top-0 z-30 h-10 border-b border-blue-300/20 bg-black/40 px-4 backdrop-blur-sm">
                <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold tracking-[0.2em]">IMRABO ONLINE</span>
                        <span>Location: {location.label}</span>
                        <span>Agents: {agentsRunning}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${scopeActive
                            ? "border-blue-300/40 bg-blue-500/15 text-blue-100"
                            : "border-blue-300/20 bg-black/35 text-blue-300/70"
                            }`}>
                            SCOPE {scopeActive ? "ON" : "OFF"}
                        </span>
                        <span>{timeText}</span>
                        <span className="inline-flex items-center gap-1">{listening ? <Mic className="h-3.5 w-3.5 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />} Live</span>
                    </div>
                </div>
            </div>

            {pointDetail && (
                <ImraboPanel
                    title={pointDetail.type === "place" ? "Nearby Detail" : pointDetail.type === "earthquake" ? "Earthquake Detail" : "Flight Detail"}
                    defaultPosition={{
                        top: Math.min(Math.max(60, pointDetail.y + 58), viewport.height - 230),
                        left: Math.min(Math.max(20, pointDetail.x + 24), viewport.width - 360),
                    }}
                    mapDragging={mapMotion.isDragging}
                    followMode={false}
                    width={330}
                    onClose={() => setPointDetail(null)}
                >
                    <p className="font-semibold">{pointDetail.title}</p>
                    <p>{pointDetail.subtitle}</p>
                    <p>Lat: {pointDetail.lat.toFixed(4)}</p>
                    <p>Lng: {pointDetail.lng.toFixed(4)}</p>
                </ImraboPanel>
            )}

            {!hideOtherCards && (
                <>
                    <ImraboPanel
                        title="Today Plan"
                        defaultPosition={{ top: 70, left: 28 }}
                        mapDragging={mapMotion.isDragging}
                        followMode={followMode}
                        motionOffset={mapMotion}
                    >
                        {(dashboard?.todayPlan ?? ["No plan generated yet."]).map((item, idx) => (
                            <p key={`${item}-${idx}`}>• {item}</p>
                        ))}
                    </ImraboPanel>

                    <ImraboPanel
                        title="Alerts"
                        defaultPosition={{ top: 70, left: 400 }}
                        mapDragging={mapMotion.isDragging}
                        followMode={followMode}
                        motionOffset={mapMotion}
                    >
                        {(dashboard?.alerts ?? ["No active alerts"]).map((item, idx) => (
                            <p key={`${item}-${idx}`}>• {item}</p>
                        ))}
                    </ImraboPanel>

                    <ImraboPanel
                        title="Metrics"
                        defaultPosition={{ top: 270, left: 400 }}
                        mapDragging={mapMotion.isDragging}
                        followMode={followMode}
                        motionOffset={mapMotion}
                    >
                        <p>Leads Today: {dashboard?.metrics.eventsToday ?? 0}</p>
                        <p>Customers: {dashboard?.metrics.goalsActive ?? 0}</p>
                        <p>Revenue: {dashboard?.metrics.tasksDoneToday ?? 0}</p>
                    </ImraboPanel>

                    <ImraboPanel
                        title="Live Briefing"
                        defaultPosition={{ top: 70, left: viewport.width > 1100 ? viewport.width - 380 : 28 }}
                        mapDragging={mapMotion.isDragging}
                        followMode={followMode}
                        motionOffset={mapMotion}
                        width={340}
                    >
                        <p>Weather: {intel?.weather.temperature ?? "-"}°C</p>
                        <p>Humidity: {intel?.weather.humidity ?? "-"}%</p>
                        <p>Wind: {intel?.weather.wind ?? "-"} km/h</p>
                        <p>Rain Chance: {intel?.weather.rainChance ?? "-"}%</p>
                        <p>Sunrise: {intel?.weather.sunrise ? new Date(intel.weather.sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</p>
                        <p>Sunset: {intel?.weather.sunset ? new Date(intel.weather.sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</p>
                        <p>AQI: {intel?.aqi.value ?? "-"} ({intel?.aqi.label ?? "Unknown"})</p>
                        <p>Traffic: {intel?.traffic.status ?? "Unknown"}</p>
                    </ImraboPanel>

                    {activePanel === "activity" && (
                        <ImraboPanel
                            title="Activity Tracker"
                            defaultPosition={{ top: 80, left: viewport.width > 1100 ? viewport.width - 340 : 28 }}
                            mapDragging={mapMotion.isDragging}
                            followMode={followMode}
                            motionOffset={mapMotion}
                            width={300}
                            onClose={() => setActivePanel(null)}
                        >
                            {logs.length ? logs.map((item, idx) => <p key={`${item.time}-${idx}`}>{item.time} {item.text}</p>) : <p>No activity yet.</p>}
                        </ImraboPanel>
                    )}

                    {activePanel === "settings" && (
                        <ImraboPanel
                            title="Environment Intelligence"
                            defaultPosition={{ top: 220, left: viewport.width > 1100 ? viewport.width - 340 : 28 }}
                            mapDragging={mapMotion.isDragging}
                            followMode={followMode}
                            motionOffset={mapMotion}
                            width={300}
                            onClose={() => setActivePanel(null)}
                        >
                            <p>Nearby Places: {intel?.nearbyPlaces?.length ?? 0}</p>
                            <p>Flights Nearby: {intel?.flights?.length ?? 0}</p>
                            <p>Earthquakes Tracked: {intel?.earthquakes?.length ?? 0}</p>
                            <p>ISS Visibility: {intel?.iss?.visibility ?? "-"}</p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <ToggleChip
                                    label="Places"
                                    active={overlayVisibility.nearbyPlaces}
                                    onClick={() =>
                                        setOverlayVisibility((prev) => ({ ...prev, nearbyPlaces: !prev.nearbyPlaces }))
                                    }
                                />
                                <ToggleChip
                                    label="Quakes"
                                    active={overlayVisibility.earthquakes}
                                    onClick={() =>
                                        setOverlayVisibility((prev) => ({ ...prev, earthquakes: !prev.earthquakes }))
                                    }
                                />
                                <ToggleChip
                                    label="Flights"
                                    active={overlayVisibility.flights}
                                    onClick={() =>
                                        setOverlayVisibility((prev) => ({ ...prev, flights: !prev.flights }))
                                    }
                                />
                                <ToggleChip
                                    label="ISS"
                                    active={overlayVisibility.iss}
                                    onClick={() => setOverlayVisibility((prev) => ({ ...prev, iss: !prev.iss }))}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setFollowMode((prev) => !prev)}
                                className="mt-2 rounded-md border border-blue-300/30 px-3 py-1.5 text-xs hover:bg-blue-500/10"
                            >
                                Panel Mode: {followMode ? "Follow Map" : "Fixed"}
                            </button>
                        </ImraboPanel>
                    )}

                    {activePanel === "tasks" && (
                        <ImraboPanel
                            title="Tasks"
                            defaultPosition={{ top: 80, left: 28 }}
                            mapDragging={mapMotion.isDragging}
                            followMode={followMode}
                            motionOffset={mapMotion}
                            width={300}
                            onClose={() => setActivePanel(null)}
                        >
                            {tasks.length ? tasks.map((task) => <p key={task.id}>• {task.title} ({task.status})</p>) : <p>No tasks.</p>}
                        </ImraboPanel>
                    )}

                    {activePanel === "memory" && (
                        <ImraboPanel
                            title="Memory"
                            defaultPosition={{ top: 80, left: 28 }}
                            mapDragging={mapMotion.isDragging}
                            followMode={followMode}
                            motionOffset={mapMotion}
                            width={300}
                            onClose={() => setActivePanel(null)}
                        >
                            {memory.length ? memory.map((item) => <p key={item.id}>• {item.kind}: {item.content}</p>) : <p>No memory entries.</p>}
                        </ImraboPanel>
                    )}

                    {activePanel === "agents" && (
                        <ImraboPanel
                            title="Agents"
                            defaultPosition={{ top: 80, left: 28 }}
                            mapDragging={mapMotion.isDragging}
                            followMode={followMode}
                            motionOffset={mapMotion}
                            width={300}
                            onClose={() => setActivePanel(null)}
                        >
                            {agents.length ? agents.map((agent) => <p key={agent.id}>• {agent.name} — {agent.status}</p>) : <p>No agents.</p>}
                        </ImraboPanel>
                    )}

                    <ImraboPanel
                        title="News + Local Events"
                        defaultPosition={{ top: 420, left: viewport.width > 1100 ? viewport.width - 380 : 28 }}
                        mapDragging={mapMotion.isDragging}
                        followMode={followMode}
                        motionOffset={mapMotion}
                        width={340}
                    >
                        <p className="mb-1 font-semibold">Upcoming Events</p>
                        {(intel?.events?.length ? intel.events : [{ name: "No upcoming public holidays", date: "" }]).map((event, idx) => (
                            <p key={`${event.name}-${idx}`}>• {event.name} {event.date ? `(${event.date})` : ""}</p>
                        ))}
                        <p className="mb-1 mt-2 font-semibold">Top News</p>
                        {(intel?.news?.length ? intel.news : [{ title: "No headlines available", url: "" }]).map((news, idx) => (
                            <p key={`${news.title}-${idx}`}>• {news.title}</p>
                        ))}
                    </ImraboPanel>
                </>
            )}

            <ImraboConsole onCommand={handleCommand} onVoice={startVoice} />
            <ImraboDock onAction={(action) => setActivePanel(action)} />
        </div>
    );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-md border px-2 py-1 text-xs ${active
                ? "border-blue-300/60 bg-blue-500/20 text-blue-100"
                : "border-blue-300/20 bg-black/30 text-blue-300/80"
                }`}
        >
            {label} {active ? "On" : "Off"}
        </button>
    );
}
