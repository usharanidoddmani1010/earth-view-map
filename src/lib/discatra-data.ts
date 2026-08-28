export type RiskLevel = "critical" | "high" | "moderate";

export interface RiskZone {
  id: string;
  name: string;
  state: string;
  district: string;
  hazard: string;
  level: RiskLevel;
  lng: number;
  lat: number;
  /** relative heat weight 0-1 */
  weight: number;
}

export interface StateEntry {
  name: string;
  lng: number;
  lat: number;
  zoom: number;
}

/** Real coordinates so zoom-to-state lands on the actual terrain. */
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

/** Sample hazard observations. Deliberately localised — never whole-state fills. */
export const RISK_ZONES: RiskZone[] = [
  { id: "kl-idk", name: "Idukki landslide belt", state: "Kerala", district: "Idukki", hazard: "Landslide", level: "critical", lng: 76.98, lat: 9.85, weight: 1 },
  { id: "kl-wyd", name: "Wayanad slope failure", state: "Kerala", district: "Wayanad", hazard: "Landslide", level: "high", lng: 76.13, lat: 11.61, weight: 0.8 },
  { id: "ka-kdg", name: "Kodagu flood pocket", state: "Karnataka", district: "Kodagu", hazard: "Flood", level: "high", lng: 75.81, lat: 12.42, weight: 0.75 },
  { id: "ka-blr", name: "Bengaluru urban flooding", state: "Karnataka", district: "Bengaluru Urban", hazard: "Urban flood", level: "moderate", lng: 77.62, lat: 12.94, weight: 0.5 },
  { id: "ka-rai", name: "Raichur heat stress", state: "Karnataka", district: "Raichur", hazard: "Heatwave", level: "moderate", lng: 77.35, lat: 16.2, weight: 0.45 },
  { id: "uk-chm", name: "Chamoli glacial hazard", state: "Uttarakhand", district: "Chamoli", hazard: "GLOF", level: "critical", lng: 79.35, lat: 30.42, weight: 1 },
  { id: "uk-rud", name: "Rudraprayag cloudburst zone", state: "Uttarakhand", district: "Rudraprayag", hazard: "Cloudburst", level: "high", lng: 78.98, lat: 30.29, weight: 0.8 },
  { id: "hp-kin", name: "Kinnaur rockfall corridor", state: "Himachal Pradesh", district: "Kinnaur", hazard: "Rockfall", level: "high", lng: 78.44, lat: 31.58, weight: 0.7 },
  { id: "as-dbr", name: "Dibrugarh Brahmaputra flood", state: "Assam", district: "Dibrugarh", hazard: "Flood", level: "critical", lng: 94.9, lat: 27.47, weight: 0.95 },
  { id: "as-brp", name: "Barpeta inundation", state: "Assam", district: "Barpeta", hazard: "Flood", level: "high", lng: 91.0, lat: 26.32, weight: 0.8 },
  { id: "br-drb", name: "Darbhanga Kosi flood", state: "Bihar", district: "Darbhanga", hazard: "Flood", level: "critical", lng: 85.9, lat: 26.15, weight: 0.9 },
  { id: "od-pur", name: "Puri cyclone landfall", state: "Odisha", district: "Puri", hazard: "Cyclone", level: "critical", lng: 85.83, lat: 19.81, weight: 1 },
  { id: "wb-sun", name: "Sundarbans surge zone", state: "West Bengal", district: "South 24 Parganas", hazard: "Storm surge", level: "high", lng: 88.7, lat: 21.95, weight: 0.85 },
  { id: "gj-kch", name: "Kachchh seismic zone V", state: "Gujarat", district: "Kachchh", hazard: "Earthquake", level: "high", lng: 69.86, lat: 23.24, weight: 0.75 },
  { id: "mh-ltr", name: "Latur drought cluster", state: "Maharashtra", district: "Latur", hazard: "Drought", level: "moderate", lng: 76.56, lat: 18.4, weight: 0.5 },
  { id: "mh-rtg", name: "Ratnagiri coastal erosion", state: "Maharashtra", district: "Ratnagiri", hazard: "Erosion", level: "moderate", lng: 73.31, lat: 16.99, weight: 0.45 },
  { id: "rj-bmr", name: "Barmer extreme heat", state: "Rajasthan", district: "Barmer", hazard: "Heatwave", level: "high", lng: 71.39, lat: 25.75, weight: 0.7 },
  { id: "tn-cud", name: "Cuddalore cyclone track", state: "Tamil Nadu", district: "Cuddalore", hazard: "Cyclone", level: "high", lng: 79.76, lat: 11.75, weight: 0.75 },
  { id: "tn-nlg", name: "Nilgiris landslide", state: "Tamil Nadu", district: "Nilgiris", hazard: "Landslide", level: "moderate", lng: 76.7, lat: 11.41, weight: 0.5 },
  { id: "up-gor", name: "Gorakhpur Rapti flood", state: "Uttar Pradesh", district: "Gorakhpur", hazard: "Flood", level: "high", lng: 83.37, lat: 26.76, weight: 0.8 },
  { id: "sk-nsk", name: "North Sikkim GLOF", state: "Sikkim", district: "Mangan", hazard: "GLOF", level: "critical", lng: 88.53, lat: 27.72, weight: 0.9 },
  { id: "an-nic", name: "Nicobar tsunami exposure", state: "Andaman & Nicobar", district: "Nicobar", hazard: "Tsunami", level: "high", lng: 93.6, lat: 7.9, weight: 0.8 },
];

export const RISK_META: Record<RiskLevel, { label: string; color: string }> = {
  critical: { label: "Critical red zone", color: "#ef2d2d" },
  high: { label: "High risk", color: "#ff8a1f" },
  moderate: { label: "Lower priority", color: "#f5d327" },
};

export const riskGeoJSON = () => ({
  type: "FeatureCollection" as const,
  features: RISK_ZONES.map((z) => ({
    type: "Feature" as const,
    id: z.id,
    geometry: { type: "Point" as const, coordinates: [z.lng, z.lat] },
    properties: {
      id: z.id,
      name: z.name,
      state: z.state,
      district: z.district,
      hazard: z.hazard,
      level: z.level,
      weight: z.weight,
      color: RISK_META[z.level].color,
      radius: z.level === "critical" ? 26000 : z.level === "high" ? 18000 : 12000,
    },
  })),
});
