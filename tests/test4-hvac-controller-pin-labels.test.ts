import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves HVAC controller aliases on generic physical pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "HVAC_CTRL",
    },
    {
      type: "source_port",
      source_port_id: "source_port_comp",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "14", "HVAC_COMP1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fan",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "15", "FAN_RELAY1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_defrost",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["pin16", "16", "DEFROST1"],
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
      type: "source_port",
      source_port_id: "source_port_r1p1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_r2",
      ftype: "simple_resistor",
      name: "R2",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2p1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_r3",
      ftype: "simple_resistor",
      name: "R3",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r3p1",
      source_component_id: "source_component_r3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_comp",
      connected_source_port_ids: ["source_port_comp", "source_port_r1p1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_fan",
      connected_source_port_ids: ["source_port_fan", "source_port_r2p1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_defrost",
      connected_source_port_ids: ["source_port_defrost", "source_port_r3p1"],
      connected_source_net_ids: [],
    },
  ] satisfies AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HVAC_COMP1")
  expect(netlist).toContain("  - U1 pin14 (HVAC_COMP1)")
  expect(netlist).toContain("NET: U1_FAN_RELAY1")
  expect(netlist).toContain("  - U1 pin15 (FAN_RELAY1)")
  expect(netlist).toContain("NET: U1_DEFROST1")
  expect(netlist).toContain("  - U1 pin16 (DEFROST1)")
})
