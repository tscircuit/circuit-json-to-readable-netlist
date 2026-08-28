import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "../lib"

it("preserves photodiode and laser diode pin labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "D1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "R1",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_component",
      source_component_id: "source_component_3",
      name: "R2",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_component",
      source_component_id: "source_component_4",
      name: "R3",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      port_hints: ["PHOTODIODE_A1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      port_hints: ["PD_CATHODE1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      pin_number: 16,
      port_hints: ["LASERDIODE_K1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_4",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_4"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_5"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_6"],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: D1_PHOTODIODE_A1")
  expect(readableNetlist).toContain("NET: D1_PD_CATHODE1")
  expect(readableNetlist).toContain("NET: D1_LASERDIODE_K1")
  expect(readableNetlist).toContain("- D1 Pin14 (PHOTODIODE_A1)")
  expect(readableNetlist).toContain("- D1 Pin15 (PD_CATHODE1)")
  expect(readableNetlist).toContain("- D1 Pin16 (LASERDIODE_K1)")
  expect(readableNetlist).toContain(
    "- pin14(PHOTODIODE_A1): NETS(D1_PHOTODIODE_A1)",
  )
  expect(readableNetlist).toContain(
    "- pin15(PD_CATHODE1): NETS(D1_PD_CATHODE1)",
  )
  expect(readableNetlist).toContain(
    "- pin16(LASERDIODE_K1): NETS(D1_LASERDIODE_K1)",
  )
})
