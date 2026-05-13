import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps fuel gauge and battery pack pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_gauge",
      name: "U1",
      manufacturer_part_number: "MAX17048",
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
      source_port_id: "source_port_state_of_charge",
      source_component_id: "source_component_gauge",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "STATE_OF_CHARGE", "BATTERY_GAUGE_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_state_of_charge",
      source_component_id: "source_component_mcu",
      name: "pin24",
      pin_number: 24,
      port_hints: ["24", "pin24", "GPIO_GAUGE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_pack_present",
      source_component_id: "source_component_gauge",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "PACK_PRESENT", "BATTERY_PACK_SENSE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_pack_present",
      source_component_id: "source_component_mcu",
      name: "pin25",
      pin_number: 25,
      port_hints: ["25", "pin25", "GPIO_PACK"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_state_of_charge",
      connected_source_port_ids: [
        "source_port_state_of_charge",
        "source_port_mcu_state_of_charge",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_pack_present",
      connected_source_port_ids: [
        "source_port_pack_present",
        "source_port_mcu_pack_present",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_STATE_OF_CHARGE")
  expect(netlist).toContain("  - U1 pin6 (STATE_OF_CHARGE,BATTERY_GAUGE_ALERT)")
  expect(netlist).toContain("NET: U1_PACK_PRESENT")
  expect(netlist).toContain("  - U1 pin7 (PACK_PRESENT,BATTERY_PACK_SENSE)")
  expect(netlist).not.toContain("undefined")
})
