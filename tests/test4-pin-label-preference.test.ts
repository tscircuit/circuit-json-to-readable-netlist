import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import {
  getPreferredPinLabel,
  getReadableNameForPin,
} from "lib/getReadableNameForPin"

const circuitJson = [
  {
    type: "source_component",
    source_component_id: "source_component_1",
    ftype: "simple_chip",
    name: "U1",
  },
  {
    type: "source_port",
    source_port_id: "source_port_1",
    source_component_id: "source_component_1",
    pin_number: 14,
    name: "pin14",
    port_hints: ["GPIO14", "SDA"],
  },
] as any

it("prefers full pin labels over generic numbered labels", () => {
  const port = circuitJson[1]
  expect(getPreferredPinLabel(port)).toBe("GPIO14")

  const readable = getReadableNameForPin({
    circuitJson,
    source_port_id: "source_port_1",
  })
  expect(readable).toContain("U1 GPIO14")
  expect(readable).not.toContain("U1 pin14")
})

it("keeps numeric pin identity in COMPONENT_PINS while exposing descriptive aliases", () => {
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("COMPONENT_PINS:")
  expect(netlist).toContain("- pin14(GPIO14, SDA): NOT_CONNECTED")
})
