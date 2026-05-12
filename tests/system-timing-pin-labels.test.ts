import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores system timing and supervision aliases above generic numbered pins", () => {
  expect(scorePhrase("RTC_CLK")).toBeGreaterThan(1)
  expect(scorePhrase("WDT_RST")).toBeGreaterThan(1)
  expect(scorePhrase("IWDG_KICK")).toBeGreaterThan(1)
  expect(scorePhrase("TIM1_CH1")).toBeGreaterThan(1)
  expect(scorePhrase("LPTIM1_OUT")).toBeGreaterThan(1)
  expect(scorePhrase("PWM_TIM2")).toBeGreaterThan(1)
  expect(scorePhrase("CCP1")).toBeGreaterThan(1)
  expect(scorePhrase("CAPTURE2")).toBeGreaterThan(1)
})

it("preserves system timing and watchdog pin aliases in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "TIMING-MCU",
    } as any,
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_header",
      name: "J1",
      manufacturer_part_number: "TIMING-HEADER",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_mcu_rtc",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RTC_CLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_wdt",
      source_component_id: "source_component_mcu",
      name: "pin15",
      pin_number: 15,
      port_hints: ["WDT_RST"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_tim",
      source_component_id: "source_component_mcu",
      name: "pin16",
      pin_number: 16,
      port_hints: ["TIM1_CH1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_header_rtc",
      source_component_id: "source_component_header",
      name: "pin1",
      pin_number: 1,
      port_hints: ["HDR1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_header_wdt",
      source_component_id: "source_component_header",
      name: "pin2",
      pin_number: 2,
      port_hints: ["HDR2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_header_tim",
      source_component_id: "source_component_header",
      name: "pin3",
      pin_number: 3,
      port_hints: ["HDR3"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rtc",
      connected_source_port_ids: [
        "source_port_mcu_rtc",
        "source_port_header_rtc",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_wdt",
      connected_source_port_ids: [
        "source_port_mcu_wdt",
        "source_port_header_wdt",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tim",
      connected_source_port_ids: [
        "source_port_mcu_tim",
        "source_port_header_tim",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RTC_CLK")
  expect(netlist).toContain("  - U1 pin14 (RTC_CLK)")
  expect(netlist).toContain("NET: U1_WDT_RST")
  expect(netlist).toContain("  - U1 pin15 (WDT_RST)")
  expect(netlist).toContain("NET: U1_TIM1_CH1")
  expect(netlist).toContain("  - U1 pin16 (TIM1_CH1)")
})
