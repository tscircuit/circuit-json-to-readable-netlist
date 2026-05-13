import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps level shifter pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_translator",
      name: "U1",
      manufacturer_part_number: "TXS0108E",
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
      source_port_id: "source_port_direction_control",
      source_component_id: "source_component_translator",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "DIRECTION_CONTROL", "OUTPUT_ENABLE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_direction_control",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_DIRECTION"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_voltage_domain",
      source_component_id: "source_component_translator",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "VOLTAGE_DOMAIN", "LEVEL_TRANSLATOR"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_voltage_domain",
      source_component_id: "source_component_mcu",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "GPIO_DOMAIN"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_direction_control",
      connected_source_port_ids: [
        "source_port_direction_control",
        "source_port_mcu_direction_control",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_voltage_domain",
      connected_source_port_ids: [
        "source_port_voltage_domain",
        "source_port_mcu_voltage_domain",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DIRECTION_CONTROL")
  expect(netlist).toContain("  - U1 pin4 (DIRECTION_CONTROL,OUTPUT_ENABLE)")
  expect(netlist).toContain("NET: U1_VOLTAGE_DOMAIN")
  expect(netlist).toContain("  - U1 pin5 (VOLTAGE_DOMAIN,LEVEL_TRANSLATOR)")
  expect(netlist).not.toContain("undefined")
})
