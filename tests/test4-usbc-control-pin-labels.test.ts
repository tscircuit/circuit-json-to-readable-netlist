import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes USB-C power and control labels on generic pin net entries", () => {
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
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "USB-C",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_vbus",
      source_component_id: "source_component_u1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["VBUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_vbus",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["VBUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_vconn",
      source_component_id: "source_component_u1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["VCONN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_vconn",
      source_component_id: "source_component_j1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["VCONN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_cc1",
      source_component_id: "source_component_u1",
      name: "pin5",
      pin_number: 5,
      port_hints: ["CC1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_cc1",
      source_component_id: "source_component_j1",
      name: "pin6",
      pin_number: 6,
      port_hints: ["CC1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_cc2",
      source_component_id: "source_component_u1",
      name: "pin7",
      pin_number: 7,
      port_hints: ["CC2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_cc2",
      source_component_id: "source_component_j1",
      name: "pin8",
      pin_number: 8,
      port_hints: ["CC2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_sbu1",
      source_component_id: "source_component_u1",
      name: "pin9",
      pin_number: 9,
      port_hints: ["SBU1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_sbu1",
      source_component_id: "source_component_j1",
      name: "pin10",
      pin_number: 10,
      port_hints: ["SBU1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_sbu2",
      source_component_id: "source_component_u1",
      name: "pin11",
      pin_number: 11,
      port_hints: ["SBU2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_sbu2",
      source_component_id: "source_component_j1",
      name: "pin12",
      pin_number: 12,
      port_hints: ["SBU2"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_vbus",
      connected_source_port_ids: ["source_port_u1_vbus", "source_port_j1_vbus"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_vconn",
      connected_source_port_ids: [
        "source_port_u1_vconn",
        "source_port_j1_vconn",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_cc1",
      connected_source_port_ids: ["source_port_u1_cc1", "source_port_j1_cc1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_cc2",
      connected_source_port_ids: ["source_port_u1_cc2", "source_port_j1_cc2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sbu1",
      connected_source_port_ids: ["source_port_u1_sbu1", "source_port_j1_sbu1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sbu2",
      connected_source_port_ids: ["source_port_u1_sbu2", "source_port_j1_sbu2"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_VBUS")
  expect(netlist).toContain("NET: U1_VCONN")
  expect(netlist).toContain("NET: U1_CC1")
  expect(netlist).toContain("NET: U1_CC2")
  expect(netlist).toContain("NET: U1_SBU1")
  expect(netlist).toContain("NET: U1_SBU2")
  expect(netlist).toContain("  - U1 pin1 (VBUS)")
  expect(netlist).toContain("  - U1 pin3 (VCONN)")
  expect(netlist).toContain("  - U1 pin5 (CC1)")
  expect(netlist).toContain("  - U1 pin7 (CC2)")
  expect(netlist).toContain("  - U1 pin9 (SBU1)")
  expect(netlist).toContain("  - U1 pin11 (SBU2)")
})
