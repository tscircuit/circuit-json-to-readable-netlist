import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores lab vacuum and mass-spec aliases before numeric fallback", () => {
  expect(scorePhrase("PIRANI_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ION_GAUGE1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MASS_SPEC_TRIG1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("TURBO_READY1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("preserves lab vacuum aliases in readable net names and pin entries", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "VAC-AFE",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "TESTPOINTS",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PIRANI_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pos",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["ION_GAUGE1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "neg",
      pin_number: 2,
      port_hints: ["neg"],
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

  expect(netlist).toContain("NET: U1_PIRANI_OUT1")
  expect(netlist).toContain("  - U1 pin14 (PIRANI_OUT1)")
  expect(netlist).toContain("- pin14(PIRANI_OUT1): NETS(U1_PIRANI_OUT1)")
  expect(netlist).toContain("NET: U1_ION_GAUGE1")
  expect(netlist).toContain("  - U1 pin15 (ION_GAUGE1)")
  expect(netlist).toContain("- pin15(ION_GAUGE1): NETS(U1_ION_GAUGE1)")
})
