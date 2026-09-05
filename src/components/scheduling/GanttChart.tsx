import type { GanttSegment } from "@/lib/scheduling/types";
import { colorFor } from "./colors";

interface Props {
  gantt: GanttSegment[];
  processIds: string[];
  title?: string;
  compact?: boolean;
}

export function GanttChart({ gantt, processIds, title, compact = false }: Props) {
  if (!gantt.length) return null;
  const start = gantt[0]!.start;
  const end = gantt[gantt.length - 1]!.end;
  const total = Math.max(1, end - start);
  const minWidth = Math.max(gantt.length * 72, 320);

  return (
    <div className="space-y-3">
      {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : null}
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth }}>
          <div className={`flex ${compact ? "h-10" : "h-14"} w-full overflow-hidden rounded-md border border-border`}>
            {gantt.map((seg, i) => (
              <div
                key={`${seg.id}-${seg.start}-${i}`}
                className="animate-in fade-in slide-in-from-left-2 flex items-center justify-center border-r border-background/40 text-xs font-semibold text-white last:border-r-0"
                style={{
                  width: `${((seg.end - seg.start) / total) * 100}%`,
                  backgroundColor: colorFor(seg.id, processIds),
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: "backwards",
                }}
                title={`${seg.id ?? "IDLE"} • ${seg.start} → ${seg.end}`}
              >
                <span className="truncate px-1">{seg.id ?? "IDLE"}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-1 h-5 text-[11px] text-muted-foreground">
            <span className="absolute left-0">{start}</span>
            {gantt.map((seg, i) => (
              <span
                key={`t-${i}`}
                className={i === gantt.length - 1 ? "absolute -translate-x-full" : "absolute -translate-x-1/2"}
                style={{ left: `${((seg.end - start) / total) * 100}%` }}
              >
                {seg.end}
              </span>
            ))}

          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {processIds.map((id) => (
          <span key={id} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-sm"
              style={{ backgroundColor: colorFor(id, processIds) }}
            />
            {id}
          </span>
        ))}
        {gantt.some((g) => g.id === null) ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: "var(--idle)" }} />
            IDLE
          </span>
        ) : null}
        <span className="ml-auto font-medium text-foreground">Total execution time: {end - start}</span>
      </div>
    </div>
  );
}
