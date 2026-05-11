import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps PCIe lane and control aliases above generic pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "PCIe_PHY",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "M2_SOCKET",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_txp",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PCIE_TXP0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_txn",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["PCIE_TXN0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_perst",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["PERST_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_clkreq",
      source_component_id: "source_component_u1",
      name: "pin17",
      pin_number: 17,
      port_hints: ["CLKREQ_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_rxp",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["PCIE_RXP0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_rxn",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["PCIE_RXN0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_perst",
      source_component_id: "source_component_j1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["PERST_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_clkreq",
      source_component_id: "source_component_j1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["CLKREQ_N"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_txp",
      connected_source_port_ids: ["source_port_u1_txp", "source_port_j1_rxp"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_txn",
      connected_source_port_ids: ["source_port_u1_txn", "source_port_j1_rxn"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_perst",
      connected_source_port_ids: [
        "source_port_u1_perst",
        "source_port_j1_perst",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_clkreq",
      connected_source_port_ids: [
        "source_port_u1_clkreq",
        "source_port_j1_clkreq",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_PCIE_TXP0")
  expect(netlist).toContain("  - U1 pin14 (PCIE_TXP0)")
  expect(netlist).toContain("  - J1 pin1 (PCIE_RXP0)")
  expect(netlist).toContain("- pin14(PCIE_TXP0): NETS(U1_PCIE_TXP0)")

  expect(netlist).toContain("NET: U1_PCIE_TXN0")
  expect(netlist).toContain("  - U1 pin15 (PCIE_TXN0)")
  expect(netlist).toContain("  - J1 pin2 (PCIE_RXN0)")

  expect(netlist).toContain("NET: U1_PERST_N")
  expect(netlist).toContain("  - U1 pin16 (PERST_N)")

  expect(netlist).toContain("NET: U1_CLKREQ_N")
  expect(netlist).toContain("  - U1 pin17 (CLKREQ_N)")
})
