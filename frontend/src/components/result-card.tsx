import { Card, CardContent } from "@/components/ui/card";
import type { Season } from "@/types";

type props = {
  state: string;
  district: string;
  crop: string;
  area: number;
  lastYearYield: number;
  season: Season;
  prediction: number;
};

const ResultCard = ({
  state,
  district,
  crop,
  area,
  lastYearYield,
  season,
  prediction,
}: props) => {
  const yearOverYearComparison =
    lastYearYield > 0 ?
      ((prediction - lastYearYield) / lastYearYield) * 100
    : 0;
  const totalProduction = area * prediction;

  console.log({ prediction, lastYearYield });
  console.log({ yearOverYearComparison, totalProduction, area, prediction });

  return (
    <Card>
      <div className="bg-secondary p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-secondary-foreground/80 text-sm mb-1">
              Predicted Yield for
            </p>
            <h2 className="text-2xl font-bold text-secondary-foreground">
              {crop} in {district}, {state}
            </h2>
            <p className="text-secondary-foreground/70 text-sm mt-1">
              Season: {season}
            </p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground mb-1">
              Predicted Yield
            </p>
            <p className="text-4xl font-bold text-accent">
              {prediction.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">quintals/hectare</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground mb-1">vs Last Year</p>
            <p className="text-2xl font-bold text-chart-3">
              {yearOverYearComparison > 0 ? "+" : ""}
              {yearOverYearComparison.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {yearOverYearComparison > 0 ? "higher" : "lower"} yield expected
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground mb-1">
              Est. Total Production
            </p>
            <p className="text-2xl font-bold text-chart-3">
              {totalProduction.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">quintals {area} ha</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
