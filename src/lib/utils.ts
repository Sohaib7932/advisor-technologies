/** Join conditional class names without pulling in a dependency. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const STOP_WORDS = new Set(["of", "and", "&", "the", "/"]);

/**
 * Short monogram for a client badge. An organisation already known by its
 * acronym ("NADRA", "IESCO") keeps it; otherwise the initials of the first
 * three significant words of the name ("Capital Development Authority" → CDA).
 */
export function monogram(name: string) {
  const words = name
    .split(",")[0]
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word.toLowerCase()));

  const first = words[0] ?? "";
  if (first.length >= 3 && first === first.toUpperCase()) return first.slice(0, 5);

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
