import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves op-amp and comparator aliases on generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "soic14",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["OPAMP_INP1", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["CMP_OUT1", "pin15", "15"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R2",
      display_resistance: "20k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "pin1", "1"],
      source_component_id: "source_component_2",
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

  expect(netlist).toContain("NET: U1_OPAMP_INP1")
  expect(netlist).toContain("NET: U1_CMP_OUT1")
  expect(netlist).toContain("  - U1 pin14 (OPAMP_INP1)")
  expect(netlist).toContain("  - U1 pin15 (CMP_OUT1)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: R2_pos")
})
