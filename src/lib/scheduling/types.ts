export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface GanttSegment {
  /** Process id, or null when the CPU is idle */
  id: string | null;
  start: number;
  end: number;
}

export interface ProcessResult extends Process {
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export interface SchedulingMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  idleTime: number;
  busyTime: number;
  totalTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface SchedulingResult {
  algorithm: AlgorithmKey;
  gantt: GanttSegment[];
  results: ProcessResult[];
  metrics: SchedulingMetrics;
}

export type AlgorithmKey = "FCFS" | "SJF" | "SRTF" | "PRIORITY" | "RR";

export interface ComparisonResult {
  algorithm: AlgorithmKey;
  label: string;
  result: SchedulingResult;
}
