import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps touch and display panel pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_panel",
      name: "U1",
      manufacturer_part_number: "ILI9341",
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
      source_port_id: "source_port_touch_interrupt",
      source_component_id: "source_component_panel",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "TOUCH_INTERRUPT", "TOUCH_RESET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_touch_interrupt",
      source_component_id: "source_component_mcu",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "GPIO_TOUCH"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_display_data_enable",
      source_component_id: "source_component_panel",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "DISPLAY_DATA_ENABLE", "DISPLAY_TE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_display_data_enable",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_DISPLAY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_touch_interrupt",
      connected_source_port_ids: [
        "source_port_touch_interrupt",
        "source_port_mcu_touch_interrupt",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_display_data_enable",
      connected_source_port_ids: [
        "source_port_display_data_enable",
        "source_port_mcu_display_data_enable",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_TOUCH_INTERRUPT")
  expect(netlist).toContain("  - U1 pin6 (TOUCH_INTERRUPT,TOUCH_RESET)")
  expect(netlist).toContain("NET: U1_DISPLAY_DATA_ENABLE")
  expect(netlist).toContain("  - U1 pin10 (DISPLAY_DATA_ENABLE,DISPLAY_TE)")
  expect(netlist).not.toContain("undefined")
})
