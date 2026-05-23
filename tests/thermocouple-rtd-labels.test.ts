import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves thermocouple and RTD labels on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "MAX31865",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "TEMP-PROBE-CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["THERMOCOUPLE_P1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["THERMOCOUPLE_N1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["RTD_SENSE1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["PT100_EXC1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_3", "source_port_4"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_THERMOCOUPLE_P1")
  expect(netlist).toContain("  - U1 pin14 (THERMOCOUPLE_P1)")
  expect(netlist).toContain("  - J1 pin1 (THERMOCOUPLE_N1)")
  expect(netlist).toContain("NET: U1_RTD_SENSE1")
  expect(netlist).toContain("  - U1 pin15 (RTD_SENSE1)")
  expect(netlist).toContain("  - J1 pin2 (PT100_EXC1)")
  expect(netlist).toContain(
    "- pin14(THERMOCOUPLE_P1): NETS(U1_THERMOCOUPLE_P1)",
  )
  expect(netlist).toContain("- pin15(RTD_SENSE1): NETS(U1_RTD_SENSE1)")
})
