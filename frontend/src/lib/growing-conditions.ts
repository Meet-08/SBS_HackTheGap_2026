import type { Prediction } from "@/types";
import { CloudRain, Leaf, Sun, Thermometer } from "lucide-react";

export function buildGrowingConditions(prediction: Prediction) {
  const { weather, soil } = prediction;

  return [
    {
      label: "Temperature",
      value: `${weather.avg_temp.toFixed(1)}°C`,
      message:
        weather.avg_temp >= 20 && weather.avg_temp <= 30
          ? "Temperature is within the optimal range for crop growth."
          : "Temperature is outside the optimal range and may affect growth.",
      icon: Thermometer,
    },
    {
      label: "Rainfall",
      value: `${weather.rain_total.toFixed(0)} mm`,
      message:
        weather.rain_total >= 600
          ? "Expected rainfall is sufficient for normal crop development."
          : "Expected rainfall is lower than ideal; irrigation may be required.",
      icon: CloudRain,
    },
    {
      label: "Soil pH",
      value: soil.soil_ph.toFixed(1),
      message:
        soil.soil_ph >= 6.5 && soil.soil_ph <= 7.5
          ? "Soil pH is well suited for nutrient availability."
          : "Soil pH may limit nutrient uptake and should be corrected.",
      icon: Leaf,
    },
    {
      label: "Sunlight",
      value: `${weather.solar_avg.toFixed(1)} MJ/m²`,
      message:
        weather.solar_avg >= 15
          ? "Adequate solar radiation is expected during the growing period."
          : "Lower solar radiation may reduce photosynthesis efficiency.",
      icon: Sun,
    },
  ];
}
