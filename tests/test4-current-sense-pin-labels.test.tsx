import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves current-sense and shunt aliases on generic chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "INA228",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ISENSE1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["VSENSE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_16",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["SHUNT_P"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r2",
      name: "R2",
      resistance: 20000,
      display_resistance: "20kΩ",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r3",
      name: "R3",
      resistance: 30000,
      display_resistance: "30kΩ",
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
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
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
      source_trace_id: "source_trace_isense",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_vsense",
      connected_source_port_ids: ["source_port_u1_15", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_shunt",
      connected_source_port_ids: ["source_port_u1_16", "source_port_r3_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ISENSE1")
  expect(netlist).toContain("  - U1 pin14 (ISENSE1)")
  expect(netlist).toContain("NET: U1_VSENSE")
  expect(netlist).toContain("  - U1 pin15 (VSENSE)")
  expect(netlist).toContain("NET: U1_SHUNT_P")
  expect(netlist).toContain("  - U1 pin16 (SHUNT_P)")
})
