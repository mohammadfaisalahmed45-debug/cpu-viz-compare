import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/AppLayout";
import { AlgorithmSelector } from "@/components/scheduling/AlgorithmSelector";
import { ComparisonChart } from "@/components/scheduling/ComparisonChart";
import { GanttChart } from "@/components/scheduling/GanttChart";
import { ProcessInputTable } from "@/components/scheduling/ProcessInputTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProcessDrafts } from "@/hooks/useProcessDrafts";
import { getInfo } from "@/lib/scheduling/algorithm-info";
import { runAlgorithm } from "@/lib/scheduling/algorithms";
import type { AlgorithmKey, ComparisonResult } from "@/lib/scheduling/types";
import { fmt, validate } from "@/lib/scheduling/validation";
import { AlertCircle, Eraser, GitCompareArrows, Trophy } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Comparative Analysis — CPU Scheduling Visualizer" },
      {
        name: "description",
        content:
          "Run two or more CPU scheduling algorithms on the same process set and compare waiting time, turnaround time, idle time and CPU utilization.",
      },
      { property: "og:title", content: "Comparative Analysis — CPU Scheduling Visualizer" },
      {
        property: "og:description",
        content: "Side-by-side Gantt charts and performance charts for the same workload.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { drafts, update, add, remove, loadExample, clear } = useProcessDrafts();
  const [selected, setSelected] = useState<AlgorithmKey[]>(["FCFS", "SJF"]);
  const [quantum, setQuantum] = useState("2");
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<ComparisonResult[] | null>(null);
  const [processIds, setProcessIds] = useState<string[]>([]);

  const showQuantum = selected.includes("RR");

  const toggle = (key: AlgorithmKey, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, key] : prev.filter((k) => k !== key)));

  const handleCompare = () => {
    const { errors: found, processes } = validate(drafts, {
      quantum,
      requireQuantum: showQuantum,
    });
    const all = [...found];
    if (selected.length < 2) all.push("Select at least two algorithms to compare.");
    setErrors(all);
    if (all.length) {
      setResults(null);
      return;
    }
    setProcessIds(processes.map((p) => p.id));
    setResults(
      selected.map((key) => ({
        algorithm: key,
        label: getInfo(key).short,
        result: runAlgorithm(key, processes, Number(quantum)),
      })),
    );
  };

  const best = results?.length
    ? {
        waiting: [...results].sort(
          (a, b) => a.result.metrics.avgWaitingTime - b.result.metrics.avgWaitingTime,
        )[0]!,
        turnaround: [...results].sort(
          (a, b) => a.result.metrics.avgTurnaroundTime - b.result.metrics.avgTurnaroundTime,
        )[0]!,
        utilization: [...results].sort(
          (a, b) => b.result.metrics.cpuUtilization - a.result.metrics.cpuUtilization,
        )[0]!,
        idle: [...results].sort((a, b) => a.result.metrics.idleTime - b.result.metrics.idleTime)[0]!,
        worstWaiting: [...results].sort(
          (a, b) => b.result.metrics.avgWaitingTime - a.result.metrics.avgWaitingTime,
        )[0]!,
      }
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Comparative Analysis"
        description="Compare two or more algorithms on an identical process set for a fair result."
      />

      <Card>
        <CardHeader>
          <CardTitle>Select Algorithms</CardTitle>
          <CardDescription>At least two algorithms are required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlgorithmSelector selected={selected} onToggle={toggle} />
          {showQuantum ? (
            <div className="max-w-xs space-y-1.5">
              <Label htmlFor="cmp-quantum">Time Quantum (Round Robin)</Label>
              <Input
                id="cmp-quantum"
                type="number"
                min={1}
                value={quantum}
                onChange={(e) => setQuantum(e.target.value)}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Process Data</CardTitle>
          <CardDescription>
            The same process set is used for every selected algorithm. Edit it freely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProcessInputTable drafts={drafts} showPriority onChange={update} onRemove={remove} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCompare}>
              <GitCompareArrows className="mr-1.5 size-4" /> Compare Algorithms
            </Button>
            <Button variant="outline" onClick={add}>
              Add Process
            </Button>
            <Button variant="outline" onClick={loadExample}>
              Load Example
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clear();
                setResults(null);
                setErrors([]);
              }}
            >
              <Eraser className="mr-1.5 size-4" /> Clear
            </Button>
          </div>
          {errors.length ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Please fix the following before comparing</AlertTitle>
              <AlertDescription>
                <ul className="mt-1 space-y-1">
                  {errors.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {!results ? (
        <Card className="mt-6">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Choose at least two algorithms and press{" "}
            <span className="font-medium text-foreground">Compare Algorithms</span> to see results.
          </CardContent>
        </Card>
      ) : (
        <div className="animate-in fade-in mt-6 space-y-6 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Gantt Charts</CardTitle>
              <CardDescription>One timeline per selected algorithm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {results.map((r) => (
                <GanttChart
                  key={r.algorithm}
                  title={`${r.label} Gantt Chart`}
                  gantt={r.result.gantt}
                  processIds={processIds}
                  compact
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparative Summary</CardTitle>
              <CardDescription>All values calculated from the current input.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Algorithm</TableHead>
                    <TableHead className="text-right">Avg. Waiting</TableHead>
                    <TableHead className="text-right">Avg. Turnaround</TableHead>
                    <TableHead className="text-right">CPU Idle</TableHead>
                    <TableHead className="text-right">CPU Utilization</TableHead>
                    <TableHead className="text-right">Throughput</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.algorithm}>
                      <TableCell className="font-medium">{r.label}</TableCell>
                      <TableCell className="text-right">
                        {fmt(r.result.metrics.avgWaitingTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        {fmt(r.result.metrics.avgTurnaroundTime)}
                      </TableCell>
                      <TableCell className="text-right">{r.result.metrics.idleTime}</TableCell>
                      <TableCell className="text-right">
                        {fmt(r.result.metrics.cpuUtilization)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {fmt(r.result.metrics.throughput, 3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Waiting Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonChart
                  data={results.map((r) => ({
                    name: r.label,
                    value: Number(r.result.metrics.avgWaitingTime.toFixed(2)),
                  }))}
                  color="var(--chart-1)"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Turnaround Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonChart
                  data={results.map((r) => ({
                    name: r.label,
                    value: Number(r.result.metrics.avgTurnaroundTime.toFixed(2)),
                  }))}
                  color="var(--chart-2)"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CPU Idle Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonChart
                  data={results.map((r) => ({ name: r.label, value: r.result.metrics.idleTime }))}
                  color="var(--chart-4)"
                />
              </CardContent>
            </Card>
          </div>

          {best ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-primary" /> Performance Summary
                </CardTitle>
                <CardDescription>
                  Based only on the process set currently entered — not a universal ranking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Best Waiting Time: {best.waiting.label}</Badge>
                  <Badge>Best Turnaround Time: {best.turnaround.label}</Badge>
                  <Badge variant="secondary">
                    Best CPU Utilization: {best.utilization.label}
                  </Badge>
                  <Badge variant="secondary">Lowest CPU Idle Time: {best.idle.label}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Based on the current input,{" "}
                  <span className="font-medium text-foreground">{best.waiting.label}</span> produced
                  the lowest average waiting time (
                  {fmt(best.waiting.result.metrics.avgWaitingTime)})
                  {best.worstWaiting.algorithm !== best.waiting.algorithm ? (
                    <>
                      , while{" "}
                      <span className="font-medium text-foreground">{best.worstWaiting.label}</span>{" "}
                      produced the highest ({fmt(best.worstWaiting.result.metrics.avgWaitingTime)})
                    </>
                  ) : null}
                  .{" "}
                  <span className="font-medium text-foreground">{best.turnaround.label}</span>{" "}
                  achieved the lowest average turnaround time (
                  {fmt(best.turnaround.result.metrics.avgTurnaroundTime)}), and{" "}
                  <span className="font-medium text-foreground">{best.utilization.label}</span> had
                  the highest CPU utilization (
                  {fmt(best.utilization.result.metrics.cpuUtilization)}%).
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
