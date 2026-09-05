import type { Process } from "./types";

export interface ProcessDraft {
  id: string;
  arrivalTime: string;
  burstTime: string;
  priority: string;
}

export const EXAMPLE_PROCESSES: ProcessDraft[] = [
  { id: "P1", arrivalTime: "0", burstTime: "5", priority: "2" },
  { id: "P2", arrivalTime: "1", burstTime: "3", priority: "1" },
  { id: "P3", arrivalTime: "2", burstTime: "4", priority: "3" },
  { id: "P4", arrivalTime: "4", burstTime: "2", priority: "2" },
];

export function emptyDraft(index: number): ProcessDraft {
  return { id: `P${index}`, arrivalTime: "0", burstTime: "1", priority: "1" };
}

export function defaultDrafts(count = 4): ProcessDraft[] {
  return Array.from({ length: count }, (_, i) => emptyDraft(i + 1));
}

export interface ValidationOutcome {
  errors: string[];
  processes: Process[];
}

export function validate(
  drafts: ProcessDraft[],
  options: { quantum?: string; requireQuantum?: boolean } = {},
): ValidationOutcome {
  const errors: string[] = [];
  const processes: Process[] = [];
  const seen = new Set<string>();

  if (drafts.length < 1) errors.push("At least one process is required.");

  drafts.forEach((d, i) => {
    const label = d.id.trim() || `Row ${i + 1}`;
    if (!d.id.trim()) errors.push(`Row ${i + 1}: Process ID cannot be empty.`);
    else if (seen.has(d.id.trim())) errors.push(`Process ID "${d.id.trim()}" is duplicated.`);
    seen.add(d.id.trim());

    const arrival = Number(d.arrivalTime);
    const burst = Number(d.burstTime);
    const priority = Number(d.priority);

    if (!Number.isFinite(arrival) || arrival < 0)
      errors.push(`${label}: Arrival time must be a number ≥ 0.`);
    if (!Number.isFinite(burst) || burst <= 0)
      errors.push(`${label}: Burst time must be a number > 0.`);
    if (!Number.isFinite(priority)) errors.push(`${label}: Priority must be a valid number.`);

    processes.push({
      id: d.id.trim(),
      arrivalTime: arrival,
      burstTime: burst,
      priority: priority,
    });
  });

  if (options.requireQuantum) {
    const q = Number(options.quantum);
    if (!Number.isFinite(q) || q <= 0) errors.push("Time quantum must be a number > 0.");
  }

  return { errors, processes };
}

export function fmt(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}
