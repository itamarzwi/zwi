import { Badge } from "#/components/ui/badge.tsx";
import type { Level, WordType } from "#/storage/schemas.ts";

export function WordTypeBadge({ type }: { type: WordType }) {
  return (
    <Badge variant="outline" className="bg-card">
      {type}
    </Badge>
  );
}

/** The CEFR level of a word. Renders nothing for custom words without one. */
export function WordLevelBadge({ level }: { level?: Level }) {
  if (!level) return null;
  return <Badge variant="secondary">{level}</Badge>;
}
