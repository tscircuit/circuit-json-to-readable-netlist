import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves MIDI control labels on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "MIDI-CONTROLLER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "DIN-5-MIDI",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["MIDI_CH1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["MIDI_IN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["MIDI_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["MIDI_THRU1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_3", "source_port_4"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MIDI_CH1")
  expect(netlist).toContain("  - U1 pin14 (MIDI_CH1)")
  expect(netlist).toContain("  - J1 pin1 (MIDI_IN1)")
  expect(netlist).toContain("NET: U1_MIDI_OUT1")
  expect(netlist).toContain("  - U1 pin15 (MIDI_OUT1)")
  expect(netlist).toContain("  - J1 pin2 (MIDI_THRU1)")
  expect(netlist).toContain("- pin14(MIDI_CH1): NETS(U1_MIDI_CH1)")
  expect(netlist).toContain("- pin15(MIDI_OUT1): NETS(U1_MIDI_OUT1)")
})
