import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps boot and address strap pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_strapped",
      name: "U1",
      manufacturer_part_number: "STM32F411",
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
      source_port_id: "source_port_boot_mode",
      source_component_id: "source_component_strapped",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "BOOT_MODE", "BOOT_SELECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_boot_mode",
      source_component_id: "source_component_mcu",
      name: "pin18",
      pin_number: 18,
      port_hints: ["18", "pin18", "GPIO_BOOT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_address_select",
      source_component_id: "source_component_strapped",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "ADDRESS_SELECT", "CONFIG_STRAP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_address_select",
      source_component_id: "source_component_mcu",
      name: "pin19",
      pin_number: 19,
      port_hints: ["19", "pin19", "GPIO_ADDRESS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_boot_mode",
      connected_source_port_ids: [
        "source_port_boot_mode",
        "source_port_mcu_boot_mode",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_address_select",
      connected_source_port_ids: [
        "source_port_address_select",
        "source_port_mcu_address_select",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BOOT_MODE")
  expect(netlist).toContain("  - U1 pin12 (BOOT_MODE,BOOT_SELECT)")
  expect(netlist).toContain("NET: U1_ADDRESS_SELECT")
  expect(netlist).toContain("  - U1 pin13 (ADDRESS_SELECT,CONFIG_STRAP)")
  expect(netlist).not.toContain("undefined")
})
