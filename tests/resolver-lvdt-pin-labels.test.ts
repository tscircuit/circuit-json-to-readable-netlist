import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps resolver and LVDT aliases on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "POSITION_AFE",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RESOLVER_SIN1", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["LVDT_SEC1", "pin15", "15"],
      source_component_id: "source_component_0",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "qfn16",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1kΩ",
      are_pins_interchangeable: true,
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right", "pin2", "2"],
      source_component_id: "source_component_1",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R2",
      resistance: 470,
      display_resistance: "470Ω",
      are_pins_interchangeable: true,
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right", "pin2", "2"],
      source_component_id: "source_component_2",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      pcb_component_id: "pcb_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
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
      connected_source_port_ids: ["source_port_1", "source_port_4"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RESOLVER_SIN1")
  expect(netlist).toContain("  - U1 pin14 (RESOLVER_SIN1)")
  expect(netlist).toContain("- pin14(RESOLVER_SIN1): NETS(U1_RESOLVER_SIN1)")
  expect(netlist).toContain("NET: U1_LVDT_SEC1")
  expect(netlist).toContain("  - U1 pin15 (LVDT_SEC1)")
  expect(netlist).toContain("- pin15(LVDT_SEC1): NETS(U1_LVDT_SEC1)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: R2_pos")
})
