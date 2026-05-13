import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps infrared receiver and photodiode aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_infrared",
      name: "U1",
      manufacturer_part_number: "TSOP38238",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ESP32",
    },
    {
      type: "source_port",
      source_port_id: "source_port_ir_receiver",
      source_component_id: "source_component_infrared",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "IR_RECEIVER", "IR_DEMOD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_ir_receiver",
      source_component_id: "source_component_mcu",
      name: "pin22",
      pin_number: 22,
      port_hints: ["22", "pin22", "GPIO_REMOTE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_photodiode",
      source_component_id: "source_component_infrared",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "PHOTODIODE", "OPTICAL_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_photodiode",
      source_component_id: "source_component_mcu",
      name: "pin23",
      pin_number: 23,
      port_hints: ["23", "pin23", "GPIO_OPTICAL"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ir_receiver",
      connected_source_port_ids: [
        "source_port_ir_receiver",
        "source_port_mcu_ir_receiver",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_photodiode",
      connected_source_port_ids: [
        "source_port_photodiode",
        "source_port_mcu_photodiode",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IR_RECEIVER")
  expect(netlist).toContain("  - U1 pin2 (IR_RECEIVER,IR_DEMOD)")
  expect(netlist).toContain("NET: U1_PHOTODIODE")
  expect(netlist).toContain("  - U1 pin3 (PHOTODIODE,OPTICAL_INT)")
  expect(netlist).not.toContain("undefined")
})
