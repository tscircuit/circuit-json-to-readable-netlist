import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps wireless module pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_wireless",
      name: "U1",
      manufacturer_part_number: "ESP32-WROOM",
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
      source_port_id: "source_port_wifi_enable",
      source_component_id: "source_component_wireless",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "WIFI_ENABLE", "WIFI_WAKE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_wifi_enable",
      source_component_id: "source_component_mcu",
      name: "pin16",
      pin_number: 16,
      port_hints: ["16", "pin16", "GPIO_WIFI"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_coexistence_grant",
      source_component_id: "source_component_wireless",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "COEXISTENCE_GRANT", "COEXISTENCE_REQUEST"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_coexistence_grant",
      source_component_id: "source_component_mcu",
      name: "pin17",
      pin_number: 17,
      port_hints: ["17", "pin17", "GPIO_COEX"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_wifi_enable",
      connected_source_port_ids: [
        "source_port_wifi_enable",
        "source_port_mcu_wifi_enable",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_coexistence_grant",
      connected_source_port_ids: [
        "source_port_coexistence_grant",
        "source_port_mcu_coexistence_grant",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_WIFI_ENABLE")
  expect(netlist).toContain("  - U1 pin7 (WIFI_ENABLE,WIFI_WAKE)")
  expect(netlist).toContain("NET: U1_COEXISTENCE_GRANT")
  expect(netlist).toContain(
    "  - U1 pin8 (COEXISTENCE_GRANT,COEXISTENCE_REQUEST)",
  )
  expect(netlist).not.toContain("undefined")
})
