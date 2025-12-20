import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface GrowingConditionCardProps {
  label: string;
  value: string;
  message: string;
  icon: LucideIcon;
}

export function GrowingConditionCard({
  label,
  value,
  message,
  icon: Icon,
}: GrowingConditionCardProps) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-card-foreground">
                {label}
              </span>
              <Badge variant="secondary" className="text-xs">
                {value}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
