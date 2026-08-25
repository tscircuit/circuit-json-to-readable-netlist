import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("prefers readable port names over numeric pin labels in COMPONENT_PINS", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "GPIO23",
      pin_number: 14,
      port_hints: ["pin14", "GPIO23"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "GND",
      pin_number: 15,
      port_hints: ["GND"],
    },
  ] as AnyCircuitElement[]

  expect(convertCircuitJsonToReadableNetlist(circuitJson)).toContain(
    "- GPIO23(pin14): NOT_CONNECTED",
  )
})

it("falls back to source_port_id when a port has no name or pin number", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_without_label",
      source_component_id: "source_component_1",
      name: undefined,
    },
  ] as unknown as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("- source_port_without_label: NOT_CONNECTED")
})
