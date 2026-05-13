import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps secure element and NFC pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_secure",
      name: "U1",
      manufacturer_part_number: "ATECC608",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "STM32L4",
    },
    {
      type: "source_port",
      source_port_id: "source_port_secure_wake",
      source_component_id: "source_component_secure",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "SECURE_ELEMENT_WAKE", "SECURE_RESET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_secure_wake",
      source_component_id: "source_component_mcu",
      name: "pin22",
      pin_number: 22,
      port_hints: ["22", "pin22", "GPIO_SECURE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_nfc_field_detect",
      source_component_id: "source_component_secure",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "NFC_FIELD_DETECT", "CARD_EMULATION"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_nfc_field_detect",
      source_component_id: "source_component_mcu",
      name: "pin23",
      pin_number: 23,
      port_hints: ["23", "pin23", "GPIO_NFC"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_secure_wake",
      connected_source_port_ids: [
        "source_port_secure_wake",
        "source_port_mcu_secure_wake",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_nfc_field_detect",
      connected_source_port_ids: [
        "source_port_nfc_field_detect",
        "source_port_mcu_nfc_field_detect",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SECURE_ELEMENT_WAKE")
  expect(netlist).toContain("  - U1 pin5 (SECURE_ELEMENT_WAKE,SECURE_RESET)")
  expect(netlist).toContain("NET: U1_NFC_FIELD_DETECT")
  expect(netlist).toContain("  - U1 pin6 (NFC_FIELD_DETECT,CARD_EMULATION)")
  expect(netlist).not.toContain("undefined")
})
