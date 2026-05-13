import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps battery charger pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_charger",
      name: "U1",
      manufacturer_part_number: "BQ24074",
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
      source_port_id: "source_port_charge_status",
      source_component_id: "source_component_charger",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "CHARGE_STATUS", "POWER_GOOD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_charge_status",
      source_component_id: "source_component_mcu",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "GPIO_STATUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_battery_sense",
      source_component_id: "source_component_charger",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "BATTERY_SENSE", "BATTERY_THERMISTOR"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_battery_sense",
      source_component_id: "source_component_mcu",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "GPIO_BATTERY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_charge_status",
      connected_source_port_ids: [
        "source_port_charge_status",
        "source_port_mcu_charge_status",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_battery_sense",
      connected_source_port_ids: [
        "source_port_battery_sense",
        "source_port_mcu_battery_sense",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CHARGE_STATUS")
  expect(netlist).toContain("  - U1 pin4 (CHARGE_STATUS,POWER_GOOD)")
  expect(netlist).toContain("NET: U1_BATTERY_SENSE")
  expect(netlist).toContain("  - U1 pin8 (BATTERY_SENSE,BATTERY_THERMISTOR)")
  expect(netlist).not.toContain("undefined")
})
