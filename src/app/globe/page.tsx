import GlobeView from "@/components/GlobeView";

export default function GlobePage() {
    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black text-gray-100">
            <section className="absolute inset-0 flex items-center justify-center">
                <div className="h-[82vmin] w-[82vmin] max-h-[860px] max-w-[860px] min-h-[420px] min-w-[420px] overflow-hidden rounded-full shadow-[0_0_120px_rgba(255,106,0,0.22)]">
                    <GlobeView tileUrl={process.env.NEXT_PUBLIC_OSM_TILE_URL} />
                </div>
            </section>

            <section className="pointer-events-none absolute left-4 top-4 w-56 rounded-sm border border-orange-500/40 bg-black/60 p-3 text-xs backdrop-blur-sm">
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-orange-300">METRICS</p>
                <p className="text-gray-300">Active Nodes: 248</p>
                <p className="text-gray-300">Alerts: 3 critical</p>
            </section>

            <section className="pointer-events-none absolute right-4 top-4 w-64 rounded-sm border border-orange-500/40 bg-black/60 p-3 text-xs backdrop-blur-sm">
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-orange-300">ACTIVITY</p>
                <p className="text-gray-300">Agent Sync: 12s ago</p>
                <p className="text-gray-300">Uplink: Stable</p>
            </section>

            <section className="pointer-events-none absolute bottom-4 right-4 w-72 rounded-sm border border-orange-500/40 bg-black/60 p-3 text-xs backdrop-blur-sm">
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-orange-300">EVENT FEED</p>
                <p className="text-gray-300">No new anomalies in the last 5 minutes.</p>
            </section>
        </main>
    );
}
