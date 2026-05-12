import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("scores DIP switch and rotary-coded switch aliases on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "SW1",
      manufacturer_part_number: "SW-SELECTOR",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R2",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_3",
      ftype: "simple_resistor",
      name: "R3",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["DIPSW1", "DIP_SWITCH_1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["ROTARY_SW1", "ROTARY_SWITCH_1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["BCD_A1", "THUMBWHEEL_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_4"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "soic16",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_3",
      source_component_id: "source_component_3",
      footprinter_string: "0402",
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: SW1_DIPSW1")
  expect(netlist).toContain("  - SW1 pin14 (DIPSW1,DIP_SWITCH_1)")
  expect(netlist).toContain("NET: SW1_ROTARY_SW1")
  expect(netlist).toContain("  - SW1 pin15 (ROTARY_SW1,ROTARY_SWITCH_1)")
  expect(netlist).toContain("NET: SW1_BCD_A1")
  expect(netlist).toContain("  - SW1 pin16 (BCD_A1,THUMBWHEEL_A)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: R2_pos")
  expect(netlist).not.toContain("NET: R3_pos")
})
