import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CloudRain,
  Home,
  Leaf,
  MapPin,
  Sprout,
  Sun,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";

// Static data aligned with DB Prediction entity
const recentPredictions = [
  {
    id: 1,
    predictedYieldQha: 42.5,
    modelUsed: "XGBoost Regressor",
    predictionDate: "2026-01-15T10:30:00",
    weather: {
      avgTemp: 26.5,
      humidityAvg: 68,
      rainTotal: 120,
      solarAvg: 5.2,
    },
    soil: {
      soilPh: 6.8,
      soilOc: 0.65,
      clayPct: 28,
      sandPct: 42,
      cecCmol: 15.2,
    },
    // Display-friendly fields
    cropName: "Rice",
    location: "Ludhiana, Punjab",
  },
  {
    id: 2,
    predictedYieldQha: 38.0,
    modelUsed: "Random Forest",
    predictionDate: "2026-01-10T14:15:00",
    weather: {
      avgTemp: 18.2,
      humidityAvg: 55,
      rainTotal: 45,
      solarAvg: 4.8,
    },
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
    weather: {
      avgTemp: 30.1,
      humidityAvg: 72,
      rainTotal: 180,
      solarAvg: 5.8,
    },
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
];

// Current weather from latest prediction
const weatherInfo = {
  temp: "27°C",
  humidity: "68%",
  rainfall: "120mm",
  solar: "5.2 kWh",
};

const UserDashboard = () => {
  // const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await dispatch(logout());
  //   navigate("/");
  // };

  const firstName = user?.firstName || "Farmer";

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#758D45] to-[#5c7238] rounded-2xl p-6 md:p-8 mb-6 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            🌾 Namaste, {firstName}!
          </h1>
          <p className="text-white/90 text-base md:text-lg">
            Ready to check your crops today? Let's get started.
          </p>
          <Button
            className="mt-4 bg-white text-[#5c4631] hover:bg-[#F5F1E6] font-bold gap-2 px-6 py-5 text-base"
            onClick={() => navigate("/predict")}
          >
            <Sprout className="size-5" />
            New Crop Prediction
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Weather & Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="bg-linear-to-br from-[#FFF8E7] to-[#FFE4B5] border-[#F5DEB3]">
            <CardContent className="p-4 text-center">
              <Sun className="size-8 text-[#D97706] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#92400E]">
                {weatherInfo.temp}
              </p>
              <p className="text-sm text-[#A16207]">Today's Temp</p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-[#E0F2FE] to-[#BAE6FD] border-[#7DD3FC]">
            <CardContent className="p-4 text-center">
              <CloudRain className="size-8 text-[#0284C7] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#0369A1]">
                {weatherInfo.humidity}
              </p>
              <p className="text-sm text-[#0369A1]">Humidity</p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-[#ECFDF5] to-[#D1FAE5] border-[#6EE7B7]">
            <CardContent className="p-4 text-center">
              <Leaf className="size-8 text-[#059669] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#047857]">3</p>
              <p className="text-sm text-[#059669]">Predictions</p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-[#FEF3C7] to-[#FDE68A] border-[#FCD34D]">
            <CardContent className="p-4 text-center">
              <TrendingUp className="size-8 text-[#B45309] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#92400E]">Good</p>
              <p className="text-sm text-[#B45309]">Season</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions - Show last 3 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#2D241E] flex items-center gap-2">
              📋 Recent Predictions
            </h2>
            <Button
              variant="ghost"
              className="text-[#758D45] hover:text-[#5c7238] hover:bg-[#E8E1D4] gap-1"
              onClick={() => navigate("/predictions")}
            >
              View All
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentPredictions.map((prediction) => (
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

                  {/* Predicted Yield - Main highlight */}
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

                  {/* Model Used */}
                  <p className="text-xs text-[#6B7280]">
                    Model: {prediction.modelUsed}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div
            className="bg-white border border-[#E0D6C8] rounded-xl p-4 text-center cursor-pointer hover:shadow-md hover:border-[#758D45] transition-all"
            onClick={() => navigate("/predict")}
          >
            <Sprout className="size-8 text-[#758D45] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2D241E]">New Prediction</p>
          </div>
          <div
            className="bg-white border border-[#E0D6C8] rounded-xl p-4 text-center cursor-pointer hover:shadow-md hover:border-[#758D45] transition-all"
            onClick={() => navigate("/predictions")}
          >
            <TrendingUp className="size-8 text-[#C85C32] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2D241E]">All History</p>
          </div>
          <div
            className="bg-white border border-[#E0D6C8] rounded-xl p-4 text-center cursor-pointer hover:shadow-md hover:border-[#758D45] transition-all"
            onClick={() => navigate("/")}
          >
            <Home className="size-8 text-[#D8A540] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2D241E]">Home</p>
          </div>
          <div className="bg-white border border-[#E0D6C8] rounded-xl p-4 text-center">
            <Leaf className="size-8 text-[#059669] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2D241E]">
              {recentPredictions.length} Predictions
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="bg-[#C85C32] hover:bg-[#A84A28] text-white font-bold gap-3 py-6 text-lg"
            onClick={() => navigate("/predict")}
          >
            <Sprout className="size-6" />
            Check New Crop Yield
          </Button>
          <Button
            variant="outline"
            className="border-2 border-[#758D45] text-[#758D45] hover:bg-[#758D45] hover:text-white font-bold gap-3 py-6 text-lg"
            onClick={() => navigate("/")}
          >
            <Home className="size-6" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center py-4 border-t border-[#E0D6C8] mt-8">
        <p className="text-[#6B7280] text-sm">
          🌾 Helping Farmers Grow Better | © 2025
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
