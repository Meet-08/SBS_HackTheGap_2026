export type Season = "KHARIF" | "RABI" | "WHOLE_YEAR";

export interface PredictionRequest {
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  season: Season;
  year: number;
  crop: string;
  area_ha: number;
}

export interface WeatherData {
  avg_temp: number;
  humidity_avg: number;
  rain_total: number;
  solar_avg: number;
}

export interface SoilData {
  soil_ph: number;
  soil_oc: number;
  clay_pct: number;
  sand_pct: number;
  cec_cmol: number;
}

export interface Prediction {
  predicted_yield_qha: number;
  model_used: string;
  weather: WeatherData;
  soil: SoilData;
  last_four_years_yield: Record<string, number>;
}

export interface AiResponse {
  optimalIrrigationStrategy: string;
  soilHealthManagement: string;
  temperatureAndClimateAdaptation: string;
  nutrientManagementPlan: string;
}

export const TITLE_MAP: Record<keyof AiResponse, string> = {
  optimalIrrigationStrategy: "Optimal Irrigation Strategy",
  soilHealthManagement: "Soil Health Management",
  temperatureAndClimateAdaptation: "Temperature & Climate Adaptation",
  nutrientManagementPlan: "Nutrient Management Plan",
};
