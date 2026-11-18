/**
 * Extracts the first word of a user's nickname or full name.
 * e.g. "Alinka_Carpet" -> "Alinka", "Leo Dmitriev 👨‍🎨" -> "Leo"
 */
export function formatShortName(rawName?: string | null): string {
  if (!rawName) return 'Player';
  const trimmed = rawName.trim();
  if (!trimmed) return 'Player';
  const parts = trimmed.split(/[\s_]+/).filter(Boolean);
  if (parts.length === 0) return trimmed;

  const wordsWithLetters = parts
    .map((p) => {
      const match = p.match(/[\p{L}\p{N}-]+/gu);
      return match ? match.join('') : '';
    })
    .filter(Boolean);

  return wordsWithLetters[0] || parts[0] || trimmed;
}

/**
 * Extracts initials from the first two words of a user's full name / nickname.
 * e.g. "Alinka_Carpet" -> "AC", "Leo Dmitriev" -> "LD", "Zaven" -> "Z"
 */
export function getInitialsFromName(rawName?: string | null): string {
  if (!rawName) return '?';
  const words = (rawName.match(/[\p{L}\p{N}]+/gu) || []).filter(Boolean);
  if (words.length >= 2) {
    const first = words[0]?.[0] || '';
    const second = words[1]?.[0] || '';
    return (first + second).toUpperCase() || '?';
  }
  if (words.length === 1) {
    return (words[0]?.[0] || '?').toUpperCase();
  }
  return rawName.trim()[0]?.toUpperCase() || '?';
}
