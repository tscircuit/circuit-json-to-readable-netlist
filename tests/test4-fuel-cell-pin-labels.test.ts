import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves fuel-cell and hydrogen controller aliases on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "H2CTRL",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_1",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["FUEL_CELL1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_2",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["H2_SENSOR1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_3",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["STACK_VOLT1"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r2",
      name: "R2",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r3",
      name: "R3",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r3_1",
      source_component_id: "source_component_r3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1_1", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_u1_2", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_u1_3", "source_port_r3_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_FUEL_CELL1")
  expect(readableNetlist).toContain("  - U1 pin14 (FUEL_CELL1)")
  expect(readableNetlist).toContain("NET: U1_H2_SENSOR1")
  expect(readableNetlist).toContain("  - U1 pin15 (H2_SENSOR1)")
  expect(readableNetlist).toContain("NET: U1_STACK_VOLT1")
  expect(readableNetlist).toContain("  - U1 pin16 (STACK_VOLT1)")
})
