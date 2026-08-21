import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes USB differential labels on generic pin net entries", () => {
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
      source_port_id: "source_port_u1_dp",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_dp",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_dm",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["D-"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_dm",
      source_component_id: "source_component_j1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["D-"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_dp",
      connected_source_port_ids: ["source_port_u1_dp", "source_port_j1_dp"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_dm",
      connected_source_port_ids: ["source_port_u1_dm", "source_port_j1_dm"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("  - U1 pin14 (D+)")
  expect(netlist).toContain("  - J1 pin2 (D+)")
  expect(netlist).toContain("  - U1 pin15 (D-)")
  expect(netlist).toContain("  - J1 pin3 (D-)")
})
