import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves lab instrumentation aliases on generic chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "AD5522",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_c1",
      ftype: "simple_capacitor",
      name: "C1",
      capacitance: 1e-9,
      display_capacitance: "1nF",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      name: "pin14",
      pin_number: 14,
      port_hints: ["SMU_FORCE1", "pin14", "14"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      name: "pin15",
      pin_number: 15,
      port_hints: ["SENSE_HI1", "pin15", "15"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_r1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_c1_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left", "pin1", "1"],
      source_component_id: "source_component_c1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_force",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sense",
      connected_source_port_ids: ["source_port_u1_15", "source_port_c1_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SMU_FORCE1")
  expect(netlist).toContain("  - U1 pin14 (SMU_FORCE1)")
  expect(netlist).toContain("NET: U1_SENSE_HI1")
  expect(netlist).toContain("  - U1 pin15 (SENSE_HI1)")
})
