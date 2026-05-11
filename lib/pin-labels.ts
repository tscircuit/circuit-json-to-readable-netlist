import type { SourcePort } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

export const cleanLabel = (label?: string | null): string | undefined => {
  const trimmed = label?.trim()
  return trimmed ? trimmed : undefined
}

const getPhysicalPinName = (port: SourcePort): string | undefined =>
  port.pin_number !== undefined ? `pin${port.pin_number}` : undefined

const isNumericPinLabel = (label: string, port: SourcePort): boolean =>
  port.pin_number !== undefined && label === String(port.pin_number)

const isPhysicalPinLabel = (label: string, port: SourcePort): boolean => {
  const physicalPinName = getPhysicalPinName(port)
  return (
    physicalPinName !== undefined &&
    label.toLowerCase() === physicalPinName.toLowerCase()
  )
}

export const isLowInformationPinLabel = (
  label: string,
  port: SourcePort,
): boolean => isNumericPinLabel(label, port) || isPhysicalPinLabel(label, port)

const uniqueLabels = (labels: Array<string | undefined>): string[] =>
  Array.from(new Set(labels.filter((label): label is string => Boolean(label))))

export const getReadablePinLabel = (
  port: SourcePort,
  {
    preferDescriptiveHints = true,
  }: {
    preferDescriptiveHints?: boolean
  } = {},
): string => {
  const portName = cleanLabel(port.name)
  if (
    portName &&
    (!preferDescriptiveHints || !isLowInformationPinLabel(portName, port))
  ) {
    return portName
  }

  if (preferDescriptiveHints) {
    const descriptiveHints = uniqueLabels(
      (port.port_hints ?? []).map(cleanLabel),
    ).filter((hint) => !isLowInformationPinLabel(hint, port))
    const bestHint = descriptiveHints
      .map((hint, index) => ({
        hint,
        index,
        score: scorePhrase(hint),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.hint
    if (bestHint) return bestHint
  }

  return portName ?? getPhysicalPinName(port) ?? ""
}

export const getReadablePinAliases = (
  port: SourcePort,
  mainPinName: string,
  {
    includeAllDescriptiveHints = false,
  }: {
    includeAllDescriptiveHints?: boolean
  } = {},
): string[] => {
  const aliases: string[] = []
  const portName = cleanLabel(port.name)

  if (
    portName &&
    portName !== mainPinName &&
    !isNumericPinLabel(portName, port)
  ) {
    aliases.push(portName)
  }

  for (const rawHint of port.port_hints ?? []) {
    const hint = cleanLabel(rawHint)
    if (!hint) continue
    if (hint === mainPinName || hint === portName) continue
    if (isNumericPinLabel(hint, port)) continue

    if (includeAllDescriptiveHints || scorePhrase(hint) > 1) {
      aliases.push(hint)
    }
  }

  return Array.from(new Set(aliases))
}
