import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps CAN and LIN transceiver pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_transceiver",
      name: "U1",
      manufacturer_part_number: "TJA1051",
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
      source_port_id: "source_port_can_high",
      source_component_id: "source_component_transceiver",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "CAN_HIGH", "CAN_LOW"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_bus_connector",
      source_component_id: "source_component_mcu",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "GPIO_BUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_standby_control",
      source_component_id: "source_component_transceiver",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "STANDBY_CONTROL", "WAKE_OUTPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_standby_control",
      source_component_id: "source_component_mcu",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "GPIO_STANDBY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_can_high",
      connected_source_port_ids: [
        "source_port_can_high",
        "source_port_bus_connector",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_standby_control",
      connected_source_port_ids: [
        "source_port_standby_control",
        "source_port_mcu_standby_control",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CAN_HIGH")
  expect(netlist).toContain("  - U1 pin6 (CAN_HIGH,CAN_LOW)")
  expect(netlist).toContain("NET: U1_STANDBY_CONTROL")
  expect(netlist).toContain("  - U1 pin8 (STANDBY_CONTROL,WAKE_OUTPUT)")
  expect(netlist).not.toContain("undefined")
})
