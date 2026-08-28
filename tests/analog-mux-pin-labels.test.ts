import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores analog mux aliases above generic numbered pins", () => {
  expect(scorePhrase("MUX_A0")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MUX_EN")).toBeGreaterThan(scorePhrase("pin15"))
  expect(scorePhrase("SEL0")).toBeGreaterThan(scorePhrase("pin1"))
  expect(scorePhrase("COM0")).toBeGreaterThan(scorePhrase("pin2"))
})

it("keeps analog mux control labels in generated net names and pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "ADG704",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["MUX_A0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["MUX_EN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["neg", "cathode", "right"],
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

  expect(netlist).toContain("NET: U1_MUX_A0")
  expect(netlist).toContain("  - U1 pin14 (MUX_A0)")
  expect(netlist).toContain("- pin14(MUX_A0): NETS(U1_MUX_A0)")
  expect(netlist).toContain("NET: U1_MUX_EN")
  expect(netlist).toContain("  - U1 pin15 (MUX_EN)")
  expect(netlist).toContain("- pin15(MUX_EN): NETS(U1_MUX_EN)")
})
