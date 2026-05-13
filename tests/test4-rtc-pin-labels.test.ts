import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps RTC alarm and square-wave aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_rtc",
      name: "U1",
      manufacturer_part_number: "DS3231",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "STM32",
    },
    {
      type: "source_port",
      source_port_id: "source_port_rtc_alarm",
      source_component_id: "source_component_rtc",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "RTC_ALARM", "ALARM_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_alarm",
      source_component_id: "source_component_mcu",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "GPIO_WAKE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_rtc_sqw",
      source_component_id: "source_component_rtc",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "RTC_SQW", "SQW_OUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_sqw",
      source_component_id: "source_component_mcu",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "GPIO_CLOCK"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rtc_alarm",
      connected_source_port_ids: [
        "source_port_rtc_alarm",
        "source_port_mcu_alarm",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rtc_sqw",
      connected_source_port_ids: ["source_port_rtc_sqw", "source_port_mcu_sqw"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RTC_ALARM")
  expect(netlist).toContain("  - U1 pin3 (RTC_ALARM,ALARM_INT)")
  expect(netlist).toContain("NET: U1_RTC_SQW")
  expect(netlist).toContain("  - U1 pin7 (RTC_SQW,SQW_OUT)")
  expect(netlist).not.toContain("undefined")
})
