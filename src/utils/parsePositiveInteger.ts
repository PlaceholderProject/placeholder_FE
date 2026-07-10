export const parsePositiveInteger = (value: string): number | null => {
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;

  return parsed;
};
