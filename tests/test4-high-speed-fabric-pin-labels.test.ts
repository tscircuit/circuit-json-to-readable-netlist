import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

const makeFabricLinkCircuitJson = (): AnyCircuitElement[] =>
  [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "FPGA-FABRIC",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      resistance: 50,
      display_resistance: "50Ω",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r2",
      name: "R2",
      resistance: 50,
      display_resistance: "50Ω",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r3",
      name: "R3",
      resistance: 50,
      display_resistance: "50Ω",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["SRIO_TXP0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["AURORA_RXN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_16",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["ILKN_SYNC1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r3_1",
      source_component_id: "source_component_r3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_srio",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_aurora",
      connected_source_port_ids: ["source_port_u1_15", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ilkn",
      connected_source_port_ids: ["source_port_u1_16", "source_port_r3_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

it("preserves high-speed fabric link aliases in generated readable net names", () => {
  const netlist = convertCircuitJsonToReadableNetlist(
    makeFabricLinkCircuitJson(),
  )

  expect(netlist).toContain("NET: U1_SRIO_TXP0")
  expect(netlist).toContain("NET: U1_AURORA_RXN1")
  expect(netlist).toContain("NET: U1_ILKN_SYNC1")
  expect(netlist).toContain("U1 pin14 (SRIO_TXP0)")
  expect(netlist).toContain("U1 pin15 (AURORA_RXN1)")
  expect(netlist).toContain("U1 pin16 (ILKN_SYNC1)")
  expect(netlist).toContain("- pin14(SRIO_TXP0): NETS(U1_SRIO_TXP0)")
  expect(netlist).toContain("- pin15(AURORA_RXN1): NETS(U1_AURORA_RXN1)")
  expect(netlist).toContain("- pin16(ILKN_SYNC1): NETS(U1_ILKN_SYNC1)")
})
