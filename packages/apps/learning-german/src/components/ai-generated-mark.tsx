import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip.tsx";

const label = "This example is AI-generated";

/** A small sparkle shown next to AI-generated example sentences; hovering (or focusing) it explains. */
export function AiGeneratedMark() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="ml-1.5 inline-flex translate-y-0.5 cursor-help rounded-sm text-muted-foreground/70 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Sparkles className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
