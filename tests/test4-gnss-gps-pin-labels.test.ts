import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores GNSS/GPS aliases before the generic digit fallback", () => {
  expect(scorePhrase("GNSS_PPS1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("GPS_FIX1")).toBeGreaterThan(scorePhrase("pos"))
})

it("keeps GNSS/GPS aliases in readable netlists", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "NEO-M9N",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      name: "pin14",
      port_hints: ["GNSS_PPS1", "PPS", "timepulse"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      name: "pin15",
      port_hints: ["GPS_FIX1", "fix"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      pin_number: 2,
      name: "pin2",
      port_hints: ["cathode", "neg", "right"],
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

  expect(netlist).toContain("NET: U1_GNSS_PPS1")
  expect(netlist).toContain("  - U1 pin14 (GNSS_PPS1)")
  expect(netlist).toContain("NET: U1_GPS_FIX1")
  expect(netlist).toContain("  - U1 pin15 (GPS_FIX1)")
})
