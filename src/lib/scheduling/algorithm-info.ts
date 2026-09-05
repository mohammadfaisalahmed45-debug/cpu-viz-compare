import type { AlgorithmKey } from "./types";

export interface AlgorithmInfo {
  key: AlgorithmKey;
  short: string;
  name: string;
  type: string;
  preemptive: string;
  summary: string;
  principle: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  characteristics: string[];
}

export const ALGORITHM_INFO: AlgorithmInfo[] = [
  {
    key: "FCFS",
    short: "FCFS",
    name: "First Come First Serve",
    type: "Arrival-order scheduling",
    preemptive: "Non-Preemptive",
    summary: "Processes run in the order they arrive — simple and fair, but prone to the convoy effect.",
    principle:
      "The scheduler keeps a FIFO queue. The process that arrives first is executed to completion before the next one starts. If no process has arrived, the CPU stays idle until the next arrival.",
    advantages: ["Very simple to implement", "Fair in arrival order", "No starvation"],
    disadvantages: [
      "Convoy effect: a long process delays every later one",
      "Poor average waiting time",
      "Not suitable for interactive systems",
    ],
    useCases: ["Batch processing systems", "Simple job queues", "Teaching baseline behaviour"],
    characteristics: ["Deterministic order", "No context switching overhead beyond job changes"],
  },
  {
    key: "SJF",
    short: "SJF",
    name: "Shortest Job First",
    type: "Burst-time based",
    preemptive: "Non-Preemptive",
    summary: "Picks the shortest available job — optimal average waiting time when burst times are known.",
    principle:
      "At each scheduling decision the available process with the smallest burst time is selected and runs to completion. Ties are broken by earlier arrival, then by input order.",
    advantages: [
      "Provably minimal average waiting time for a fixed set",
      "Good throughput for short jobs",
    ],
    disadvantages: [
      "Requires knowing or estimating burst times",
      "Long processes may starve",
      "Not practical for unpredictable workloads",
    ],
    useCases: ["Batch systems with predictable job length", "Background job queues"],
    characteristics: ["Greedy selection", "Idle CPU handled explicitly"],
  },
  {
    key: "SRTF",
    short: "SRTF",
    name: "Shortest Remaining Time First",
    type: "Burst-time based",
    preemptive: "Preemptive",
    summary: "The preemptive form of SJF — a shorter arriving job takes the CPU immediately.",
    principle:
      "At every arrival the process with the smallest remaining burst time gets the CPU. A newly arrived process with less remaining time preempts the running one.",
    advantages: ["Usually the lowest average waiting time", "Very responsive to short jobs"],
    disadvantages: [
      "Frequent context switching",
      "Starvation risk for long processes",
      "Needs continuous burst-time knowledge",
    ],
    useCases: ["Systems where short interactive jobs must not wait", "Simulation studies"],
    characteristics: ["Preemption only at arrival points", "Consecutive slices merged in the Gantt chart"],
  },
  {
    key: "PRIORITY",
    short: "Priority",
    name: "Priority Scheduling",
    type: "Priority based (smaller number = higher priority)",
    preemptive: "Non-Preemptive",
    summary: "Runs the highest-priority ready process first; low-priority work may starve.",
    principle:
      "Among the available processes the one with the smallest priority number is chosen and runs to completion. Ties are broken by earlier arrival, then input order.",
    advantages: ["Important work finishes first", "Simple to reason about", "Maps to real system needs"],
    disadvantages: [
      "Starvation of low-priority processes",
      "Requires an ageing mechanism in practice",
      "Priority assignment can be arbitrary",
    ],
    useCases: ["Real-time and embedded systems", "Operating-system kernel tasks"],
    characteristics: ["Deterministic given priorities", "Ageing recommended to prevent starvation"],
  },
  {
    key: "RR",
    short: "Round Robin",
    name: "Round Robin",
    type: "Time-slice based",
    preemptive: "Preemptive",
    summary: "Each process gets a fixed time quantum in turn — fair and ideal for time-sharing.",
    principle:
      "A ready queue is served cyclically. Each process runs for at most one time quantum; if unfinished it re-enters the tail of the queue after any newly arrived processes.",
    advantages: ["Fair CPU sharing", "No starvation", "Great for interactive/time-sharing systems"],
    disadvantages: [
      "Average turnaround time can be high",
      "Too small a quantum causes heavy context switching",
      "Too large a quantum degenerates into FCFS",
    ],
    useCases: ["Time-sharing operating systems", "Multi-user servers"],
    characteristics: ["Performance depends strongly on quantum size", "Predictable response time"],
  },
];

export function getInfo(key: AlgorithmKey): AlgorithmInfo {
  return ALGORITHM_INFO.find((a) => a.key === key)!;
}
