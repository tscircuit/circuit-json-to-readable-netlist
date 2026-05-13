import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps storage interface pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_storage",
      name: "U1",
      manufacturer_part_number: "SDMMC-SOCKET",
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
      source_port_id: "source_port_card_detect",
      source_component_id: "source_component_storage",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "SD_CARD_DETECT", "SD_WRITE_PROTECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_card_detect",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GPIO_CARD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_flash_select",
      source_component_id: "source_component_storage",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "FLASH_CHIP_SELECT", "MEMORY_READY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_flash_select",
      source_component_id: "source_component_mcu",
      name: "pin15",
      pin_number: 15,
      port_hints: ["15", "pin15", "GPIO_FLASH"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_card_detect",
      connected_source_port_ids: [
        "source_port_card_detect",
        "source_port_mcu_card_detect",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_flash_select",
      connected_source_port_ids: [
        "source_port_flash_select",
        "source_port_mcu_flash_select",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SD_CARD_DETECT")
  expect(netlist).toContain("  - U1 pin8 (SD_CARD_DETECT,SD_WRITE_PROTECT)")
  expect(netlist).toContain("NET: U1_FLASH_CHIP_SELECT")
  expect(netlist).toContain("  - U1 pin9 (FLASH_CHIP_SELECT,MEMORY_READY)")
  expect(netlist).not.toContain("undefined")
})
