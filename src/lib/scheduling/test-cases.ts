import type { AlgorithmKey, Process } from "./types";

export interface TestCase {
  name: string;
  description: string;
  processes: Process[];
  algorithm: AlgorithmKey;
  quantum?: number;
}

export const TEST_CASES: TestCase[] = [
  {
    name: "Test Case 1 — All arrivals at time 0",
    description: "Every process is ready immediately, so the CPU never idles.",
    algorithm: "SJF",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 6, priority: 2 },
      { id: "P2", arrivalTime: 0, burstTime: 2, priority: 1 },
      { id: "P3", arrivalTime: 0, burstTime: 4, priority: 3 },
    ],
  },
  {
    name: "Test Case 2 — Different arrivals with CPU idle time",
    description: "A gap between completions forces the CPU into an IDLE block.",
    algorithm: "FCFS",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 3, priority: 1 },
      { id: "P2", arrivalTime: 8, burstTime: 4, priority: 2 },
      { id: "P3", arrivalTime: 9, burstTime: 2, priority: 3 },
    ],
  },
  {
    name: "Test Case 3 — Same arrival time, preemptive",
    description: "Multiple processes arrive together; SRTF resolves ties deterministically.",
    algorithm: "SRTF",
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 7, priority: 2 },
      { id: "P2", arrivalTime: 2, burstTime: 4, priority: 1 },
      { id: "P3", arrivalTime: 2, burstTime: 1, priority: 3 },
      { id: "P4", arrivalTime: 3, burstTime: 4, priority: 2 },
    ],
  },
  {
    name: "Test Case 4 — Round Robin with quantum = 2",
    description: "Classic time-sharing rotation over the sample data set.",
    algorithm: "RR",
    quantum: 2,
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: "P3", arrivalTime: 2, burstTime: 4, priority: 3 },
      { id: "P4", arrivalTime: 4, burstTime: 2, priority: 2 },
    ],
  },
];
