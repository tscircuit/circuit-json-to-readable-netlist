import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves legacy display labels with numeric suffixes", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "ADV7125",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 75,
      display_resistance: "75 ohm",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_3",
      name: "R2",
      resistance: 75,
      display_resistance: "75 ohm",
    },
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_4",
      name: "C1",
      capacitance: 0.0000001,
      display_capacitance: "100nF",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "tqfp48",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      pcb_component_id: "pcb_component_2",
      source_component_id: "source_component_2",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_3",
      pcb_component_id: "pcb_component_3",
      source_component_id: "source_component_3",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_4",
      pcb_component_id: "pcb_component_4",
      source_component_id: "source_component_4",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      port_hints: ["VGA_RED1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      port_hints: ["VGA_HSYNC1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin16",
      port_hints: ["RGB_DE1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin1",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_4",
      name: "pin1",
      port_hints: ["pos", "anode", "left"],
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
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_6"],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_VGA_RED1")
  expect(readableNetlist).toContain("NET: U1_VGA_HSYNC1")
  expect(readableNetlist).toContain("NET: U1_RGB_DE1")
  expect(readableNetlist).toContain("- U1 pin14 (VGA_RED1)")
  expect(readableNetlist).toContain("- U1 pin15 (VGA_HSYNC1)")
  expect(readableNetlist).toContain("- U1 pin16 (RGB_DE1)")
  expect(readableNetlist).toContain("- pin14(VGA_RED1): NETS(U1_VGA_RED1)")
  expect(readableNetlist).toContain("- pin15(VGA_HSYNC1): NETS(U1_VGA_HSYNC1)")
  expect(readableNetlist).toContain("- pin16(RGB_DE1): NETS(U1_RGB_DE1)")
})
