import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProcessResult } from "@/lib/scheduling/types";

export function ResultTable({
  results,
  showPriority = true,
}: {
  results: ProcessResult[];
  showPriority?: boolean;
}) {
  const bestWaiting = results.length ? Math.min(...results.map((r) => r.waitingTime)) : 0;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process</TableHead>
            <TableHead className="text-right">Arrival</TableHead>
            <TableHead className="text-right">Burst</TableHead>
            {showPriority ? <TableHead className="text-right">Priority</TableHead> : null}
            <TableHead className="text-right">Completion</TableHead>
            <TableHead className="text-right">Turnaround</TableHead>
            <TableHead className="text-right">Waiting</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.id}</TableCell>
              <TableCell className="text-right">{r.arrivalTime}</TableCell>
              <TableCell className="text-right">{r.burstTime}</TableCell>
              {showPriority ? <TableCell className="text-right">{r.priority}</TableCell> : null}
              <TableCell className="text-right">{r.completionTime}</TableCell>
              <TableCell className="text-right">{r.turnaroundTime}</TableCell>
              <TableCell className="text-right">
                {r.waitingTime === bestWaiting ? (
                  <Badge variant="secondary">{r.waitingTime}</Badge>
                ) : (
                  r.waitingTime
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
