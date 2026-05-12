import type { SourcePort } from "circuit-json"

export const getPinNumberName = (port: SourcePort): string | undefined =>
  port.pin_number !== undefined ? `pin${port.pin_number}` : undefined

export const getDisplayNameForPort = (port: SourcePort): string =>
  port.name || getPinNumberName(port) || port.source_port_id
