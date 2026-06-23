import type { RecipeStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<RecipeStatus, string> = {
  draft: "bg-neutral-100 text-neutral-700",
  submitted: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: RecipeStatus }) {
  return (
    <Badge variant="secondary" className={cn("capitalize", statusStyles[status])}>
      {status}
    </Badge>
  );
}
