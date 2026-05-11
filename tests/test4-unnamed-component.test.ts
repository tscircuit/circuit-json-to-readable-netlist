import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses source component id when component name is missing", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_unnamed",
      ftype: "simple_chip",
      manufacturer_part_number: "MCU-123",
    },
    {
      type: "source_port",
      source_port_id: "source_port_reset",
      source_component_id: "source_component_unnamed",
      name: "RESET",
      pin_number: 1,
      port_hints: ["RESET"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain(" - source_component_unnamed: MCU-123")
  expect(netlist).toContain("source_component_unnamed (MCU-123)")
})
