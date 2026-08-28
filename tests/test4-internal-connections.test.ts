import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes internally connected source component pins in readable nets", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "POWER_TIE",
      internally_connected_source_port_ids: [
        ["source_port_1", "source_port_2"],
      ],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["VDD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["VDD"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_VDD")
  expect(netlist).toContain("  - U1 pin1 (VDD)")
  expect(netlist).toContain("  - U1 pin2 (VDD)")
  expect(netlist).toContain("- pin1(VDD): NETS(U1_VDD)")
  expect(netlist).toContain("- pin2(VDD): NETS(U1_VDD)")
  expect(netlist).not.toContain("- pin1(VDD): NOT_CONNECTED")
  expect(netlist).not.toContain("- pin2(VDD): NOT_CONNECTED")
})
