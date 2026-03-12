import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("prefers descriptive port hints over generic pin<number> labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "sc1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "TEST_CHIP",
    },
    {
      type: "source_port",
      source_port_id: "sp1",
      source_component_id: "sc1",
      pin_number: 14,
      name: "pin14",
      port_hints: ["GPIO14", "ADC2"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).toContain("- GPIO14(pin14, ADC2): NOT_CONNECTED")
  expect(netlist).not.toContain("- pin14(GPIO14")
})
