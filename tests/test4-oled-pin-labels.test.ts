import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps OLED module control and bias pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_oled",
      name: "OLED1",
      manufacturer_part_number: "SSD1306",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_oled_dc",
      source_component_id: "source_component_oled",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "DC", "OLED_DC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_dc",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GP9"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_oled_vcomh",
      source_component_id: "source_component_oled",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "VCOMH"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_vcomh",
      source_component_id: "source_component_mcu",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "GP10"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_oled_dc",
      connected_source_port_ids: ["source_port_oled_dc", "source_port_mcu_dc"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_oled_vcomh",
      connected_source_port_ids: [
        "source_port_oled_vcomh",
        "source_port_mcu_vcomh",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: OLED1_OLED_DC")
  expect(netlist).toContain("  - OLED1 pin4 (DC,OLED_DC)")
  expect(netlist).toContain("NET: OLED1_VCOMH")
  expect(netlist).toContain("  - OLED1 pin10 (VCOMH)")
  expect(netlist).not.toContain("undefined")
})
