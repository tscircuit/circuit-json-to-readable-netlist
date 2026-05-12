import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves isolated gate-driver protection aliases", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "ISO5852S",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_q1",
      name: "Q1",
      manufacturer_part_number: "IGBT",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_gate",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GATE1_H"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_q1_gate",
      source_component_id: "source_component_q1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["gate"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_desat",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["DESAT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pos",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_gate",
      connected_source_port_ids: ["source_port_u1_gate", "source_port_q1_gate"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_desat",
      connected_source_port_ids: ["source_port_u1_desat", "source_port_r1_pos"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_GATE1_H")
  expect(netlist).toContain("  - U1 pin14 (GATE1_H)")
  expect(netlist).toContain("NET: U1_DESAT1")
  expect(netlist).toContain("  - U1 pin15 (DESAT1)")
  expect(netlist).toContain("- pin14(GATE1_H): NETS(U1_GATE1_H)")
  expect(netlist).toContain("- pin15(DESAT1): NETS(U1_DESAT1)")
})
