export type Basemap = "satellite" | "terrain";
export type RiskLevel = "critical" | "high" | "moderate";
export type HazardType = "Flood" | "Landslide" | "Erosion" | "Cloudburst" | "Cyclone";
export type HazardFilter = "composite" | HazardType;

export interface StateEntry {
  name: string;
  lng: number;
  lat: number;
  zoom: number;
}

export interface ModelThresholds {
  positiveDecision: 1;
  strongConfidence: number;
  moderateConfidence: number;
  criticalRisk: number;
  highRisk: number;
}

export interface HazardPrediction {
  id: string;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  area: string;
  hazardType: HazardType;
  decision: 0 | 1;
  confidence: number;
  classification: string;
  color: string;
  timestamp: string;
  predictedTimeToEvent?: string;
  riskScore: number;
  population: number;
  affectedPopulation: number;
  additionalModelOutputs: Record<string, unknown>;
}

export interface CompositeContribution {
  hazardType: HazardType;
  decision: 0 | 1;
  confidence: number;
  classification: string;
  color: string;
}

export interface CompositeRegion {
  id: string;
  state: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
  compositeRiskScore: number;
  priority: RiskLevel;
  population: number;
  affectedPopulation: number;
  vulnerablePopulation?: number;
  hazards: CompositeContribution[];
  timestamp: string;
  nearbySafeLocationIds: string[];
}

export interface SafeLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: string;
  capacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  riskLevel: "low" | "moderate" | "high";
  availability: "Available" | "Limited" | "Full";
}

export type MapHover =
  | { kind: "composite"; id: string; x: number; y: number }
  | { kind: "hazard"; id: string; x: number; y: number };

export const DEMO_THRESHOLDS: ModelThresholds = {
  positiveDecision: 1,
  strongConfidence: 0.8,
  moderateConfidence: 0.6,
  criticalRisk: 80,
  highRisk: 60,
};

export const INDIAN_STATES: StateEntry[] = [
  { name: "Andhra Pradesh", lng: 79.74, lat: 15.91, zoom: 6.3 },
  { name: "Arunachal Pradesh", lng: 94.73, lat: 28.22, zoom: 6.5 },
  { name: "Assam", lng: 92.94, lat: 26.2, zoom: 6.6 },
  { name: "Bihar", lng: 85.31, lat: 25.6, zoom: 6.6 },
  { name: "Chhattisgarh", lng: 81.87, lat: 21.28, zoom: 6.4 },
  { name: "Goa", lng: 74.12, lat: 15.3, zoom: 9 },
  { name: "Gujarat", lng: 71.19, lat: 22.26, zoom: 6.2 },
  { name: "Haryana", lng: 76.09, lat: 29.06, zoom: 7 },
  { name: "Himachal Pradesh", lng: 77.17, lat: 31.95, zoom: 7 },
  { name: "Jharkhand", lng: 85.28, lat: 23.61, zoom: 6.8 },
  { name: "Karnataka", lng: 75.71, lat: 15.32, zoom: 6.2 },
  { name: "Kerala", lng: 76.27, lat: 10.85, zoom: 6.8 },
  { name: "Madhya Pradesh", lng: 78.66, lat: 23.47, zoom: 6 },
  { name: "Maharashtra", lng: 75.71, lat: 19.75, zoom: 6 },
  { name: "Manipur", lng: 93.9, lat: 24.66, zoom: 7.5 },
  { name: "Meghalaya", lng: 91.36, lat: 25.46, zoom: 7.5 },
  { name: "Mizoram", lng: 92.93, lat: 23.16, zoom: 7.5 },
  { name: "Nagaland", lng: 94.56, lat: 26.15, zoom: 7.5 },
  { name: "Odisha", lng: 85.09, lat: 20.95, zoom: 6.4 },
  { name: "Punjab", lng: 75.34, lat: 31.14, zoom: 7 },
  { name: "Rajasthan", lng: 74.21, lat: 27.02, zoom: 5.9 },
  { name: "Sikkim", lng: 88.51, lat: 27.53, zoom: 8.5 },
  { name: "Tamil Nadu", lng: 78.65, lat: 11.12, zoom: 6.3 },
  { name: "Telangana", lng: 79.01, lat: 18.11, zoom: 6.6 },
  { name: "Tripura", lng: 91.98, lat: 23.94, zoom: 8 },
  { name: "Uttar Pradesh", lng: 80.94, lat: 26.84, zoom: 6.1 },
  { name: "Uttarakhand", lng: 79.01, lat: 30.06, zoom: 7 },
  { name: "West Bengal", lng: 87.85, lat: 22.98, zoom: 6.4 },
  { name: "Delhi", lng: 77.1, lat: 28.65, zoom: 9.5 },
  { name: "Jammu & Kashmir", lng: 75.34, lat: 33.77, zoom: 6.6 },
  { name: "Ladakh", lng: 77.58, lat: 34.2, zoom: 6.3 },
  { name: "Andaman & Nicobar", lng: 92.75, lat: 11.74, zoom: 6.5 },
];

