import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes RMII ethernet labels on generic pin net entries", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u2",
      name: "U2",
      manufacturer_part_number: "PHY",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_mdio",
      source_component_id: "source_component_u1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["MDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_mdio",
      source_component_id: "source_component_u2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["MDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_txd0",
      source_component_id: "source_component_u1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["TXD0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_txd0",
      source_component_id: "source_component_u2",
      name: "pin4",
      pin_number: 4,
      port_hints: ["TXD0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_rxd1",
      source_component_id: "source_component_u1",
      name: "pin5",
      pin_number: 5,
      port_hints: ["RXD1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_rxd1",
      source_component_id: "source_component_u2",
      name: "pin6",
      pin_number: 6,
      port_hints: ["RXD1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_refclk",
      source_component_id: "source_component_u1",
      name: "pin7",
      pin_number: 7,
      port_hints: ["REFCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_refclk",
      source_component_id: "source_component_u2",
      name: "pin8",
      pin_number: 8,
      port_hints: ["REFCLK"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_mdio",
      connected_source_port_ids: ["source_port_u1_mdio", "source_port_u2_mdio"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_txd0",
      connected_source_port_ids: ["source_port_u1_txd0", "source_port_u2_txd0"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rxd1",
      connected_source_port_ids: ["source_port_u1_rxd1", "source_port_u2_rxd1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_refclk",
      connected_source_port_ids: [
        "source_port_u1_refclk",
        "source_port_u2_refclk",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MDIO")
  expect(netlist).toContain("NET: U1_TXD0")
  expect(netlist).toContain("NET: U1_RXD1")
  expect(netlist).toContain("NET: U1_REFCLK")
  expect(netlist).toContain("  - U1 pin1 (MDIO)")
  expect(netlist).toContain("  - U1 pin3 (TXD0)")
  expect(netlist).toContain("  - U1 pin5 (RXD1)")
  expect(netlist).toContain("  - U1 pin7 (REFCLK)")
})
