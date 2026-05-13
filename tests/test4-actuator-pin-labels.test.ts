import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps relay and solenoid actuator pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_driver",
      name: "U1",
      manufacturer_part_number: "DRV110",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ATMEGA328P",
    },
    {
      type: "source_port",
      source_port_id: "source_port_solenoid_drive",
      source_component_id: "source_component_driver",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "SOLENOID_DRIVE", "COIL_ENABLE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_solenoid",
      source_component_id: "source_component_mcu",
      name: "pin13",
      pin_number: 13,
      port_hints: ["13", "pin13", "GPIO_SOLENOID"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_contact_sense",
      source_component_id: "source_component_driver",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "CONTACT_SENSE", "RELAY_CONTACT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_contact_sense",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GPIO_CONTACT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_solenoid_drive",
      connected_source_port_ids: [
        "source_port_solenoid_drive",
        "source_port_mcu_solenoid",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_contact_sense",
      connected_source_port_ids: [
        "source_port_contact_sense",
        "source_port_mcu_contact_sense",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SOLENOID_DRIVE")
  expect(netlist).toContain("  - U1 pin5 (SOLENOID_DRIVE,COIL_ENABLE)")
  expect(netlist).toContain("NET: U1_CONTACT_SENSE")
  expect(netlist).toContain("  - U1 pin6 (CONTACT_SENSE,RELAY_CONTACT)")
  expect(netlist).not.toContain("undefined")
})
