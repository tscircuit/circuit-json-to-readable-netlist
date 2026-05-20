import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

const makeStorageFabricCircuitJson = (): AnyCircuitElement[] =>
  [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "STORAGE-FABRIC",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      resistance: 100,
      display_resistance: "100Ω",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r2",
      name: "R2",
      resistance: 100,
      display_resistance: "100Ω",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r3",
      name: "R3",
      resistance: 100,
      display_resistance: "100Ω",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_20",
      source_component_id: "source_component_u1",
      name: "pin20",
      pin_number: 20,
      port_hints: ["FC_RX0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_21",
      source_component_id: "source_component_u1",
      name: "pin21",
      pin_number: 21,
      port_hints: ["FC_TX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_22",
      source_component_id: "source_component_u1",
      name: "pin22",
      pin_number: 22,
      port_hints: ["IB_LANE1"],
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
      source_trace_id: "source_trace_fc_rx",
      connected_source_port_ids: ["source_port_u1_20", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_fc_tx",
      connected_source_port_ids: ["source_port_u1_21", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ib_lane",
      connected_source_port_ids: ["source_port_u1_22", "source_port_r3_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

it("preserves Fibre Channel and InfiniBand aliases in readable net names", () => {
  const netlist = convertCircuitJsonToReadableNetlist(
    makeStorageFabricCircuitJson(),
  )

  expect(netlist).toContain("NET: U1_FC_RX0")
  expect(netlist).toContain("NET: U1_FC_TX1")
  expect(netlist).toContain("NET: U1_IB_LANE1")
  expect(netlist).toContain("U1 pin20 (FC_RX0)")
  expect(netlist).toContain("U1 pin21 (FC_TX1)")
  expect(netlist).toContain("U1 pin22 (IB_LANE1)")
  expect(netlist).toContain("- pin20(FC_RX0): NETS(U1_FC_RX0)")
  expect(netlist).toContain("- pin21(FC_TX1): NETS(U1_FC_TX1)")
  expect(netlist).toContain("- pin22(IB_LANE1): NETS(U1_IB_LANE1)")
})
