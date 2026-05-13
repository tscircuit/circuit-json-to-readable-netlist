import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps power monitor pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_power",
      name: "U1",
      manufacturer_part_number: "TPS3850",
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
      source_port_id: "source_port_voltage_monitor",
      source_component_id: "source_component_power",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "VOLTAGE_MONITOR", "RESET_OUTPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_voltage_monitor",
      source_component_id: "source_component_mcu",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "GPIO_POWER"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_regulator_enable",
      source_component_id: "source_component_power",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "REGULATOR_ENABLE", "POWER_FAULT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_regulator_enable",
      source_component_id: "source_component_mcu",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "GPIO_ENABLE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_voltage_monitor",
      connected_source_port_ids: [
        "source_port_voltage_monitor",
        "source_port_mcu_voltage_monitor",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_regulator_enable",
      connected_source_port_ids: [
        "source_port_regulator_enable",
        "source_port_mcu_regulator_enable",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_VOLTAGE_MONITOR")
  expect(netlist).toContain("  - U1 pin2 (VOLTAGE_MONITOR,RESET_OUTPUT)")
  expect(netlist).toContain("NET: U1_REGULATOR_ENABLE")
  expect(netlist).toContain("  - U1 pin4 (REGULATOR_ENABLE,POWER_FAULT)")
  expect(netlist).not.toContain("undefined")
})
