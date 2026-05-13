import type { SourcePort } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const genericPortHints = new Set([
  "anode",
  "cathode",
  "left",
  "right",
  "pos",
  "neg",
  "positive",
  "negative",
])

export const getDisplayPinLabel = (port: SourcePort) => {
  const fallbackPinName =
    port.pin_number !== undefined
      ? `pin${port.pin_number}`
      : (port.name ?? "pin")

  if (port.name) {
    return {
      mainPinName: port.name,
      fallbackPinName,
    }
  }

  const candidateHints = (port.port_hints ?? []).filter((hint) => {
    const normalizedHint = hint.toLowerCase()
    if (genericPortHints.has(normalizedHint)) return false
    if (hint === String(port.pin_number)) return false
    if (normalizedHint === fallbackPinName.toLowerCase()) return false
    return true
  })

  const mainPinName =
    candidateHints.sort((a, b) => scorePhrase(b) - scorePhrase(a))[0] ??
    fallbackPinName

  return {
    mainPinName,
    fallbackPinName,
  }
}
