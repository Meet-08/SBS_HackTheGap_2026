import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type props = {
  predicatedYield: number;
  lastFourYearsYield: Record<string, number>;
};

const ResultChart = ({ lastFourYearsYield, predicatedYield }: props) => {
  const historicalData = Object.entries(lastFourYearsYield)
    .map(([year, yieldValue]) => ({
      year,
      yield: yieldValue,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Historical Comparison
        </CardTitle>
        <CardDescription>Yield trend over the past 4 years</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
              <XAxis dataKey="year" tick={{ fill: "#2A1F1A", fontSize: 12 }} />
              <YAxis
                dataKey="yield"
                tick={{ fill: "#2A1F1A", fontSize: 12 }}
                domain={[18, Math.ceil(predicatedYield + 5)]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F3EEE5",
                  border: "1px solid #D3D1CD",
                  borderRadius: "10px",
                }}
              />
              <Bar dataKey="yield" fill="#D8A540" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultChart;
