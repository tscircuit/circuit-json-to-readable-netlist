import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses source port names instead of generic pin numbers in component pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "GPIO14",
      pin_number: 14,
      port_hints: ["pin14", "14", "GPIO14", "SCL"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("- GPIO14(pin14, SCL): NOT_CONNECTED")
  expect(netlist).not.toContain("- pin14")
})