const now = "2026-08-29T05:25:00Z";

const contribution = (
  hazardType: HazardType,
  decision: 0 | 1,
  confidence: number,
): CompositeContribution => ({
  hazardType,
  decision,
  confidence,
  classification:
    confidence >= DEMO_THRESHOLDS.strongConfidence
      ? "High"
      : confidence >= DEMO_THRESHOLDS.moderateConfidence
        ? "Moderate"
        : "Low",
  color:
    confidence >= DEMO_THRESHOLDS.strongConfidence
      ? "#ef2d2d"
      : confidence >= DEMO_THRESHOLDS.moderateConfidence
        ? "#ff8a1f"
        : "#f5d327",
});

export const DEMO_COMPOSITE_REGIONS: CompositeRegion[] = [
  {
    id: "com-chamoli",
    state: "Uttarakhand",
    district: "Chamoli",
    area: "Chamoli mountain corridor",
    latitude: 30.42,
    longitude: 79.35,
    compositeRiskScore: 91,
    priority: "critical",
    population: 18420,
    affectedPopulation: 6240,
    vulnerablePopulation: 1880,
    hazards: [
      contribution("Landslide", 1, 0.91),
      contribution("Flood", 1, 0.87),
      contribution("Cloudburst", 1, 0.74),
      contribution("Erosion", 0, 0.42),
    ],
    timestamp: now,
    nearbySafeLocationIds: ["safe-chamoli-a", "safe-chamoli-b", "safe-chamoli-c"],
  },
  {
    id: "com-idukki",
    state: "Kerala",
    district: "Idukki",
    area: "Idukki highland belt",
    latitude: 9.85,
    longitude: 76.98,
    compositeRiskScore: 86,
    priority: "critical",
    population: 26750,
    affectedPopulation: 9140,
    vulnerablePopulation: 2700,
    hazards: [
      contribution("Landslide", 1, 0.93),
      contribution("Flood", 1, 0.79),
      contribution("Erosion", 1, 0.68),
    ],
    timestamp: now,
    nearbySafeLocationIds: ["safe-idukki-a", "safe-idukki-b"],
  },
  {
    id: "com-puri",
    state: "Odisha",
    district: "Puri",
    area: "Puri coastal plain",
    latitude: 19.81,
    longitude: 85.83,
    compositeRiskScore: 83,
    priority: "critical",
    population: 119800,
    affectedPopulation: 42200,
    vulnerablePopulation: 9600,
    hazards: [contribution("Cyclone", 1, 0.94), contribution("Flood", 1, 0.81)],
    timestamp: now,
    nearbySafeLocationIds: ["safe-puri-a", "safe-puri-b"],
  },
  {
    id: "com-dibrugarh",
    state: "Assam",
    district: "Dibrugarh",
    area: "Brahmaputra floodplain",
    latitude: 27.47,
    longitude: 94.9,
    compositeRiskScore: 76,
    priority: "high",
    population: 84600,
    affectedPopulation: 28600,
    vulnerablePopulation: 8200,
    hazards: [contribution("Flood", 1, 0.89), contribution("Erosion", 1, 0.71)],
    timestamp: now,
    nearbySafeLocationIds: ["safe-dibrugarh-a", "safe-dibrugarh-b"],
  },
  {
    id: "com-kachchh",
    state: "Gujarat",
    district: "Kachchh",
    area: "Kachchh seismic belt",
    latitude: 23.24,
    longitude: 69.86,
    compositeRiskScore: 62,
    priority: "high",
    population: 51300,
    affectedPopulation: 8800,
    hazards: [contribution("Erosion", 1, 0.65)],
    timestamp: now,
    nearbySafeLocationIds: ["safe-kachchh-a"],
  },
  {
    id: "com-bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban",
    area: "Bengaluru eastern catchment",
    latitude: 12.94,
    longitude: 77.62,
    compositeRiskScore: 48,
    priority: "moderate",
    population: 205000,
    affectedPopulation: 14200,
    hazards: [contribution("Flood", 1, 0.58), contribution("Erosion", 0, 0.31)],
    timestamp: now,
    nearbySafeLocationIds: ["safe-bengaluru-a"],
  },
];

