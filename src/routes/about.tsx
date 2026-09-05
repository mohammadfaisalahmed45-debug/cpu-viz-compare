import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, GitCompareArrows, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — CPU Scheduling Visualizer" },
      {
        name: "description",
        content:
          "Designing an Algorithm Visualizer for CPU Scheduling Algorithms: project purpose, modules and learning objectives.",
      },
      { property: "og:title", content: "About the Project — CPU Scheduling Visualizer" },
      {
        property: "og:description",
        content: "Purpose, modules and learning objectives of this academic CPU scheduling project.",
      },
    ],
  }),
  component: AboutPage,
});

const OBJECTIVES = [
  "Understand core CPU scheduling concepts.",
  "Visualize scheduling behaviour using Gantt charts.",
  "Calculate scheduling performance metrics.",
  "Compare different scheduling algorithms on the same workload.",
  "Understand the difference between preemptive and non-preemptive scheduling.",
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="About the Project"
        description="Academic project overview, modules and learning objectives."
      />

      <Card>
        <CardHeader>
          <CardTitle>Designing Algorithm Visualizer for CPU Scheduling Algorithms</CardTitle>
          <CardDescription>Project title</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-sm font-semibold text-foreground">Purpose</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This project provides an interactive visualization and comparative analysis platform for
            CPU scheduling algorithms. It helps users understand how scheduling decisions affect
            waiting time, turnaround time, CPU utilization, and overall performance.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              Module 1
            </Badge>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-5 text-primary" /> Algorithm Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Enter a process set, choose one algorithm, and inspect the generated Gantt chart,
            per-process results and performance metrics.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              Module 2
            </Badge>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitCompareArrows className="size-5 text-primary" /> Comparative Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Run two or more algorithms on the same workload and compare Gantt charts, summary tables
            and performance charts side by side.
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="size-5 text-primary" /> Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {OBJECTIVES.map((o) => (
              <li key={o}>• {o}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
