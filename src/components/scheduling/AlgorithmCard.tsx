import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmInfo } from "@/lib/scheduling/algorithm-info";

export function AlgorithmCard({ info }: { info: AlgorithmInfo }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{info.short}</CardTitle>
          <Badge variant={info.preemptive === "Preemptive" ? "default" : "secondary"}>
            {info.preemptive}
          </Badge>
        </div>
        <CardDescription>{info.name}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <p className="text-sm text-muted-foreground">{info.summary}</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/algorithms" hash={info.key}>
            Learn more
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
