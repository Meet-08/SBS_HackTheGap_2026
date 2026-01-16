import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataSources } from "@/lib/constants";
import { TrendingUp } from "lucide-react";

export default function DataSourcesSection() {
  return (
    <section className="py-20 bg-[#FAF7F2] ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#2D2A26] mb-3 text-balance">
            Trusted Data Sources
          </h2>
          <p className="text-[#888] text-xl">
            We integrate data from reliable, authoritative sources to ensure
            accurate predictions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {dataSources.map((source, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <source.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">
                  {source.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {source.description}
                </p>
                <ul className="space-y-2">
                  {source.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-muted-foreground mt-4"
                    >
                      <TrendingUp className="h-5 w-5 text-chart-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
