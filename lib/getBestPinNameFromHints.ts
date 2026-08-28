import { scorePhrase } from "./scorePhrase"

export const getBestPinNameFromHints = (
  port: { name?: string; pin_number?: number; port_hints?: string[] },
): string => {
  if (port.name && port.name !== "undefined" && port.name !== `pin${port.pin_number}`) {
    return port.name
  }

  const hints = port.port_hints ?? []
  const scoredHints = hints
    .filter((hint) => {
      if (hint === String(port.pin_number)) return false
      if (hint === port.name) return false
      return true
    })
    .map((hint) => ({ hint, score: scorePhrase(hint) }))
    .sort((a, b) => b.score - a.score)

  if (scoredHints.length > 0 && scoredHints[0].score > scorePhrase(`pin${port.pin_number}`)) {
    return scoredHints[0].hint
  }

  if (port.pin_number !== undefined) {
    return `pin${port.pin_number}`
  }

  return port.name ?? "unknown"
}
