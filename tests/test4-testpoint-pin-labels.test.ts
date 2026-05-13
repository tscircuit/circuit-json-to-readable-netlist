import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps testpoint and measurement probe aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_debug",
      name: "J1",
      manufacturer_part_number: "DebugHeader",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_testpoint",
      source_component_id: "source_component_debug",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "TEST_POINT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_testpoint",
      source_component_id: "source_component_mcu",
      name: "pin20",
      pin_number: 20,
      port_hints: ["20", "pin20", "GP15"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_probe",
      source_component_id: "source_component_debug",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "SCOPE_TRIGGER"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_probe",
      source_component_id: "source_component_mcu",
      name: "pin21",
      pin_number: 21,
      port_hints: ["21", "pin21", "GP16"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_testpoint",
      connected_source_port_ids: [
        "source_port_testpoint",
        "source_port_mcu_testpoint",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_probe",
      connected_source_port_ids: ["source_port_probe", "source_port_mcu_probe"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: J1_TEST_POINT")
  expect(netlist).toContain("  - J1 pin1 (TEST_POINT)")
  expect(netlist).toContain("NET: J1_SCOPE_TRIGGER")
  expect(netlist).toContain("  - J1 pin2 (SCOPE_TRIGGER)")
  expect(netlist).not.toContain("undefined")
})
