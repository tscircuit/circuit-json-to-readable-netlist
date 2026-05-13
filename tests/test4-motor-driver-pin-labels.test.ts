import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps motor-driver pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_motor_driver",
      name: "U1",
      manufacturer_part_number: "DRV8313",
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
      source_port_id: "source_port_phase_u",
      source_component_id: "source_component_motor_driver",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "MOTOR_PHASE", "PHASE_U"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_phase_u",
      source_component_id: "source_component_mcu",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "GPIO_MOTOR"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_motor_fault",
      source_component_id: "source_component_motor_driver",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "MOTOR_FAULT", "SLEEP_MODE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_fault",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GPIO_INT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_phase_u",
      connected_source_port_ids: [
        "source_port_phase_u",
        "source_port_mcu_phase_u",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_motor_fault",
      connected_source_port_ids: [
        "source_port_motor_fault",
        "source_port_mcu_fault",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MOTOR_PHASE")
  expect(netlist).toContain("  - U1 pin5 (MOTOR_PHASE,PHASE_U)")
  expect(netlist).toContain("NET: U1_MOTOR_FAULT")
  expect(netlist).toContain("  - U1 pin6 (MOTOR_FAULT,SLEEP_MODE)")
  expect(netlist).not.toContain("undefined")
})
