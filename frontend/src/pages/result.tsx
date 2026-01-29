import { useAppSelector } from "@/app/hooks";
import AiSuggestionCard from "@/components/ai-suggestion-card";
import { GrowingConditionCard } from "@/components/growing-condition-card";
import ResultCard from "@/components/result-card";
import ResultChart from "@/components/result-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { buildGrowingConditions } from "@/lib/growing-conditions";
import type { PredictionRequest } from "@/types";
import { Leaf } from "lucide-react";
import { Navigate, useLocation } from "react-router";

const Result = () => {
  const formData: PredictionRequest = useLocation().state.formData;
  const { predication, error, loading } = useAppSelector(
    (state) => state.predictionReducer,
  );

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader size="xl" text="Analyzing your crop data..." />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!formData || predication == null) return <Navigate to="/predict" />;

  const growingConditions = buildGrowingConditions(predication);
  const lastYearYield =
    predication.last_four_years_yield ?
      Object.values(predication.last_four_years_yield).pop() || 0
    : 0;
  console.log({ predication, formData });
  return (
    <div className="space-y-6 m-6">
      <ResultCard
        state={formData.state}
        district={formData.district}
        area={formData.area_ha}
        crop={formData.crop}
        lastYearYield={lastYearYield}
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

      <AiSuggestionCard requestData={formData} responseData={predication} />
    </div>
  );
};

export default Result;
