import { Card, CardContent } from "@/components/ui/card";
import type { SchedulingMetrics } from "@/lib/scheduling/types";
import { fmt } from "@/lib/scheduling/validation";
import { Activity, Clock, Gauge, PauseCircle, Timer } from "lucide-react";

export function PerformanceSummary({ metrics }: { metrics: SchedulingMetrics }) {
  const items = [
    { label: "Avg. Waiting Time", value: fmt(metrics.avgWaitingTime), icon: Clock },
    { label: "Avg. Turnaround Time", value: fmt(metrics.avgTurnaroundTime), icon: Timer },
    { label: "CPU Idle Time", value: String(metrics.idleTime), icon: PauseCircle },
    { label: "CPU Utilization", value: `${fmt(metrics.cpuUtilization)}%`, icon: Gauge },
    { label: "Throughput", value: `${fmt(metrics.throughput, 3)} /unit`, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <item.icon className="size-3.5" />
              <span className="truncate">{item.label}</span>
            </div>
            <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
