import type {
  AlgorithmKey,
  GanttSegment,
  Process,
  ProcessResult,
  SchedulingMetrics,
  SchedulingResult,
} from "./types";

export const ALGORITHM_LABELS: Record<AlgorithmKey, string> = {
  FCFS: "FCFS",
  SJF: "SJF",
  SRTF: "SRTF",
  PRIORITY: "Priority Scheduling",
  RR: "Round Robin",
};

export const ALGORITHM_KEYS: AlgorithmKey[] = ["FCFS", "SJF", "SRTF", "PRIORITY", "RR"];

/** Append a slice to the timeline, merging with the previous slice when contiguous. */
function push(gantt: GanttSegment[], id: string | null, start: number, end: number) {
  if (end <= start) return;
  const last = gantt[gantt.length - 1];
  if (last && last.id === id && last.end === start) {
    last.end = end;
    return;
  }
  gantt.push({ id, start, end });
}

function buildResults(processes: Process[], completion: Record<string, number>): ProcessResult[] {
  return processes.map((p) => {
    const completionTime = completion[p.id];
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = Math.max(0, turnaroundTime - p.burstTime);
    return { ...p, completionTime, turnaroundTime, waitingTime };
  });
}

export function computeMetrics(
  results: ProcessResult[],
  gantt: GanttSegment[],
): SchedulingMetrics {
  const n = results.length;
  const sumW = results.reduce((s, r) => s + r.waitingTime, 0);
  const sumT = results.reduce((s, r) => s + r.turnaroundTime, 0);
  const start = gantt.length ? gantt[0].start : 0;
  const end = gantt.length ? gantt[gantt.length - 1].end : 0;
  const totalTime = end - start;
  const idleTime = gantt.reduce((s, g) => (g.id === null ? s + (g.end - g.start) : s), 0);
  const busyTime = totalTime - idleTime;
  return {
    avgWaitingTime: n ? sumW / n : 0,
    avgTurnaroundTime: n ? sumT / n : 0,
    idleTime,
    busyTime,
    totalTime,
    cpuUtilization: totalTime > 0 ? (busyTime / totalTime) * 100 : 0,
    throughput: totalTime > 0 ? n / totalTime : 0,
  };
}

function finalize(
  algorithm: AlgorithmKey,
  processes: Process[],
  completion: Record<string, number>,
  gantt: GanttSegment[],
): SchedulingResult {
  const results = buildResults(processes, completion);
  return { algorithm, gantt, results, metrics: computeMetrics(results, gantt) };
}

