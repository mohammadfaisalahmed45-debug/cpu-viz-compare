import { createFileRoute, Link } from "@tanstack/react-router";
import { AlgorithmCard } from "@/components/scheduling/AlgorithmCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ALGORITHM_INFO } from "@/lib/scheduling/algorithm-info";
import { BarChart3, GitCompareArrows, Layers, LineChart, Repeat } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CPU Scheduling Algorithm Visualizer & Comparative Analysis" },
      {
        name: "description",
        content:
          "An interactive tool for visualizing CPU scheduling algorithms (FCFS, SJF, SRTF, Priority, Round Robin) and comparing their performance with Gantt charts.",
      },
      { property: "og:title", content: "CPU Scheduling Algorithm Visualizer" },
      {
        property: "og:description",
        content:
          "Visualize, analyze and compare CPU scheduling algorithms with Gantt charts and performance metrics.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Supported Algorithms", value: "5", icon: Layers },
  { label: "Scheduling Type", value: "Preemptive & Non-Preemptive", icon: Repeat },
  { label: "Visualization", value: "Gantt Chart", icon: BarChart3 },
  { label: "Analysis", value: "Performance Comparison", icon: LineChart },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="rounded-xl border border-border bg-card p-6 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          CPU Scheduling Algorithm Visualizer
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          An interactive tool for visualizing CPU scheduling algorithms and comparing their
          performance.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/visualizer">
              <BarChart3 className="mr-2 size-5" /> Visualize Algorithm
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/compare">
              <GitCompareArrows className="mr-2 size-5" /> Compare Algorithms
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <s.icon className="size-5 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Supported Algorithms
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Five classic CPU scheduling strategies, fully implemented and calculated in the browser.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALGORITHM_INFO.map((info) => (
            <AlgorithmCard key={info.key} info={info} />
          ))}
        </div>
      </section>
    </div>
  );
}
