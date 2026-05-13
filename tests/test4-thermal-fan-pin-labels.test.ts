import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps thermal sensor and fan tach aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_thermal",
      name: "U1",
      manufacturer_part_number: "TMP117",
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
      source_port_id: "source_port_temp_alert",
      source_component_id: "source_component_thermal",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "TEMP_ALERT", "THERMAL_SHUTDOWN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_temp_alert",
      source_component_id: "source_component_mcu",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GPIO_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fan_tach",
      source_component_id: "source_component_thermal",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "FAN_TACH", "TACH_OUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_fan_tach",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_CAPTURE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_temp_alert",
      connected_source_port_ids: [
        "source_port_temp_alert",
        "source_port_mcu_temp_alert",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_fan_tach",
      connected_source_port_ids: [
        "source_port_fan_tach",
        "source_port_mcu_fan_tach",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_TEMP_ALERT")
  expect(netlist).toContain("  - U1 pin4 (TEMP_ALERT,THERMAL_SHUTDOWN)")
  expect(netlist).toContain("NET: U1_FAN_TACH")
  expect(netlist).toContain("  - U1 pin5 (FAN_TACH,TACH_OUT)")
  expect(netlist).not.toContain("undefined")
})
