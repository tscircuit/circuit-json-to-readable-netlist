import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps audio codec pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_codec",
      name: "U1",
      manufacturer_part_number: "WM8960",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_audio_clock",
      source_component_id: "source_component_codec",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "AUDIO_BCLK", "AUDIO_MCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_audio_clock",
      source_component_id: "source_component_mcu",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "GPIO_AUDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_microphone_bias",
      source_component_id: "source_component_codec",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "MICROPHONE_BIAS", "HEADPHONE_DETECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_microphone_bias",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_MIC"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_audio_clock",
      connected_source_port_ids: [
        "source_port_audio_clock",
        "source_port_mcu_audio_clock",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_microphone_bias",
      connected_source_port_ids: [
        "source_port_microphone_bias",
        "source_port_mcu_microphone_bias",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_AUDIO_BCLK")
  expect(netlist).toContain("  - U1 pin5 (AUDIO_BCLK,AUDIO_MCLK)")
  expect(netlist).toContain("NET: U1_MICROPHONE_BIAS")
  expect(netlist).toContain("  - U1 pin9 (MICROPHONE_BIAS,HEADPHONE_DETECT)")
  expect(netlist).not.toContain("undefined")
})
