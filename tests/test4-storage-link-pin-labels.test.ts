import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves SATA and SAS storage link aliases on generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_storage_controller",
      name: "U1",
      manufacturer_part_number: "ASM1061",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_storage_connector",
      name: "J1",
      manufacturer_part_number: "SFF-8482",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_sata_txp",
      source_component_id: "source_component_storage_controller",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "SATA_TXP0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_sata_txp",
      source_component_id: "source_component_storage_connector",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "SATA_TXP0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_sas_rxn",
      source_component_id: "source_component_storage_controller",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "SAS_RXN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_sas_rxn",
      source_component_id: "source_component_storage_connector",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2", "SAS_RXN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_devslp",
      source_component_id: "source_component_storage_controller",
      name: "pin16",
      pin_number: 16,
      port_hints: ["pin16", "DEVSLP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_devslp",
      source_component_id: "source_component_storage_connector",
      name: "pin3",
      pin_number: 3,
      port_hints: ["pin3", "DEVSLP"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sata_txp",
      connected_source_port_ids: [
        "source_port_u1_sata_txp",
        "source_port_j1_sata_txp",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sas_rxn",
      connected_source_port_ids: [
        "source_port_u1_sas_rxn",
        "source_port_j1_sas_rxn",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_devslp",
      connected_source_port_ids: [
        "source_port_u1_devslp",
        "source_port_j1_devslp",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SATA_TXP0")
  expect(netlist).toContain("  - U1 pin14 (SATA_TXP0)")
  expect(netlist).toContain("  - J1 pin1 (SATA_TXP0)")
  expect(netlist).toContain("NET: U1_SAS_RXN1")
  expect(netlist).toContain("  - U1 pin15 (SAS_RXN1)")
  expect(netlist).toContain("  - J1 pin2 (SAS_RXN1)")
  expect(netlist).toContain("NET: U1_DEVSLP")
  expect(netlist).toContain("  - U1 pin16 (DEVSLP)")
  expect(netlist).toContain("  - J1 pin3 (DEVSLP)")
})
