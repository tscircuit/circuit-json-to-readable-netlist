import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps key-matrix and rotary-encoder aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_input",
      name: "U1",
      manufacturer_part_number: "MCP23017",
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
      source_port_id: "source_port_key_row",
      source_component_id: "source_component_input",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "KEY_ROW", "KEY_MATRIX"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_key_row",
      source_component_id: "source_component_mcu",
      name: "pin26",
      pin_number: 26,
      port_hints: ["26", "pin26", "GPIO_SCAN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_encoder_a",
      source_component_id: "source_component_input",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "ROTARY_ENCODER", "ENCODER_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_encoder_a",
      source_component_id: "source_component_mcu",
      name: "pin27",
      pin_number: 27,
      port_hints: ["27", "pin27", "GPIO_CAPTURE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_key_row",
      connected_source_port_ids: [
        "source_port_key_row",
        "source_port_mcu_key_row",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_encoder_a",
      connected_source_port_ids: [
        "source_port_encoder_a",
        "source_port_mcu_encoder_a",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_KEY_MATRIX")
  expect(netlist).toContain("  - U1 pin10 (KEY_ROW,KEY_MATRIX)")
  expect(netlist).toContain("NET: U1_ROTARY_ENCODER")
  expect(netlist).toContain("  - U1 pin11 (ROTARY_ENCODER,ENCODER_A)")
  expect(netlist).not.toContain("undefined")
})
