import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps LED driver and backlight pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_led_driver",
      name: "U1",
      manufacturer_part_number: "TPS61165",
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
      source_port_id: "source_port_backlight_enable",
      source_component_id: "source_component_led_driver",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "BACKLIGHT_ENABLE", "BACKLIGHT_PWM"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_backlight_enable",
      source_component_id: "source_component_mcu",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "GPIO_BACKLIGHT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_led_current",
      source_component_id: "source_component_led_driver",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "LED_CURRENT_SET", "DIMMING_CONTROL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_led_current",
      source_component_id: "source_component_mcu",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "GPIO_LED"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_backlight_enable",
      connected_source_port_ids: [
        "source_port_backlight_enable",
        "source_port_mcu_backlight_enable",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_led_current",
      connected_source_port_ids: [
        "source_port_led_current",
        "source_port_mcu_led_current",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BACKLIGHT_ENABLE")
  expect(netlist).toContain("  - U1 pin3 (BACKLIGHT_ENABLE,BACKLIGHT_PWM)")
  expect(netlist).toContain("NET: U1_LED_CURRENT_SET")
  expect(netlist).toContain("  - U1 pin5 (LED_CURRENT_SET,DIMMING_CONTROL)")
  expect(netlist).not.toContain("undefined")
})
