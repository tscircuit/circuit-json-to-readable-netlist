import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores automotive SerDes aliases before the digit fallback", () => {
  expect(scorePhrase("GMSL_RX1")).toBeGreaterThan(1)
  expect(scorePhrase("FPD_LINK_TX0")).toBeGreaterThan(1)
  expect(scorePhrase("FPDLINK_RX0")).toBeGreaterThan(1)
  expect(scorePhrase("POC_FILTER1")).toBeGreaterThan(1)
  expect(scorePhrase("COAX_P1")).toBeGreaterThan(1)
})

it("preserves automotive SerDes labels in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "MAX96717",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 50,
      display_resistance: "50R",
    },
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_3",
      name: "C1",
      capacitance: 0.0000001,
      display_capacitance: "100nF",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "soic8",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      pcb_component_id: "pcb_component_2",
      source_component_id: "source_component_2",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_3",
      pcb_component_id: "pcb_component_3",
      source_component_id: "source_component_3",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      port_hints: ["GMSL_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      port_hints: ["FPDLINK_TX0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_3",
      name: "pin1",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_4"],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_GMSL_RX1")
  expect(readableNetlist).toContain("  - U1 pin14 (GMSL_RX1)")
  expect(readableNetlist).toContain("NET: U1_FPDLINK_TX0")
  expect(readableNetlist).toContain("  - U1 pin15 (FPDLINK_TX0)")
  expect(readableNetlist).not.toContain("NET: R1_pos")
  expect(readableNetlist).not.toContain("NET: C1_pos")
})
