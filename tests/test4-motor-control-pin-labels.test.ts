import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps BLDC motor-control aliases readable on generic physical pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_driver",
      name: "U1",
      manufacturer_part_number: "DRV8313",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_motor",
      name: "M1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_phase_u_driver",
      source_component_id: "source_component_driver",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "PHASE_U1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_phase_u_motor",
      source_component_id: "source_component_motor",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "PHASE_U1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_phase_v_driver",
      source_component_id: "source_component_driver",
      name: "pin15",
      pin_number: 15,
      port_hints: ["15", "pin15", "PHASE_V1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_phase_v_motor",
      source_component_id: "source_component_motor",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "PHASE_V1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_hall_a_driver",
      source_component_id: "source_component_driver",
      name: "pin16",
      pin_number: 16,
      port_hints: ["16", "pin16", "HALL_A1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_hall_a_motor",
      source_component_id: "source_component_motor",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "HALL_A1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_bemf_u_driver",
      source_component_id: "source_component_driver",
      name: "pin17",
      pin_number: 17,
      port_hints: ["17", "pin17", "BEMF_U1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_bemf_u_sense",
      source_component_id: "source_component_motor",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "BEMF_U1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_phase_u",
      connected_source_port_ids: [
        "source_port_phase_u_driver",
        "source_port_phase_u_motor",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_phase_v",
      connected_source_port_ids: [
        "source_port_phase_v_driver",
        "source_port_phase_v_motor",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_hall_a",
      connected_source_port_ids: [
        "source_port_hall_a_driver",
        "source_port_hall_a_motor",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_bemf_u",
      connected_source_port_ids: [
        "source_port_bemf_u_driver",
        "source_port_bemf_u_sense",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PHASE_U1")
  expect(netlist).toContain("  - U1 pin14 (PHASE_U1)")
  expect(netlist).toContain("NET: U1_PHASE_V1")
  expect(netlist).toContain("  - U1 pin15 (PHASE_V1)")
  expect(netlist).toContain("NET: U1_HALL_A1")
  expect(netlist).toContain("  - U1 pin16 (HALL_A1)")
  expect(netlist).toContain("NET: U1_BEMF_U1")
  expect(netlist).toContain("  - U1 pin17 (BEMF_U1)")
  expect(netlist).toContain("- pin14(PHASE_U1): NETS(U1_PHASE_U1)")
  expect(netlist).toContain("- pin15(PHASE_V1): NETS(U1_PHASE_V1)")
  expect(netlist).toContain("- pin16(HALL_A1): NETS(U1_HALL_A1)")
  expect(netlist).toContain("- pin17(BEMF_U1): NETS(U1_BEMF_U1)")
  expect(netlist).not.toContain("undefined")
})
