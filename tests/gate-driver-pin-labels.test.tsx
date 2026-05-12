import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves isolated gate-driver and protection pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "UCC21520",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10Ω",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_capacitor",
      name: "C1",
      display_capacitance: "100nF",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "GATE1_H"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "DESAT1", "ISO_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_GATE1_H")
  expect(netlist).toContain("  - U1 pin14 (GATE1_H)")
  expect(netlist).toContain("NET: U1_DESAT1")
  expect(netlist).toContain("  - U1 pin15 (DESAT1,ISO_OUT1)")
  expect(netlist).toContain("- pin15(DESAT1, ISO_OUT1): NETS(U1_DESAT1)")
})
