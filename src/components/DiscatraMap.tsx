import { useEffect, useRef, useState } from "react";
import { Map as MlMap, NavigationControl, ScaleControl, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RISK_ZONES, riskGeoJSON, type RiskZone } from "@/lib/discatra-data";

export type Basemap = "satellite" | "terrain";

const ESRI_ATTR =
  'Imagery &copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN and the GIS User Community';

/**
 * Real raster tile services (Esri ArcGIS Online, no API key required).
 * These are genuine satellite imagery / shaded-relief terrain tiles.
 */
const TILES: Record<Basemap, string[]> = {
  satellite: [
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  ],
  terrain: [
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  ],
};

const BOUNDARY_TILES = [
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
];

function buildStyle(basemap: Basemap): StyleSpecification {
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      basemap: {
        type: "raster",
        tiles: TILES[basemap],
        tileSize: 256,
        maxzoom: 19,
        attribution: ESRI_ATTR,
      },
      boundaries: {
        type: "raster",
        tiles: BOUNDARY_TILES,
        tileSize: 256,
        maxzoom: 19,
      },
      risk: { type: "geojson", data: riskGeoJSON() as never },
    },
    layers: [
      // 1. REAL satellite / terrain imagery — always the bottom, never covered.
      { id: "basemap", type: "raster", source: "basemap", paint: { "raster-opacity": 1 } },
      // 2. Real state / district boundaries + place labels (transparent overlay).
      {
        id: "boundaries",
        type: "raster",
        source: "boundaries",
        paint: { "raster-opacity": 0.9 },
      },
      // 3. Disaster heatmap (only where hazard data exists).
      {
        id: "risk-heat",
        type: "heatmap",
        source: "risk",
        maxzoom: 9,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 3, 1, 9, 3],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 3, 18, 9, 70],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0.75, 9, 0.35],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.25,
            "rgba(245,211,39,0.45)",
            0.55,
            "rgba(255,138,31,0.6)",
            1,
            "rgba(239,45,45,0.75)",
          ],
        },
      },
      // 4. Localised risk zones (semi-transparent, imagery still visible through them).
      {
        id: "risk-zone-fill",
        type: "circle",
        source: "risk",
        paint: {
          "circle-color": ["get", "color"],
          "circle-opacity": 0.28,
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-width": 1.5,
          "circle-stroke-opacity": 0.85,
          "circle-radius": [
            "interpolate",
            ["exponential", 2],
            ["zoom"],
            4,
            ["/", ["get", "radius"], 12000],
            12,
            ["/", ["get", "radius"], 60],
          ],
        },
      },
      // 5. Risk markers.
      {
        id: "risk-markers",
        type: "circle",
        source: "risk",
        paint: {
          "circle-radius": 5,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.9)",
        },
      },
    ],
  };
}

interface Props {
  basemap: Basemap;
  target: { lng: number; lat: number; zoom: number; key: number } | null;
  showRisk: boolean;
  onSelectZone: (zone: RiskZone) => void;
}

export default function DiscatraMap({ basemap, target, showRisk, onSelectZone }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = new MlMap({
      container: container.current,
      style: buildStyle("satellite"),
      center: [80.5, 22.5],
      zoom: 4.1,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: { compact: true },
    });
    map.current = m;
    (window as unknown as { __discatraMap?: MlMap }).__discatraMap = m;
    m.addControl(new NavigationControl({ visualizePitch: true }), "bottom-right");
    m.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    m.on("load", () => {
      m.resize();
      setReady(true);
    });
    const ro = new ResizeObserver(() => m.resize());
    ro.observe(container.current);

    const hit = ["risk-markers", "risk-zone-fill"];
    m.on("click", (e) => {
      const f = m.queryRenderedFeatures(e.point, { layers: hit })[0];
      if (!f) return;
      const zone = RISK_ZONES.find((z) => z.id === f.properties?.["id"]);
      if (zone) {
        onSelectZone(zone);
        m.flyTo({ center: [zone.lng, zone.lat], zoom: Math.max(m.getZoom(), 9), speed: 0.9 });
      }
    });
    m.on("mousemove", (e) => {
      const f = m.queryRenderedFeatures(e.point, { layers: hit })[0];
      m.getCanvas().style.cursor = f ? "pointer" : "";
    });

    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, [onSelectZone]);

  // Swap only the basemap raster tiles — overlays are rebuilt with the style.
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const src = m.getSource("basemap");
    if (src && "setTiles" in src) {
      (src as unknown as { setTiles: (t: string[]) => void }).setTiles(TILES[basemap]);
    }
  }, [basemap, ready]);

  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    for (const id of ["risk-heat", "risk-zone-fill", "risk-markers"]) {
      if (m.getLayer(id)) m.setLayoutProperty(id, "visibility", showRisk ? "visible" : "none");
    }
  }, [showRisk, ready]);

  useEffect(() => {
    const m = map.current;
    if (!m || !target) return;
    m.flyTo({ center: [target.lng, target.lat], zoom: target.zoom, speed: 1.1, curve: 1.4 });
  }, [target]);

  return <div ref={container} className="h-full w-full" />;
}
