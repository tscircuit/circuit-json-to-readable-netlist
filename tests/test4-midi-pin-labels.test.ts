import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("preserves MIDI aliases on generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MIDI_CTRL",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["MIDI_CH1", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
      are_pins_interchangeable: true,
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right", "pin2", "2"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_MIDI_CH1")
  expect(netlist).toContain("  - U1 pin14 (MIDI_CH1)")
  expect(netlist).toContain("- pin14(MIDI_CH1): NETS(U1_MIDI_CH1)")
})

it("preserves stronger signal scores for MIDI aliases", () => {
  expect(scorePhrase("MIDI_CH1")).toBe(1.15)
  expect(scorePhrase("MIDI_SCLK")).toBe(1.2)
  expect(scorePhrase("MIDI_MISO")).toBe(1.2)
})
