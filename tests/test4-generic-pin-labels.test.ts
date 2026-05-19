import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes meaningful labels for generic pin names and omits missing footprint text", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GPIO13", "ADC1_CH4", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1kΩ",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
      display_name: ".U1 .GPIO13 to .R1 .pin1",
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("  - U1 pin14 (GPIO13,ADC1_CH4)")
  expect(netlist).not.toContain("undefined")
})
