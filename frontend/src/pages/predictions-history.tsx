import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, MapPin, Thermometer, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

// Full prediction history (mock data aligned with DB entity)
const allPredictions = [
  {
    id: 1,
    predictedYieldQha: 42.5,
    modelUsed: "XGBoost Regressor",
    predictionDate: "2026-01-15T10:30:00",
    weather: { avgTemp: 26.5, humidityAvg: 68, rainTotal: 120, solarAvg: 5.2 },
    soil: {
      soilPh: 6.8,
      soilOc: 0.65,
      clayPct: 28,
      sandPct: 42,
      cecCmol: 15.2,
    },
    cropName: "Rice",
    location: "Ludhiana, Punjab",
  },
  {
    id: 2,
    predictedYieldQha: 38.0,
    modelUsed: "Random Forest",
    predictionDate: "2026-01-10T14:15:00",
    weather: { avgTemp: 18.2, humidityAvg: 55, rainTotal: 45, solarAvg: 4.8 },
    soil: {
      soilPh: 7.2,
      soilOc: 0.58,
      clayPct: 32,
      sandPct: 38,
      cecCmol: 14.5,
    },
    cropName: "Wheat",
    location: "Karnal, Haryana",
  },
  {
    id: 3,
    predictedYieldQha: 29.0,
    modelUsed: "XGBoost Regressor",
    predictionDate: "2025-12-28T09:45:00",
    weather: { avgTemp: 30.1, humidityAvg: 72, rainTotal: 180, solarAvg: 5.8 },
    soil: {
      soilPh: 6.5,
      soilOc: 0.72,
      clayPct: 25,
      sandPct: 45,
      cecCmol: 12.8,
    },
    cropName: "Maize",
    location: "Nashik, Maharashtra",
  },
  {
    id: 4,
    predictedYieldQha: 35.2,
    modelUsed: "Random Forest",
    predictionDate: "2025-12-15T11:20:00",
    weather: { avgTemp: 22.8, humidityAvg: 60, rainTotal: 80, solarAvg: 5.0 },
    soil: {
      soilPh: 7.0,
      soilOc: 0.62,
      clayPct: 30,
      sandPct: 40,
      cecCmol: 14.0,
    },
    cropName: "Sugarcane",
    location: "Meerut, Uttar Pradesh",
  },
  {
    id: 5,
    predictedYieldQha: 22.5,
    modelUsed: "XGBoost Regressor",
    predictionDate: "2025-12-01T08:00:00",
    weather: { avgTemp: 28.5, humidityAvg: 65, rainTotal: 95, solarAvg: 5.5 },
    soil: { soilPh: 6.2, soilOc: 0.7, clayPct: 22, sandPct: 48, cecCmol: 11.5 },
    cropName: "Cotton",
    location: "Surat, Gujarat",
  },
  {
    id: 6,
    predictedYieldQha: 40.0,
    modelUsed: "Random Forest",
    predictionDate: "2025-11-20T15:30:00",
    weather: { avgTemp: 20.0, humidityAvg: 58, rainTotal: 50, solarAvg: 4.5 },
    soil: {
      soilPh: 7.5,
      soilOc: 0.55,
      clayPct: 35,
      sandPct: 35,
      cecCmol: 15.0,
    },
    cropName: "Wheat",
    location: "Amritsar, Punjab",
  },
];

const PredictionsHistory = () => {
  // const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await dispatch(logout());
  //   navigate("/");
  // };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-8">
        {/* Back Button & Title */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2 text-[#5c4631] hover:bg-[#E8E1D4] mb-4"
            onClick={() => navigate("/user-dashboard")}
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D241E]">
            📋 All Predictions
          </h1>
          <p className="text-[#6B7280] mt-1">
            Your complete prediction history ({allPredictions.length} total)
          </p>
        </div>

        {/* All Predictions List */}
        <div className="space-y-4">
          {allPredictions.map((prediction) => (
            <Card
              key={prediction.id}
              className="bg-white border-[#E0D6C8] hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-[#2D241E] flex items-center justify-between">
                  <span>🌾 {prediction.cropName}</span>
                  <span className="text-sm font-normal text-[#6B7280]">
                    {new Date(prediction.predictionDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-[#5c4631]">
                  <MapPin className="size-4 text-[#A67C52]" />
                  <span>{prediction.location}</span>
                </div>

                {/* Predicted Yield */}
                <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-5 text-[#059669]" />
                      <span className="text-sm text-[#166534]">
                        Predicted Yield
                      </span>
                    </div>
                    <span className="font-bold text-[#059669] text-xl">
                      {prediction.predictedYieldQha} q/ha
                    </span>
                  </div>
                </div>

                {/* Weather & Soil Summary */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#FEF3C7] rounded-lg p-2">
                    <div className="flex items-center gap-1 text-[#92400E]">
                      <Thermometer className="size-3" />
                      <span className="font-medium">Weather</span>
                    </div>
                    <p className="text-[#78350F] text-xs mt-1">
                      {prediction.weather.avgTemp}°C •{" "}
                      {prediction.weather.humidityAvg}% humidity
                    </p>
                  </div>
                  <div className="bg-[#FEF2F2] rounded-lg p-2">
                    <div className="flex items-center gap-1 text-[#991B1B]">
                      <Leaf className="size-3" />
                      <span className="font-medium">Soil</span>
                    </div>
                    <p className="text-[#7F1D1D] text-xs mt-1">
                      pH {prediction.soil.soilPh} • {prediction.soil.clayPct}%
                      clay
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280]">
                  Model: {prediction.modelUsed}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-[#E0D6C8] mt-8">
        <p className="text-[#6B7280] text-sm">
          🌾 Helping Farmers Grow Better | © 2025
        </p>
      </div>
    </div>
  );
};

export default PredictionsHistory;
