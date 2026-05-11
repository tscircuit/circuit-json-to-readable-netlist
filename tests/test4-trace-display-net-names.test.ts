import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses source trace display names when generating readable net names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1kΩ",
      are_pins_interchangeable: true,
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right", "pin2", "2"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_capacitor",
      name: "C1",
      capacitance: 1e-9,
      display_capacitance: "1nF",
      are_pins_interchangeable: true,
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      name: "pin2",
      pin_number: 2,
      port_hints: ["neg", "cathode", "right", "pin2", "2"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
      display_name: "VBUS",
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: VBUS")
  expect(netlist).toContain("- pin1(anode, pos, left): NETS(VBUS)")
  expect(netlist).toContain("- pin1(pos, anode, left): NETS(VBUS)")
  expect(netlist).not.toContain("NET: C1_pos")
})
