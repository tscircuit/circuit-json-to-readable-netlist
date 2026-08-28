export const normalizeReadableLabel = (
  value: string | null | undefined,
): string | undefined => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
