import { cn } from "@/lib/utils";

interface CmeLogoProps {
  className?: string;
  /** `full` includes wordmark; `mark` is CM&E grid only */
  variant?: "full" | "mark";
}

export function CmeLogo({ className, variant = "full" }: CmeLogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-10 w-10", className)}
        aria-label="CME"
      >
        <text x="2" y="36" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
          C
        </text>
        <text x="42" y="36" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
          M
        </text>
        <text x="2" y="76" fill="#ED1C24" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
          &amp;
        </text>
        <text x="42" y="76" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
          E
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-12 w-auto", className)}
      aria-label="Canadian Manufacturers & Exporters"
    >
      <text x="0" y="34" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
        C
      </text>
      <text x="40" y="34" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
        M
      </text>
      <text x="0" y="74" fill="#ED1C24" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
        &amp;
      </text>
      <text x="40" y="74" fill="#1A1A1A" fontSize="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300">
        E
      </text>

      <text x="88" y="22" fill="#1A1A1A" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300" letterSpacing="0.08em">
        CANADIAN
      </text>
      <text x="88" y="44" fill="#1A1A1A" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300" letterSpacing="0.08em">
        MANUFACTURERS
      </text>
      <text x="88" y="66" fill="#ED1C24" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" fontWeight="300" letterSpacing="0.08em">
        &amp; EXPORTERS
      </text>
    </svg>
  );
}
