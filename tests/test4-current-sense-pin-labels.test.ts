import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps current-sense and shunt-monitor aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_current_sensor",
      name: "U1",
      manufacturer_part_number: "INA219",
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
      source_port_id: "source_port_current_sense",
      source_component_id: "source_component_current_sensor",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "CURRENT_SENSE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_current_sense",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GPIO_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_shunt_monitor",
      source_component_id: "source_component_current_sensor",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "SHUNT_MONITOR", "IPROPI"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_shunt_monitor",
      source_component_id: "source_component_mcu",
      name: "pin15",
      pin_number: 15,
      port_hints: ["15", "pin15", "GPIO_FAULT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_current_sense",
      connected_source_port_ids: [
        "source_port_current_sense",
        "source_port_mcu_current_sense",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_shunt_monitor",
      connected_source_port_ids: [
        "source_port_shunt_monitor",
        "source_port_mcu_shunt_monitor",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CURRENT_SENSE")
  expect(netlist).toContain("  - U1 pin3 (CURRENT_SENSE)")
  expect(netlist).toContain("NET: U1_SHUNT_MONITOR")
  expect(netlist).toContain("  - U1 pin4 (SHUNT_MONITOR,IPROPI)")
  expect(netlist).not.toContain("undefined")
})
