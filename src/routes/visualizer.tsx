import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/AppLayout";
import { GanttChart } from "@/components/scheduling/GanttChart";
import { PerformanceSummary } from "@/components/scheduling/PerformanceSummary";
import { ProcessInputTable } from "@/components/scheduling/ProcessInputTable";
import { ResultTable } from "@/components/scheduling/ResultTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProcessDrafts } from "@/hooks/useProcessDrafts";
import { ALGORITHM_INFO, getInfo } from "@/lib/scheduling/algorithm-info";
import { runAlgorithm } from "@/lib/scheduling/algorithms";
import { TEST_CASES } from "@/lib/scheduling/test-cases";
import type { AlgorithmKey, SchedulingResult } from "@/lib/scheduling/types";
import { fmt, validate } from "@/lib/scheduling/validation";
import { AlertCircle, Eraser, FlaskConical, Play, Plus, TableProperties } from "lucide-react";

export const Route = createFileRoute("/visualizer")({
  head: () => ({
    meta: [
      { title: "Algorithm Visualizer — CPU Scheduling Visualizer" },
      {
        name: "description",
        content:
          "Enter processes, pick a CPU scheduling algorithm and view the Gantt chart, per-process results and performance metrics.",
      },
      { property: "og:title", content: "Algorithm Visualizer — CPU Scheduling Visualizer" },
      {
        property: "og:description",
        content: "Run FCFS, SJF, SRTF, Priority or Round Robin and see the Gantt chart instantly.",
      },
    ],
  }),
  component: VisualizerPage,
});

function VisualizerPage() {
  const { drafts, update, add, remove, removeLast, loadExample, clear, setDrafts } =
    useProcessDrafts();
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("FCFS");
  const [quantum, setQuantum] = useState("2");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [running, setRunning] = useState(false);

  const showPriority = algorithm === "PRIORITY";
  const showQuantum = algorithm === "RR";
  const info = getInfo(algorithm);

  const processIds = useMemo(
    () => (result ? result.results.map((r) => r.id) : []),
    [result],
  );

  const handleRun = () => {
    const { errors: found, processes } = validate(drafts, {
      quantum,
      requireQuantum: showQuantum,
    });
    setErrors(found);
    if (found.length) {
      setResult(null);
      return;
    }
    setRunning(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(runAlgorithm(algorithm, processes, Number(quantum)));
      setRunning(false);
    }, 260);
  };

  const runTestCase = (index: number) => {
    const tc = TEST_CASES[index]!;
    setDrafts(
      tc.processes.map((p) => ({
        id: p.id,
        arrivalTime: String(p.arrivalTime),
        burstTime: String(p.burstTime),
        priority: String(p.priority),
      })),
    );
    setAlgorithm(tc.algorithm);
    if (tc.quantum) setQuantum(String(tc.quantum));
    setErrors([]);
    setResult(runAlgorithm(tc.algorithm, tc.processes, tc.quantum ?? Number(quantum)));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Algorithm Visualizer"
        description="Enter your process set, choose an algorithm and generate the schedule."
      />

      <Tabs defaultValue="input">
        <TabsList>
          <TabsTrigger value="input">
            <TableProperties className="mr-1.5 size-4" /> Input &amp; Result
          </TabsTrigger>
          <TabsTrigger value="tests">
            <FlaskConical className="mr-1.5 size-4" /> Test Cases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Process Input</CardTitle>
              <CardDescription>
                Default set is 4 processes. Arrival ≥ 0, burst &gt; 0, unique process IDs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="algo">Algorithm</Label>
                  <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmKey)}>
                    <SelectTrigger id="algo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALGORITHM_INFO.map((a) => (
                        <SelectItem key={a.key} value={a.key}>
                          {a.short} — {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="count">Number of Processes</Label>
                  <Input id="count" value={drafts.length} readOnly className="bg-muted" />
                </div>
                {showQuantum ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="quantum">Time Quantum</Label>
                    <Input
                      id="quantum"
                      type="number"
                      min={1}
                      value={quantum}
                      onChange={(e) => setQuantum(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label>Scheduling Type</Label>
                    <div className="flex h-9 items-center">
                      <Badge variant="secondary">{info.preemptive}</Badge>
                    </div>
                  </div>
                )}
              </div>

              <ProcessInputTable
                drafts={drafts}
                showPriority={showPriority}
                onChange={update}
                onRemove={remove}
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleRun} disabled={running}>
                  <Play className="mr-1.5 size-4" />
                  {running ? "Running…" : "Run Algorithm"}
                </Button>
                <Button variant="outline" onClick={add}>
                  <Plus className="mr-1.5 size-4" /> Add Process
                </Button>
                <Button variant="outline" onClick={removeLast} disabled={!drafts.length}>
                  Remove Process
                </Button>
                <Button variant="outline" onClick={loadExample}>
                  Load Example
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    clear();
                    setResult(null);
                    setErrors([]);
                  }}
                >
                  <Eraser className="mr-1.5 size-4" /> Clear
                </Button>
              </div>

              {errors.length ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Please fix the following before running</AlertTitle>
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

          {running ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
                <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Executing {info.short}…
              </CardContent>
            </Card>
          ) : null}

          {!running && !result ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No schedule yet. Fill in the process table and press{" "}
                <span className="font-medium text-foreground">Run Algorithm</span>.
              </CardContent>
            </Card>
          ) : null}

          {result && !running ? (
            <div className="animate-in fade-in space-y-6 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2">
                    Gantt Chart
                    <Badge variant="outline">{info.short}</Badge>
                    {showQuantum ? <Badge variant="secondary">Quantum = {quantum}</Badge> : null}
                  </CardTitle>
                  <CardDescription>Execution timeline including CPU idle periods.</CardDescription>
                </CardHeader>
                <CardContent>
                  <GanttChart gantt={result.gantt} processIds={processIds} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Process Scheduling Results</CardTitle>
                  <CardDescription>
                    Turnaround = Completion − Arrival · Waiting = Turnaround − Burst
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultTable results={result.results} showPriority />
                </CardContent>
              </Card>

              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">Performance Summary</h2>
                <PerformanceSummary metrics={result.metrics} />
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Predefined Test Cases</CardTitle>
              <CardDescription>
                Load a verification scenario into the input table and run it immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEST_CASES.map((tc, i) => {
                const preview = runAlgorithm(tc.algorithm, tc.processes, tc.quantum ?? 2);
                return (
                  <div
                    key={tc.name}
                    className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{tc.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{tc.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Expected AWT {fmt(preview.metrics.avgWaitingTime)} · ATT{" "}
                        {fmt(preview.metrics.avgTurnaroundTime)} · Idle {preview.metrics.idleTime}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => runTestCase(i)}>
                      Load &amp; Run
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