export const DEMO_HAZARD_PREDICTIONS: HazardPrediction[] = [
  {
    id: "pred-chamoli-flood",
    latitude: 30.42,
    longitude: 79.35,
    state: "Uttarakhand",
    district: "Chamoli",
    area: "Chamoli mountain corridor",
    hazardType: "Flood",
    decision: 1,
    confidence: 0.92,
    classification: "Critical",
    color: "#ef2d2d",
    timestamp: now,
    predictedTimeToEvent: "2 hours 18 minutes",
    riskScore: 92,
    population: 18420,
    affectedPopulation: 6240,
    additionalModelOutputs: { rainfallWindow: "6 hours", modelVersion: "flood-demo-v2" },
  },
  {
    id: "pred-chamoli-landslide",
    latitude: 30.39,
    longitude: 79.28,
    state: "Uttarakhand",
    district: "Chamoli",
    area: "Chamoli mountain corridor",
    hazardType: "Landslide",
    decision: 1,
    confidence: 0.91,
    classification: "Critical",
    color: "#ef2d2d",
    timestamp: now,
    riskScore: 91,
    population: 18420,
    affectedPopulation: 5100,
    additionalModelOutputs: { soilSaturation: 0.86, modelVersion: "slope-demo-v1" },
  },
  {
    id: "pred-chamoli-cloudburst",
    latitude: 30.48,
    longitude: 79.4,
    state: "Uttarakhand",
    district: "Chamoli",
    area: "Chamoli mountain corridor",
    hazardType: "Cloudburst",
    decision: 1,
    confidence: 0.74,
    classification: "High",
    color: "#ff8a1f",
    timestamp: now,
    riskScore: 74,
    population: 18420,
    affectedPopulation: 2200,
    additionalModelOutputs: { modelVersion: "rain-demo-v1" },
  },
  {
    id: "pred-idukki-landslide",
    latitude: 9.85,
    longitude: 76.98,
    state: "Kerala",
    district: "Idukki",
    area: "Idukki highland belt",
    hazardType: "Landslide",
    decision: 1,
    confidence: 0.93,
    classification: "Critical",
    color: "#ef2d2d",
    timestamp: now,
    riskScore: 93,
    population: 26750,
    affectedPopulation: 9140,
    additionalModelOutputs: { modelVersion: "slope-demo-v1" },
  },
  {
    id: "pred-puri-cyclone",
    latitude: 19.81,
    longitude: 85.83,
    state: "Odisha",
    district: "Puri",
    area: "Puri coastal plain",
    hazardType: "Cyclone",
    decision: 1,
    confidence: 0.94,
    classification: "Critical",
    color: "#ef2d2d",
    timestamp: now,
    predictedTimeToEvent: "8 hours 40 minutes",
    riskScore: 94,
    population: 119800,
    affectedPopulation: 42200,
    additionalModelOutputs: { modelVersion: "coast-demo-v3" },
  },
  {
    id: "pred-dibrugarh-flood",
    latitude: 27.47,
    longitude: 94.9,
    state: "Assam",
    district: "Dibrugarh",
    area: "Brahmaputra floodplain",
    hazardType: "Flood",
    decision: 1,
    confidence: 0.89,
    classification: "High",
    color: "#ef2d2d",
    timestamp: now,
    predictedTimeToEvent: "14 hours",
    riskScore: 89,
    population: 84600,
    affectedPopulation: 28600,
    additionalModelOutputs: { modelVersion: "flood-demo-v2" },
  },
  {
    id: "pred-bengaluru-flood",
    latitude: 12.94,
    longitude: 77.62,
    state: "Karnataka",
    district: "Bengaluru Urban",
    area: "Bengaluru eastern catchment",
    hazardType: "Flood",
    decision: 1,
    confidence: 0.58,
    classification: "Moderate",
    color: "#f5d327",
    timestamp: now,
    predictedTimeToEvent: "36 hours",
    riskScore: 58,
    population: 205000,
    affectedPopulation: 14200,
    additionalModelOutputs: { modelVersion: "flood-demo-v2" },
  },
];