/** Generic non-preemptive driver: `pick` chooses among available processes. */
function nonPreemptive(
  algorithm: AlgorithmKey,
  processes: Process[],
  pick: (candidates: Process[]) => Process,
): SchedulingResult {
  const remaining = [...processes];
  const gantt: GanttSegment[] = [];
  const completion: Record<string, number> = {};
  let time = remaining.length ? Math.min(...remaining.map((p) => p.arrivalTime)) : 0;
  if (remaining.length && time > 0) push(gantt, null, 0, time);

  while (remaining.length) {
    const available = remaining.filter((p) => p.arrivalTime <= time);
    if (!available.length) {
      const next = Math.min(...remaining.map((p) => p.arrivalTime));
      push(gantt, null, time, next);
      time = next;
      continue;
    }
    const chosen = pick(available);
    push(gantt, chosen.id, time, time + chosen.burstTime);
    time += chosen.burstTime;
    completion[chosen.id] = time;
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  return finalize(algorithm, processes, completion, gantt);
}

const byArrivalThenOrder = (a: Process, b: Process, order: Map<string, number>) =>
  a.arrivalTime - b.arrivalTime || order.get(a.id)! - order.get(b.id)!;

function orderMap(processes: Process[]) {
  return new Map(processes.map((p, i) => [p.id, i]));
}

export function calculateFCFS(processes: Process[]): SchedulingResult {
  const order = orderMap(processes);
  return nonPreemptive("FCFS", processes, (c) =>
    [...c].sort((a, b) => byArrivalThenOrder(a, b, order))[0],
  );
}

export function calculateSJF(processes: Process[]): SchedulingResult {
  const order = orderMap(processes);
  return nonPreemptive("SJF", processes, (c) =>
    [...c].sort(
      (a, b) => a.burstTime - b.burstTime || byArrivalThenOrder(a, b, order),
    )[0],
  );
}

export function calculatePriority(processes: Process[]): SchedulingResult {
  const order = orderMap(processes);
  return nonPreemptive("PRIORITY", processes, (c) =>
    [...c].sort((a, b) => a.priority - b.priority || byArrivalThenOrder(a, b, order))[0],
  );
}

export function calculateSRTF(processes: Process[]): SchedulingResult {
  const order = orderMap(processes);
  const remainingTime: Record<string, number> = {};
  processes.forEach((p) => (remainingTime[p.id] = p.burstTime));
  const completion: Record<string, number> = {};
  const gantt: GanttSegment[] = [];
  let done = 0;
  let time = processes.length ? Math.min(...processes.map((p) => p.arrivalTime)) : 0;
  if (processes.length && time > 0) push(gantt, null, 0, time);

  while (done < processes.length) {
    const available = processes.filter(
      (p) => p.arrivalTime <= time && remainingTime[p.id] > 0,
    );
    if (!available.length) {
      const future = processes.filter((p) => remainingTime[p.id] > 0);
      const next = Math.min(...future.map((p) => p.arrivalTime));
      push(gantt, null, time, next);
      time = next;
      continue;
    }
    const current = [...available].sort(
      (a, b) =>
        remainingTime[a.id] - remainingTime[b.id] || byArrivalThenOrder(a, b, order),
    )[0];

    // Run until either the process finishes or a new arrival could preempt it.
    const nextArrivals = processes
      .map((p) => p.arrivalTime)
      .filter((t) => t > time)
      .sort((a, b) => a - b);
    const finishAt = time + remainingTime[current.id];
    const nextArrival = nextArrivals.length ? nextArrivals[0] : Infinity;
    const runUntil = Math.min(finishAt, nextArrival);
    push(gantt, current.id, time, runUntil);
    remainingTime[current.id] -= runUntil - time;
    time = runUntil;
    if (remainingTime[current.id] === 0) {
      completion[current.id] = time;
      done += 1;
    }
  }
  return finalize("SRTF", processes, completion, gantt);
}

export function calculateRoundRobin(processes: Process[], quantum: number): SchedulingResult {
  const q = Math.max(1, Math.floor(quantum));
  const order = orderMap(processes);
  const sorted = [...processes].sort((a, b) => byArrivalThenOrder(a, b, order));
  const remainingTime: Record<string, number> = {};
  processes.forEach((p) => (remainingTime[p.id] = p.burstTime));
  const completion: Record<string, number> = {};
  const gantt: GanttSegment[] = [];
  const queue: Process[] = [];
  let time = sorted.length ? sorted[0].arrivalTime : 0;
  if (sorted.length && time > 0) push(gantt, null, 0, time);
  let nextIndex = 0;
  let done = 0;

  const enqueueArrivals = (upTo: number) => {
    while (nextIndex < sorted.length && sorted[nextIndex].arrivalTime <= upTo) {
      queue.push(sorted[nextIndex]);
      nextIndex += 1;
    }
  };

  enqueueArrivals(time);

  while (done < processes.length) {
    if (!queue.length) {
      if (nextIndex >= sorted.length) break;
      const next = sorted[nextIndex].arrivalTime;
      push(gantt, null, time, next);
      time = next;
      enqueueArrivals(time);
      continue;
    }
    const current = queue.shift()!;
    const slice = Math.min(q, remainingTime[current.id]);
    push(gantt, current.id, time, time + slice);
    time += slice;
    remainingTime[current.id] -= slice;
    // Newly arrived processes enter the queue before the preempted one.
    enqueueArrivals(time);
    if (remainingTime[current.id] === 0) {
      completion[current.id] = time;
      done += 1;
    } else {
      queue.push(current);
    }
  }
  return finalize("RR", processes, completion, gantt);
}

export function runAlgorithm(
  algorithm: AlgorithmKey,
  processes: Process[],
  quantum = 2,
): SchedulingResult {
  switch (algorithm) {
    case "FCFS":
      return calculateFCFS(processes);
    case "SJF":
      return calculateSJF(processes);
    case "SRTF":
      return calculateSRTF(processes);
    case "PRIORITY":
      return calculatePriority(processes);
    case "RR":
      return calculateRoundRobin(processes, quantum);
  }
}
