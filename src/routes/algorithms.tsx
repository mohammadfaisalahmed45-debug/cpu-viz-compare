import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ALGORITHM_INFO } from "@/lib/scheduling/algorithm-info";
import { CheckCircle2, Target, XCircle } from "lucide-react";

export const Route = createFileRoute("/algorithms")({
  head: () => ({
    meta: [
      { title: "Algorithm Information — CPU Scheduling Visualizer" },
      {
        name: "description",
        content:
          "Detailed reference for FCFS, SJF, SRTF, Priority Scheduling and Round Robin: working principle, advantages, disadvantages and use cases.",
      },
      { property: "og:title", content: "Algorithm Information — CPU Scheduling Visualizer" },
      {
        property: "og:description",
        content: "Working principles, advantages and trade-offs of five CPU scheduling algorithms.",
      },
    ],
  }),
  component: AlgorithmsPage,
});

function AlgorithmsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Algorithm Information"
        description="Reference material for each supported CPU scheduling algorithm."
      />
      <div className="space-y-6">
        {ALGORITHM_INFO.map((info) => (
          <Card key={info.key} id={info.key} className="scroll-mt-24">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{info.name}</CardTitle>
                <Badge variant={info.preemptive === "Preemptive" ? "default" : "secondary"}>
                  {info.preemptive}
                </Badge>
                <Badge variant="outline">{info.short}</Badge>
              </div>
              <CardDescription>{info.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Working principle</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{info.principle}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="size-4 text-success" /> Advantages
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {info.advantages.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <XCircle className="size-4 text-destructive" /> Disadvantages
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {info.disadvantages.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Target className="size-4 text-primary" /> Suitable use cases
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {info.useCases.map((u) => (
                      <li key={u}>• {u}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Key characteristics</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {info.characteristics.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
