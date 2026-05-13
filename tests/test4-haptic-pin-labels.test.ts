import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps haptic driver pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_haptic",
      name: "U1",
      manufacturer_part_number: "DRV2605",
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
      source_port_id: "source_port_haptic_drive",
      source_component_id: "source_component_haptic",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "HAPTIC_DRIVE", "VIBRATION_MOTOR"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_haptic_drive",
      source_component_id: "source_component_mcu",
      name: "pin20",
      pin_number: 20,
      port_hints: ["20", "pin20", "GPIO_HAPTIC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_brake_control",
      source_component_id: "source_component_haptic",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "BRAKE_CONTROL", "HAPTIC_ENABLE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_brake_control",
      source_component_id: "source_component_mcu",
      name: "pin21",
      pin_number: 21,
      port_hints: ["21", "pin21", "GPIO_BRAKE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_haptic_drive",
      connected_source_port_ids: [
        "source_port_haptic_drive",
        "source_port_mcu_haptic_drive",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_brake_control",
      connected_source_port_ids: [
        "source_port_brake_control",
        "source_port_mcu_brake_control",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HAPTIC_DRIVE")
  expect(netlist).toContain("  - U1 pin4 (HAPTIC_DRIVE,VIBRATION_MOTOR)")
  expect(netlist).toContain("NET: U1_BRAKE_CONTROL")
  expect(netlist).toContain("  - U1 pin5 (BRAKE_CONTROL,HAPTIC_ENABLE)")
  expect(netlist).not.toContain("undefined")
})
