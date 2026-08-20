import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes CAN and LIN bus aliases for generic physical pin names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "MCP2562",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_canh",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["CAN0H"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_canh",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["CAN0H"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_canl",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["CANL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_canl",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["CANL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_lin",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["LIN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_lin",
      source_component_id: "source_component_j1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["LIN1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_canh",
      connected_source_port_ids: ["source_port_u1_canh", "source_port_j1_canh"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_canl",
      connected_source_port_ids: ["source_port_u1_canl", "source_port_j1_canl"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_lin",
      connected_source_port_ids: ["source_port_u1_lin", "source_port_j1_lin"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CAN0H")
  expect(netlist).toContain("  - U1 pin14 (CAN0H)")
  expect(netlist).toContain("  - J1 pin1 (CAN0H)")
  expect(netlist).toContain("NET: U1_CANL")
  expect(netlist).toContain("  - U1 pin15 (CANL)")
  expect(netlist).toContain("  - J1 pin2 (CANL)")
  expect(netlist).toContain("NET: U1_LIN1")
  expect(netlist).toContain("  - U1 pin16 (LIN1)")
  expect(netlist).toContain("  - J1 pin3 (LIN1)")
})
