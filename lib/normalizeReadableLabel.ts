export const normalizeReadableLabel = (label?: string | null) => {
  const trimmed = label?.trim()
  return trimmed ? trimmed : undefined
}

export const normalizeReadableLabels = (
  labels: Array<string | null | undefined>,
) =>
  Array.from(
    new Set(
      labels
        .map((label) => normalizeReadableLabel(label))
        .filter((label): label is string => Boolean(label)),
    ),
  )
