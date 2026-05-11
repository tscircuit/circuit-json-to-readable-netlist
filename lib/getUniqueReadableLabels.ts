export const getUniqueReadableLabels = (
  labels: Array<string | null | undefined>,
  blockedLabels: Array<string | null | undefined> = [],
): string[] => {
  const blockedLabelKeys = new Set(
    blockedLabels
      .map((label) => label?.trim().toLowerCase())
      .filter((label): label is string => Boolean(label)),
  )
  const seenLabelKeys = new Set<string>()
  const uniqueLabels: string[] = []

  for (const rawLabel of labels) {
    const label = rawLabel?.trim()
    if (!label) continue

    const labelKey = label.toLowerCase()
    if (blockedLabelKeys.has(labelKey) || seenLabelKeys.has(labelKey)) {
      continue
    }

    seenLabelKeys.add(labelKey)
    uniqueLabels.push(label)
  }

  return uniqueLabels
}
