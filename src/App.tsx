import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, Bot, CheckCircle2, Cloud, MapPin, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { ImraboMap, type ImraboMapPointDetail } from "@/components/imrabo-map";
import { ImraboPanel } from "@/components/imrabo-panel";
import { ImraboConsole } from "@/components/imrabo-console";
import { ImraboDock, type DockAction } from "@/components/imrabo-dock";
import { ImraboScope } from "@/components/imrabo-scope";

type Dashboard = {
  todayPlan?: string[];
  alerts?: string[];
  metrics?: { tasksPending?: number; tasksDoneToday?: number; goalsActive?: number; eventsToday?: number };
  timeline?: Array<{ time: string; text: string }>;
};
type Agent = { id: string; name: string; status: "ACTIVE" | "PAUSED"; lastLog?: string };
type Task = { id: string; title: string; status: "PENDING" | "IN_PROGRESS" | "DONE" };
type MemoryItem = { id: string; content: string; kind: string };
type Intel = {
  weather?: { temperature?: number; humidity?: number; wind?: number; rainChance?: number; sunrise?: string; sunset?: string };
  aqi?: { value?: number; label?: string };
  traffic?: { status?: string };
  earthquakes?: Array<{ magnitude: number; place: string; lat: number; lng: number }>;
  flights?: Array<{ callsign: string; lat: number; lng: number; altitude: number }>;
  iss?: { lat: number; lng: number; visibility?: string };
  nearbyPlaces?: Array<{ lat: number; lng: number; name: string; category: string }>;
  events?: Array<{ name: string; date: string }>;
  news?: Array<{ title: string; url: string }>;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const demoDashboard: Dashboard = {
  todayPlan: ["Review priorities and active work", "Follow up on important conversations", "Protect time for focused execution"],
  alerts: ["Connect an API to load live alerts", "Your workspace is running in client-only mode"],
  metrics: { tasksPending: 3, tasksDoneToday: 2, goalsActive: 4, eventsToday: 1 },
  timeline: [{ time: "Now", text: "ImRabo Console is ready" }, { time: "Now", text: "Client application initialized" }],
};
const demoAgents: Agent[] = [
  { id: "daily", name: "Daily Agent", status: "PAUSED" },
  { id: "monitor", name: "Monitoring Agent", status: "PAUSED" },
  { id: "reminder", name: "Reminder Agent", status: "PAUSED" },
];
const demoTasks: Task[] = [
  { id: "1", title: "Connect your workspace API", status: "IN_PROGRESS" },
  { id: "2", title: "Review today's priorities", status: "PENDING" },
  { id: "3", title: "Check recent activity", status: "DONE" },
];
const demoMemory: MemoryItem[] = [
  { id: "1", kind: "Workspace", content: "Client-only mode — connect an API for persistent data." },
];

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!API_BASE_URL) throw new Error("API base URL is not configured");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export default function App() {
  const [dashboard, setDashboard] = useState<Dashboard>(demoDashboard);
  const [agents, setAgents] = useState<Agent[]>(demoAgents);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [memory, setMemory] = useState<MemoryItem[]>(demoMemory);
  const [intel, setIntel] = useState<Intel | null>(null);
  const [logs, setLogs] = useState(demoDashboard.timeline ?? []);
  const [activePanel, setActivePanel] = useState<DockAction | null>("activity");
  const [apiState, setApiState] = useState<"demo" | "loading" | "connected" | "error">(API_BASE_URL ? "loading" : "demo");
  const [apiError, setApiError] = useState("");
  const [location, setLocation] = useState({ lat: 18.5204, lng: 73.8567, label: "Pune" });
  const [pointDetail, setPointDetail] = useState<ImraboMapPointDetail | null>(null);
  const [mapMotion, setMapMotion] = useState({ dx: 0, dy: 0, isDragging: false });
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [timeText, setTimeText] = useState("");
  const [listening, setListening] = useState(false);
  const [scopeEnabled, setScopeEnabled] = useState(true);
  const [followMode, setFollowMode] = useState(false);
  const [visibility, setVisibility] = useState({ nearbyPlaces: true, earthquakes: true, flights: true, iss: true });

  const agentsRunning = useMemo(() => agents.filter((agent) => agent.status === "ACTIVE").length, [agents]);

  const loadWorkspace = useCallback(async (signal?: AbortSignal) => {
    if (!API_BASE_URL) return;
    setApiState("loading");
    try {
      const [dashboardData, agentsData, tasksData, memoryData] = await Promise.all([
        request<Dashboard>("/api/dashboard", signal),
        request<{ items: Agent[] }>("/api/agents", signal),
        request<{ items: Task[] }>("/api/tasks", signal),
        request<{ items: MemoryItem[] }>("/api/memory", signal),
      ]);
      setDashboard(dashboardData);
      setAgents(agentsData.items ?? []);
      setTasks((tasksData.items ?? []).slice(0, 8));
      setMemory((memoryData.items ?? []).slice(0, 8));
      setLogs((dashboardData.timeline ?? []).slice(0, 12));
      setApiState("connected");
      setApiError("");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setApiState("error");
      setApiError(error instanceof Error ? error.message : "Unable to reach API");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadWorkspace(controller.signal);
    if (!API_BASE_URL) return () => controller.abort();
    const interval = window.setInterval(() => void loadWorkspace(), 30000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [loadWorkspace]);

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const updateClock = () => setTimeText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    updateViewport();
    updateClock();
    window.addEventListener("resize", updateViewport);
    const clock = window.setInterval(updateClock, 1000);
    return () => { window.removeEventListener("resize", updateViewport); window.clearInterval(clock); };
  }, []);

  useEffect(() => {
    if (!API_BASE_URL) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ lat: String(location.lat), lng: String(location.lng) });
    const load = async () => {
      try { setIntel(await request<Intel>(`/api/public/intelligence?${query}`, controller.signal)); }
      catch { /* The dashboard remains usable when optional intelligence is unavailable. */ }
    };
    void load();
    const interval = window.setInterval(() => void load(), 60000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [location.lat, location.lng]);

  const speak = (message: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
  };

  const handleCommand = async (command: string) => {
    const normalized = command.toLowerCase();
    const panel = (["activity", "tasks", "memory", "agents", "settings"] as DockAction[]).find((item) => normalized.includes(`show ${item}`));
    if (panel) {
      setActivePanel(panel);
      speak(`Opening ${panel}`);
      return;
    }
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ message: command }),
        });
        if (!response.ok) throw new Error(`Chat request failed (${response.status})`);
        const result = await response.json() as { reply?: string };
        const reply = result.reply ?? "The API returned no response.";
        setLogs((current) => [{ time: new Date().toLocaleTimeString(), text: `ImRabo: ${reply}` }, ...current].slice(0, 12));
        speak(reply);
        return;
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Chat API unavailable");
        setApiState("error");
      }
    }
    const reply = "The interface is running in demo mode. Set VITE_API_BASE_URL to connect your API.";
    setLogs((current) => [{ time: new Date().toLocaleTimeString(), text: `You: ${command}` }, { time: "Now", text: reply }, ...current].slice(0, 12));
    speak(reply);
  };

  const startVoice = () => {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLogs((current) => [{ time: "Now", text: "Voice input is not supported by this browser." }, ...current].slice(0, 12));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    setListening(true);
    recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void handleCommand(event.results[0]?.[0]?.transcript ?? "");
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050912] text-blue-100">
      <ImraboMap
        onMotion={setMapMotion}
        onLocation={setLocation}
        onPointHover={setPointDetail}
        nearbyPlaces={intel?.nearbyPlaces}
        earthquakes={intel?.earthquakes}
        flights={intel?.flights}
        iss={intel?.iss ?? null}
        visibility={visibility}
      />
      <div className="imrabo-grid-overlay pointer-events-none fixed inset-0 z-[1]" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-black/35" />
      <ImraboScope active={scopeEnabled || listening || Boolean(pointDetail)} mode={pointDetail ? "target" : listening ? "fixed" : "cursor"} target={pointDetail ? { x: pointDetail.x, y: pointDetail.y } : null} fixedPoint={listening ? { x: viewport.width / 2, y: viewport.height - 150 } : null} radius={pointDetail ? 160 : 180} darkness={0.68} />

      <header className="fixed inset-x-0 top-0 z-30 flex h-11 items-center justify-between border-b border-cyan-300/15 bg-black/55 px-4 text-[11px] backdrop-blur-md">
        <div className="flex items-center gap-4 tracking-wider"><span className="font-semibold tracking-[0.22em]">IMRABO CONSOLE</span><span className="hidden text-blue-200/60 sm:inline-flex"><MapPin className="mr-1 h-3 w-3" />{location.label}</span><span className="hidden sm:inline">Agents {agentsRunning}/{agents.length}</span></div>
        <div className="flex items-center gap-3"><span className="inline-flex items-center gap-1.5">{apiState === "connected" ? <Wifi className="h-3 w-3 text-emerald-300" /> : apiState === "error" ? <AlertCircle className="h-3 w-3 text-amber-300" /> : <WifiOff className="h-3 w-3 text-blue-300/60" />}{apiState === "connected" ? "API CONNECTED" : apiState === "loading" ? "CONNECTING" : apiState === "error" ? "API OFFLINE" : "DEMO MODE"}</span><span className="hidden sm:inline">{timeText}</span></div>
      </header>

      <section className="pointer-events-none fixed left-4 top-16 z-10 flex flex-col gap-2 sm:left-7">
        <div className="pointer-events-auto w-[min(310px,calc(100vw-2rem))] rounded-md border border-cyan-300/20 bg-slate-950/75 p-4 shadow-[0_0_35px_rgba(8,145,178,.12)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between"><p className="text-[10px] tracking-[.22em] text-cyan-200/70">TODAY OVERVIEW</p><Activity className="h-4 w-4 text-cyan-200/70" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Tasks pending" value={dashboard.metrics?.tasksPending ?? tasks.filter((task) => task.status !== "DONE").length} />
            <Metric label="Completed today" value={dashboard.metrics?.tasksDoneToday ?? tasks.filter((task) => task.status === "DONE").length} />
            <Metric label="Active goals" value={dashboard.metrics?.goalsActive ?? 0} />
            <Metric label="Events today" value={dashboard.metrics?.eventsToday ?? 0} />
          </div>
        </div>
        <div className="pointer-events-auto w-[min(310px,calc(100vw-2rem))] rounded-md border border-cyan-300/20 bg-slate-950/75 p-4 text-xs backdrop-blur-xl">
          <p className="mb-2 text-[10px] tracking-[.22em] text-cyan-200/70">TODAY PLAN</p>
          {(dashboard.todayPlan ?? []).map((item, index) => <p key={index} className="mb-1.5 text-blue-100/80">• {item}</p>)}
        </div>
      </section>

      <section className="pointer-events-none fixed right-4 top-16 z-10 flex flex-col gap-2 sm:right-7">
        <div className="pointer-events-auto w-[min(320px,calc(100vw-2rem))] rounded-md border border-cyan-300/20 bg-slate-950/75 p-4 text-xs backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between"><p className="text-[10px] tracking-[.22em] text-cyan-200/70">LIVE BRIEFING</p><Cloud className="h-4 w-4 text-cyan-200/70" /></div>
          <p>Weather: {intel?.weather?.temperature ?? "—"}°C</p><p>Humidity: {intel?.weather?.humidity ?? "—"}%</p><p>Air quality: {intel?.aqi?.value ?? "—"} ({intel?.aqi?.label ?? "unavailable"})</p><p>Traffic: {intel?.traffic?.status ?? "unavailable"}</p>
          <p className="mt-2 text-[10px] text-blue-200/45">{API_BASE_URL ? "Intelligence refreshes automatically" : "Connect an API to load live intelligence"}</p>
        </div>
        <div className="pointer-events-auto w-[min(320px,calc(100vw-2rem))] rounded-md border border-cyan-300/20 bg-slate-950/75 p-4 text-xs backdrop-blur-xl">
          <p className="mb-2 text-[10px] tracking-[.22em] text-cyan-200/70">SYSTEM STATUS</p>
          <div className="flex items-center justify-between"><span>Workspace API</span><span>{apiState === "connected" ? "Connected" : "Not connected"}</span></div>
          <div className="mt-2 h-1 overflow-hidden rounded bg-blue-100/10"><div className={`h-full rounded ${apiState === "connected" ? "w-full bg-emerald-400" : "w-1/4 bg-cyan-300/50"}`} /></div>
          {apiError && <p className="mt-2 text-amber-200/80">{apiError}</p>}
          <button onClick={() => void loadWorkspace()} className="mt-3 inline-flex items-center gap-1.5 text-cyan-200 hover:text-white"><RefreshCw className="h-3 w-3" /> Refresh data</button>
        </div>
      </section>

      {pointDetail && <ImraboPanel title={pointDetail.title} defaultPosition={{ top: Math.min(Math.max(60, pointDetail.y + 55), viewport.height - 220), left: Math.min(Math.max(20, pointDetail.x + 24), viewport.width - 350) }} mapDragging={mapMotion.isDragging} width={320} onClose={() => setPointDetail(null)}><p>{pointDetail.subtitle}</p><p>Latitude: {pointDetail.lat.toFixed(4)}</p><p>Longitude: {pointDetail.lng.toFixed(4)}</p></ImraboPanel>}

      {activePanel && <ImraboPanel title={activePanel.toUpperCase()} defaultPosition={{ top: 260, left: 28 }} mapDragging={mapMotion.isDragging} followMode={followMode} motionOffset={mapMotion} width={320} onClose={() => setActivePanel(null)}>
        {activePanel === "activity" && (logs.length ? logs.map((item, index) => <p key={index} className="mb-1">{item.time} · {item.text}</p>) : <p>No activity yet.</p>)}
        {activePanel === "tasks" && (tasks.length ? tasks.map((task) => <p key={task.id} className="mb-2">• {task.title} <span className="text-cyan-200/60">({task.status})</span></p>) : <p>No tasks returned by the API.</p>)}
        {activePanel === "memory" && (memory.length ? memory.map((item) => <p key={item.id} className="mb-2">• {item.kind}: {item.content}</p>) : <p>No memory entries.</p>)}
        {activePanel === "agents" && (agents.length ? agents.map((agent) => <p key={agent.id} className="mb-2">• {agent.name} — {agent.status}</p>) : <p>No agents returned by the API.</p>)}
        {activePanel === "settings" && <div className="space-y-2"><p>Map overlays</p>{(["nearbyPlaces", "earthquakes", "flights", "iss"] as const).map((key) => <label key={key} className="flex items-center justify-between capitalize"><span>{key.replace(/([A-Z])/g, " $1")}</span><input type="checkbox" checked={visibility[key]} onChange={(event) => setVisibility((current) => ({ ...current, [key]: event.target.checked }))} /></label>)}<button className="mt-2 rounded border border-cyan-300/30 px-3 py-1.5" onClick={() => setFollowMode((current) => !current)}>Panel mode: {followMode ? "Follow map" : "Fixed"}</button><button className="ml-2 rounded border border-cyan-300/30 px-3 py-1.5" onClick={() => setScopeEnabled((current) => !current)}>Scope: {scopeEnabled ? "On" : "Off"}</button></div>}
      </ImraboPanel>}

      <div className="fixed bottom-20 left-4 z-10 max-w-[min(310px,calc(100vw-2rem))] rounded border border-cyan-300/15 bg-slate-950/65 px-3 py-2 text-[10px] text-blue-100/60 backdrop-blur-md"><div className="mb-1 flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-cyan-200/70" /> CLIENT APPLICATION</div>React state · Browser APIs · Optional external API</div>
      <div className="fixed bottom-5 left-5 z-20 hidden items-center gap-2 text-[10px] text-blue-100/40 md:flex"><Bot className="h-3 w-3" /> IMRABO / CONSOLE</div>
      <ImraboConsole onCommand={handleCommand} onVoice={startVoice} />
      <ImraboDock onAction={setActivePanel} />
      <button aria-label="Toggle listening state" onClick={() => setListening((current) => !current)} className="fixed bottom-5 right-[4.5rem] z-20 rounded-full border border-cyan-300/20 bg-slate-950/80 p-3 text-cyan-100"><span className="sr-only">Listening</span>{listening ? "●" : "○"}</button>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><p className="text-xl font-semibold tracking-tight text-cyan-100">{value}</p><p className="text-[10px] text-blue-100/45">{label}</p></div>;
}