export const DEMO_SAFE_LOCATIONS: SafeLocation[] = [
  { id: "safe-chamoli-a", name: "Gopeshwar Relief Center", latitude: 30.41, longitude: 79.32, distance: "2.1 km", capacity: 9000, currentOccupancy: 2760, availableCapacity: 6240, riskLevel: "low", availability: "Available" },
  { id: "safe-chamoli-b", name: "District Sports Complex", latitude: 30.43, longitude: 79.37, distance: "3.4 km", capacity: 5200, currentOccupancy: 3100, availableCapacity: 2100, riskLevel: "low", availability: "Available" },
  { id: "safe-chamoli-c", name: "Joshimath Community Hall", latitude: 30.56, longitude: 79.57, distance: "4.2 km", capacity: 4000, currentOccupancy: 3560, availableCapacity: 440, riskLevel: "moderate", availability: "Limited" },
  { id: "safe-idukki-a", name: "Idukki Government College", latitude: 9.86, longitude: 76.97, distance: "2.8 km", capacity: 11000, currentOccupancy: 4700, availableCapacity: 6300, riskLevel: "low", availability: "Available" },
  { id: "safe-idukki-b", name: "Cheruthoni Relief Camp", latitude: 9.84, longitude: 76.99, distance: "4.1 km", capacity: 5000, currentOccupancy: 4800, availableCapacity: 200, riskLevel: "moderate", availability: "Limited" },
  { id: "safe-puri-a", name: "Puri Cyclone Shelter A", latitude: 19.83, longitude: 85.82, distance: "2.1 km", capacity: 18000, currentOccupancy: 6400, availableCapacity: 11600, riskLevel: "low", availability: "Available" },
  { id: "safe-puri-b", name: "Konark Relief Center", latitude: 19.89, longitude: 86.09, distance: "12.4 km", capacity: 9000, currentOccupancy: 7800, availableCapacity: 1200, riskLevel: "low", availability: "Limited" },
  { id: "safe-dibrugarh-a", name: "Dibrugarh Stadium Shelter", latitude: 27.48, longitude: 94.91, distance: "2.6 km", capacity: 20000, currentOccupancy: 8200, availableCapacity: 11800, riskLevel: "low", availability: "Available" },
  { id: "safe-dibrugarh-b", name: "Naharkatia Relief Center", latitude: 27.29, longitude: 95.34, distance: "18.2 km", capacity: 9000, currentOccupancy: 8400, availableCapacity: 600, riskLevel: "moderate", availability: "Limited" },
  { id: "safe-kachchh-a", name: "Bhuj Civic Shelter", latitude: 23.25, longitude: 69.67, distance: "16.5 km", capacity: 12000, currentOccupancy: 4000, availableCapacity: 8000, riskLevel: "low", availability: "Available" },
  { id: "safe-bengaluru-a", name: "Mahadevapura Community Center", latitude: 12.99, longitude: 77.7, distance: "5.4 km", capacity: 6000, currentOccupancy: 2200, availableCapacity: 3800, riskLevel: "low", availability: "Available" },
];

export const RISK_META: Record<RiskLevel, { label: string; color: string }> = {
  critical: { label: "Critical red zone", color: "#ef2d2d" },
  high: { label: "High risk", color: "#ff8a1f" },
  moderate: { label: "Lower priority", color: "#f5d327" },
};

export const HAZARD_TYPES: HazardType[] = ["Flood", "Landslide", "Erosion", "Cloudburst", "Cyclone"];

export function computePriority(score: number): RiskLevel {
  if (score >= DEMO_THRESHOLDS.criticalRisk) return "critical";
  if (score >= DEMO_THRESHOLDS.highRisk) return "high";
  return "moderate";
}

/** Demo-only composite logic. Replace this configurable weighting when methodology is supplied. */
export function computeCompositeRisk(region: CompositeRegion): number {
  const positives = region.hazards.filter((hazard) => hazard.decision === DEMO_THRESHOLDS.positiveDecision);
  const hazardSignal = positives.length === 0 ? 0 : positives.reduce((total, hazard) => total + hazard.confidence, 0) / positives.length;
  const populationSignal = Math.min(region.affectedPopulation / Math.max(region.population, 1), 1);
  return Math.round(Math.min(100, hazardSignal * 70 + populationSignal * 30));
}

export function updateDemoData(predictions: HazardPrediction[], regions: CompositeRegion[], tick: number) {
  const shift = tick % 2 === 0 ? 0.015 : -0.01;
  const nextPredictions = predictions.map((prediction) => {
    const confidence = Math.max(0.3, Math.min(0.98, prediction.confidence + shift));
    return { ...prediction, confidence, riskScore: Math.round(confidence * 100), timestamp: new Date().toISOString() };
  });
  const nextRegions = regions.map((region) => {
    const compositeRiskScore = Math.max(0, Math.min(100, region.compositeRiskScore + (tick % 2 === 0 ? 1 : -1)));
    return { ...region, compositeRiskScore, priority: computePriority(compositeRiskScore), timestamp: new Date().toISOString() };
  });
  return { predictions: nextPredictions, regions: nextRegions, updatedAt: new Date().toISOString() };
}