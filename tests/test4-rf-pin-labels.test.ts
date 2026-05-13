import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps RF and antenna pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_radio",
      name: "U1",
      manufacturer_part_number: "SX1262",
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
      source_port_id: "source_port_antenna_feed",
      source_component_id: "source_component_radio",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "ANTENNA_FEED", "ANTENNA_MATCH"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_antenna_connector",
      source_component_id: "source_component_mcu",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "GPIO_ANTENNA"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_lna_enable",
      source_component_id: "source_component_radio",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "LNA_ENABLE", "RF_SWITCH"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_lna_enable",
      source_component_id: "source_component_mcu",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GPIO_RF"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_antenna_feed",
      connected_source_port_ids: [
        "source_port_antenna_feed",
        "source_port_antenna_connector",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_lna_enable",
      connected_source_port_ids: [
        "source_port_lna_enable",
        "source_port_mcu_lna_enable",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ANTENNA_FEED")
  expect(netlist).toContain("  - U1 pin2 (ANTENNA_FEED,ANTENNA_MATCH)")
  expect(netlist).toContain("NET: U1_LNA_ENABLE")
  expect(netlist).toContain("  - U1 pin7 (LNA_ENABLE,RF_SWITCH)")
  expect(netlist).not.toContain("undefined")
})
