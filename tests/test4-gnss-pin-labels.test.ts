import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps GNSS module pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_gnss",
      name: "U1",
      manufacturer_part_number: "NEO-M9N",
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
      source_port_id: "source_port_gnss_timepulse",
      source_component_id: "source_component_gnss",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "GNSS_TIMEPULSE", "GPS_TIMEPULSE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_timepulse",
      source_component_id: "source_component_mcu",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "GPIO_TIMER"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_gnss_rf",
      source_component_id: "source_component_gnss",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GNSS_RF_IN", "ANTENNA_BIAS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_antenna",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_ANTENNA"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_timepulse",
      connected_source_port_ids: [
        "source_port_gnss_timepulse",
        "source_port_mcu_timepulse",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rf",
      connected_source_port_ids: ["source_port_gnss_rf", "source_port_antenna"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_GNSS_TIMEPULSE")
  expect(netlist).toContain("  - U1 pin3 (GNSS_TIMEPULSE,GPS_TIMEPULSE)")
  expect(netlist).toContain("NET: U1_GNSS_RF_IN")
  expect(netlist).toContain("  - U1 pin11 (GNSS_RF_IN,ANTENNA_BIAS)")
  expect(netlist).not.toContain("undefined")
})
