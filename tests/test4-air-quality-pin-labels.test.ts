import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps humidity and air-quality sensor aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_sensor",
      name: "U1",
      manufacturer_part_number: "BME680",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ESP32",
    },
    {
      type: "source_port",
      source_port_id: "source_port_humidity",
      source_component_id: "source_component_sensor",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "HUMIDITY_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_humidity",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_voc",
      source_component_id: "source_component_sensor",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "AIR_QUALITY_INT", "VOC_READY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_voc",
      source_component_id: "source_component_mcu",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "GPIO_READY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_humidity",
      connected_source_port_ids: [
        "source_port_humidity",
        "source_port_mcu_humidity",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_voc",
      connected_source_port_ids: ["source_port_voc", "source_port_mcu_voc"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HUMIDITY_ALERT")
  expect(netlist).toContain("  - U1 pin4 (HUMIDITY_ALERT)")
  expect(netlist).toContain("NET: U1_AIR_QUALITY_INT")
  expect(netlist).toContain("  - U1 pin5 (AIR_QUALITY_INT,VOC_READY)")
  expect(netlist).not.toContain("undefined")
})
