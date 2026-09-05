import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ProcessDraft } from "@/lib/scheduling/validation";
import { Info, Trash2 } from "lucide-react";

interface Props {
  drafts: ProcessDraft[];
  showPriority: boolean;
  onChange: (index: number, field: keyof ProcessDraft, value: string) => void;
  onRemove: (index: number) => void;
}

export function ProcessInputTable({ drafts, showPriority, onChange, onRemove }: Props) {
  if (!drafts.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No processes yet. Use “Add Process” or “Load Example” to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-24">Process ID</TableHead>
            <TableHead className="min-w-28">
              <span className="inline-flex items-center gap-1">
                Arrival Time
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Time unit at which the process enters the ready queue (≥ 0).</TooltipContent>
                </Tooltip>
              </span>
            </TableHead>
            <TableHead className="min-w-28">
              <span className="inline-flex items-center gap-1">
                Burst Time
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Total CPU time the process requires (&gt; 0).</TooltipContent>
                </Tooltip>
              </span>
            </TableHead>
            {showPriority ? (
              <TableHead className="min-w-28">
                <span className="inline-flex items-center gap-1">
                  Priority
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Smaller number = higher priority.</TooltipContent>
                  </Tooltip>
                </span>
              </TableHead>
            ) : null}
            <TableHead className="w-12 text-right">
              <span className="sr-only">Remove</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((d, i) => (
            <TableRow key={i}>
              <TableCell>
                <Label className="sr-only" htmlFor={`pid-${i}`}>
                  Process ID row {i + 1}
                </Label>
                <Input
                  id={`pid-${i}`}
                  value={d.id}
                  onChange={(e) => onChange(i, "id", e.target.value)}
                  className="h-9"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  value={d.arrivalTime}
                  onChange={(e) => onChange(i, "arrivalTime", e.target.value)}
                  className="h-9"
                  aria-label={`Arrival time row ${i + 1}`}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={d.burstTime}
                  onChange={(e) => onChange(i, "burstTime", e.target.value)}
                  className="h-9"
                  aria-label={`Burst time row ${i + 1}`}
                />
              </TableCell>
              {showPriority ? (
                <TableCell>
                  <Input
                    type="number"
                    value={d.priority}
                    onChange={(e) => onChange(i, "priority", e.target.value)}
                    className="h-9"
                    aria-label={`Priority row ${i + 1}`}
                  />
                </TableCell>
              ) : null}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove process ${d.id || i + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
