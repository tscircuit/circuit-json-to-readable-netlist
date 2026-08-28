import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores PCR and microfluidic aliases before numeric fallback", () => {
  expect(scorePhrase("PCR_SYNC1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("QPCR_READY1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("THERMOCYCLER_LID1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MICROFLUIDIC_VALVE1")).toBeGreaterThan(
    scorePhrase("pin14"),
  )
})

it("preserves PCR and microfluidic aliases in readable net output", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "LAB-AFE",
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
      port_hints: ["PCR_SYNC1"],
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
      port_hints: ["MICROFLUIDIC_VALVE1"],
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

  expect(netlist).toContain("NET: U1_PCR_SYNC1")
  expect(netlist).toContain("  - U1 pin14 (PCR_SYNC1)")
  expect(netlist).toContain("- pin14(PCR_SYNC1): NETS(U1_PCR_SYNC1)")
  expect(netlist).toContain("NET: U1_MICROFLUIDIC_VALVE1")
  expect(netlist).toContain("  - U1 pin15 (MICROFLUIDIC_VALVE1)")
  expect(netlist).toContain(
    "- pin15(MICROFLUIDIC_VALVE1): NETS(U1_MICROFLUIDIC_VALVE1)",
  )
})
