import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps EEPROM and FRAM control aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_memory",
      name: "U1",
      manufacturer_part_number: "FM25V10",
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
      source_port_id: "source_port_eeprom_wp",
      source_component_id: "source_component_memory",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "EEPROM_WP", "WRITE_PROTECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_eeprom_wp",
      source_component_id: "source_component_mcu",
      name: "pin16",
      pin_number: 16,
      port_hints: ["16", "pin16", "GPIO_PROTECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fram_ready",
      source_component_id: "source_component_memory",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "FRAM_READY", "NVM_READY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_fram_ready",
      source_component_id: "source_component_mcu",
      name: "pin17",
      pin_number: 17,
      port_hints: ["17", "pin17", "GPIO_READY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_eeprom_wp",
      connected_source_port_ids: [
        "source_port_eeprom_wp",
        "source_port_mcu_eeprom_wp",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_fram_ready",
      connected_source_port_ids: [
        "source_port_fram_ready",
        "source_port_mcu_fram_ready",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_EEPROM_WP")
  expect(netlist).toContain("  - U1 pin3 (EEPROM_WP,WRITE_PROTECT)")
  expect(netlist).toContain("NET: U1_FRAM_READY")
  expect(netlist).toContain("  - U1 pin7 (FRAM_READY,NVM_READY)")
  expect(netlist).not.toContain("undefined")
})
