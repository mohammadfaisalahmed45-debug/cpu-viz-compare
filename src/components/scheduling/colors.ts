const PALETTE = [
  "var(--proc-1)",
  "var(--proc-2)",
  "var(--proc-3)",
  "var(--proc-4)",
  "var(--proc-5)",
  "var(--proc-6)",
  "var(--proc-7)",
  "var(--proc-8)",
];

/** Stable colour per process id, based on its index in the process list. */
export function colorFor(id: string | null, ids: string[]): string {
  if (id === null) return "var(--idle)";
  const index = ids.indexOf(id);
  return PALETTE[(index < 0 ? 0 : index) % PALETTE.length]!;
}
