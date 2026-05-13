import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps ADC and DAC converter pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_converter",
      name: "U1",
      manufacturer_part_number: "ADS8320",
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
      source_port_id: "source_port_reference_voltage",
      source_component_id: "source_component_converter",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "REFERENCE_VOLTAGE", "ANALOG_INPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_reference",
      source_component_id: "source_component_mcu",
      name: "pin26",
      pin_number: 26,
      port_hints: ["26", "pin26", "GPIO_REFERENCE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_conversion_start",
      source_component_id: "source_component_converter",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "CONVERSION_START", "DATA_READY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_conversion_start",
      source_component_id: "source_component_mcu",
      name: "pin27",
      pin_number: 27,
      port_hints: ["27", "pin27", "GPIO_CONVERT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_reference_voltage",
      connected_source_port_ids: [
        "source_port_reference_voltage",
        "source_port_mcu_reference",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_conversion_start",
      connected_source_port_ids: [
        "source_port_conversion_start",
        "source_port_mcu_conversion_start",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_REFERENCE_VOLTAGE")
  expect(netlist).toContain("  - U1 pin3 (REFERENCE_VOLTAGE,ANALOG_INPUT)")
  expect(netlist).toContain("NET: U1_CONVERSION_START")
  expect(netlist).toContain("  - U1 pin6 (CONVERSION_START,DATA_READY)")
  expect(netlist).not.toContain("undefined")
})
