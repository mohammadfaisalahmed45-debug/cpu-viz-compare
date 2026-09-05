import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ALGORITHM_INFO } from "@/lib/scheduling/algorithm-info";
import type { AlgorithmKey } from "@/lib/scheduling/types";

export function AlgorithmSelector({
  selected,
  onToggle,
}: {
  selected: AlgorithmKey[];
  onToggle: (key: AlgorithmKey, checked: boolean) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ALGORITHM_INFO.map((info) => (
        <label
          key={info.key}
          htmlFor={`algo-${info.key}`}
          className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/60 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/40"
        >
          <Checkbox
            id={`algo-${info.key}`}
            checked={selected.includes(info.key)}
            onCheckedChange={(c) => onToggle(info.key, c === true)}
            className="mt-0.5"
          />
          <span>
            <Label htmlFor={`algo-${info.key}`} className="cursor-pointer text-sm font-medium">
              {info.short}
            </Label>
            <span className="mt-0.5 block text-xs text-muted-foreground">{info.name}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
