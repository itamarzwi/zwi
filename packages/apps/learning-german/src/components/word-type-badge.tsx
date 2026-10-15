import { Badge } from "#/components/ui/badge.tsx";
import type { WordType } from "#/storage/schemas.ts";

export function WordTypeBadge({ type }: { type: WordType }) {
  return (
    <Badge variant="outline" className="bg-card">
      {type}
    </Badge>
  );
}
