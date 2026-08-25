import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores ultrasound front-end labels above generic numbered labels", () => {
  expect(scorePhrase("ULTRASOUND_TX1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("TGC_CTRL1")).toBeGreaterThan(scorePhrase("pos"))
})

it("keeps ultrasound front-end pin labels readable when labels contain digits", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "TX7332",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "J1",
      ftype: "simple_chip",
      manufacturer_part_number: "ULTRASOUND_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ULTRASOUND_TX1", "PULSER_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["TGC_CTRL1", "PMUT_BIAS1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["neg"],
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
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ULTRASOUND_TX1")
  expect(netlist).toContain("  - U1 pin14 (ULTRASOUND_TX1,PULSER_OUT1)")
  expect(netlist).toContain("NET: U1_TGC_CTRL1")
  expect(netlist).toContain("  - U1 pin15 (TGC_CTRL1,PMUT_BIAS1)")
  expect(netlist).toContain(
    "- pin14(ULTRASOUND_TX1, PULSER_OUT1): NETS(U1_ULTRASOUND_TX1)",
  )
  expect(netlist).toContain(
    "- pin15(TGC_CTRL1, PMUT_BIAS1): NETS(U1_TGC_CTRL1)",
  )
})
