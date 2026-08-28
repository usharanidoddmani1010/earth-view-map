import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Layers,
  Map as MapIcon,
  Mountain,
  Radar,
  Satellite,
  Search,
  Siren,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  INDIAN_STATES,
  RISK_META,
  RISK_ZONES,
  type RiskLevel,
  type RiskZone,
} from "@/lib/discatra-data";
import type { Basemap } from "@/components/DiscatraMap";

const DiscatraMap = lazy(() => import("@/components/DiscatraMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DISCATRA GIS — Live Disaster Risk Command Map of India" },
      {
        name: "description",
        content:
          "DISCATRA disaster-risk dashboard: real satellite and terrain basemap of India with live hazard heatmaps, red/orange/yellow risk zones and district-level drilldown.",
      },
      { property: "og:title", content: "DISCATRA GIS — Disaster Risk Command Map" },
      {
        property: "og:description",
        content:
          "Real satellite/terrain basemap with DISCATRA hazard heatmaps and district-level risk zones across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const LEVEL_ORDER: RiskLevel[] = ["critical", "high", "moderate"];

function MapSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-muted">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Radar className="size-4 animate-spin" /> Loading satellite tiles…
      </div>
    </div>
  );
}

function Dashboard() {
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [showRisk, setShowRisk] = useState(true);
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState<string | null>(null);
  const [selected, setSelected] = useState<RiskZone | null>(null);
  const [target, setTarget] = useState<{
    lng: number;
    lat: number;
    zoom: number;
    key: number;
  } | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return INDIAN_STATES.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const zones = useMemo(
    () =>
      [...RISK_ZONES]
        .filter((z) => !activeState || z.state === activeState)
        .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)),
    [activeState],
  );

  const counts = useMemo(
    () =>
      LEVEL_ORDER.map((level) => ({
        level,
        n: zones.filter((z) => z.level === level).length,
      })),
    [zones],
  );

  const flyToState = (name: string) => {
    const s = INDIAN_STATES.find((x) => x.name === name);
    if (!s) return;
    setActiveState(name);
    setQuery("");
    setSelected(null);
    setTarget({ lng: s.lng, lat: s.lat, zoom: s.zoom, key: Date.now() });
  };

  const flyToZone = (z: RiskZone) => {
    setSelected(z);
    setTarget({ lng: z.lng, lat: z.lat, zoom: 10.5, key: Date.now() });
  };

  const resetView = () => {
    setActiveState(null);
    setSelected(null);
    setTarget({ lng: 80.5, lat: 22.5, zoom: 4.1, key: Date.now() });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Siren className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">DISCATRA</p>
            <p className="text-[11px] text-muted-foreground">GIS Risk Command</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {[
            { icon: MapIcon, label: "Risk Map", active: true },
            { icon: Waves, label: "Flood Watch" },
            { icon: Mountain, label: "Landslides" },
            { icon: AlertTriangle, label: "Alerts" },
            { icon: Building2, label: "Authorities" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                item.active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-sidebar-border p-4 text-[11px] text-muted-foreground">
          <p className="font-medium text-foreground">Basemap source</p>
          <p>Esri ArcGIS World Imagery / World Topographic raster tiles (live service).</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search state or UT…"
              className="pl-9"
            />
            {matches.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                {matches.map((s) => (
                  <li key={s.name}>
                    <button
                      onClick={() => flyToState(s.name)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button variant="outline" size="sm">
            <Building2 className="size-4" /> Authority
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            <MapIcon className="size-4" /> {activeState ?? "State"}
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={basemap === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => setBasemap("satellite")}
            >
              <Satellite className="size-4" /> Satellite
            </Button>
            <Button
              variant={basemap === "terrain" ? "default" : "outline"}
              size="sm"
              onClick={() => setBasemap("terrain")}
            >
              <Mountain className="size-4" /> Terrain
            </Button>
            <Button
              variant={showRisk ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRisk((v) => !v)}
            >
              <Layers className="size-4" /> Risk overlay
            </Button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1">
          {/* Map */}
          <section className="relative min-w-0 flex-1">
            <ClientOnly fallback={<MapSkeleton />}>
              <Suspense fallback={<MapSkeleton />}>
                <DiscatraMap
                  basemap={basemap}
                  target={target}
                  showRisk={showRisk}
                  onSelectZone={flyToZone}
                />
              </Suspense>
            </ClientOnly>

            {/* Legend */}
            <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-border bg-card/85 px-3 py-2 text-xs shadow-lg backdrop-blur">
              <p className="mb-1.5 font-semibold">Risk overlay</p>
              {LEVEL_ORDER.map((level) => (
                <div key={level} className="flex items-center gap-2 py-0.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: RISK_META[level].color }}
                  />
                  <span className="text-muted-foreground">{RISK_META[level].label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Panels */}
          <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card lg:flex">
            <div className="grid grid-cols-3 gap-2 border-b border-border p-4">
              {counts.map(({ level, n }) => (
                <div key={level} className="rounded-md border border-border p-2 text-center">
                  <p
                    className="text-lg font-semibold"
                    style={{ color: RISK_META[level].color }}
                  >
                    {n}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {level}
                  </p>
                </div>
              ))}
            </div>

            {selected && (
              <div className="border-b border-border p-4">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Selected zone
                </p>
                <p className="mt-1 font-semibold">{selected.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.district}, {selected.state}
                </p>
                <p className="mt-2 text-xs">
                  Hazard: <span className="font-medium">{selected.hazard}</span> ·{" "}
                  <span style={{ color: RISK_META[selected.level].color }}>
                    {RISK_META[selected.level].label}
                  </span>
                </p>
              </div>
            )}

            <div className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {activeState ? `${activeState} hazards` : "Active hazard zones"}
              </p>
              <ul className="space-y-1.5">
                {zones.map((z) => (
                  <li key={z.id}>
                    <button
                      onClick={() => flyToZone(z)}
                      className={`flex w-full items-start gap-2 rounded-md border p-2 text-left transition-colors hover:bg-accent ${
                        selected?.id === z.id ? "border-ring bg-accent" : "border-border"
                      }`}
                    >
                      <span
                        className="mt-1 size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: RISK_META[z.level].color }}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{z.name}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {z.hazard} · {z.district}, {z.state}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
                {zones.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    No hazard data for this selection.
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
