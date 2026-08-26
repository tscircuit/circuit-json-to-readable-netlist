import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves safety interlock pin aliases in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "SAFETY-MCU",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      resistance: 4700,
      display_resistance: "4.7kΩ",
    },
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_2",
      name: "C1",
      capacitance: 0.00000001,
      display_capacitance: "10nF",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ESTOP_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["OSSD1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_ESTOP_IN")
  expect(readableNetlist).toContain("  - U1 pin14 (ESTOP_IN)")
  expect(readableNetlist).toContain("NET: U1_OSSD1")
  expect(readableNetlist).toContain("  - U1 pin15 (OSSD1)")
})
