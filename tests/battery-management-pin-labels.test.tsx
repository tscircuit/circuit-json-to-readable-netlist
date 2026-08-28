import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves battery charger and fuel-gauge aliases for generic chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "BQ25895",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "BATTERY_HEADER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_3",
      name: "J2",
      manufacturer_part_number: "STATUS_HEADER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_4",
      name: "B1",
      manufacturer_part_number: "LI_ION_CELL",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      name: "pin14",
      port_hints: ["BAT_SNS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      name: "pin15",
      port_hints: ["CHG_STAT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      pin_number: 16,
      name: "pin16",
      port_hints: ["CELL1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pin1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pin1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_4",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pin1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_4"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_6"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BAT_SNS")
  expect(netlist).toContain("  - U1 pin14 (BAT_SNS)")
  expect(netlist).toContain("NET: U1_CHG_STAT1")
  expect(netlist).toContain("  - U1 pin15 (CHG_STAT1)")
  expect(netlist).toContain("NET: U1_CELL1")
  expect(netlist).toContain("  - U1 pin16 (CELL1)")
})
