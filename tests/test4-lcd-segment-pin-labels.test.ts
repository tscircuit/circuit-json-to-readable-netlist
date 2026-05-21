import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps LCD segment labels with numeric suffixes in net entries", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "HT1621B",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "LCD_CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "SEG14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["15", "pin15", "COM0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_pin1",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "LCD_SEG14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_pin2",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "LCD_COM0"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_seg14",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_j1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_com0",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_j1_pin2",
      ],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("U1 pin14 (SEG14)")
  expect(netlist).toContain("U1 pin15 (COM0)")
  expect(netlist).toContain("J1 pin1 (LCD_SEG14)")
  expect(netlist).toContain("J1 pin2 (LCD_COM0)")
})
