import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DemoBanner() {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 text-amber-900">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        Demo prototype — data is simulated and not persisted securely. Do not
        enter real confidential or production data.
      </AlertDescription>
    </Alert>
  );
}
