import { useAppSelector } from "@/app/hooks";
import { GrowingConditionCard } from "@/components/growingConditionCard";
import ResultCard from "@/components/resultCard";
import ResultChart from "@/components/resultChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildGrowingConditions } from "@/lib/growing-conditions";
import type { PredictionRequest } from "@/types";
import { Leaf } from "lucide-react";
import { Navigate, useLocation } from "react-router";

const Result = () => {
  const formData: PredictionRequest = useLocation().state;
  const { predication, error, loading } = useAppSelector(
    (state) => state.predictionReducer
  );
  const lastYear = new Date().getFullYear() - 1;

  if (loading) return <div className="h-screen w-screen">Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!formData || predication == null) return <Navigate to="/predict" />;

  const growingConditions = buildGrowingConditions(predication);
  return (
    <div className="space-y-6">
      <ResultCard
        state={formData.state}
        district={formData.district}
        area={formData.area_ha}
        crop={formData.crop}
        lastYearYield={predication.last_four_years_yield[String(lastYear)]}
        prediction={predication.predicted_yield_qha}
        season={formData.season}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultChart
          lastFourYearsYield={predication.last_four_years_yield}
          predicatedYield={predication.predicted_yield_qha}
        />
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Leaf className="h-5 w-5 text-chart-3" />
              Your Growing Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {growingConditions.map((condition, index) => (
              <GrowingConditionCard key={index} {...condition} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Result;
