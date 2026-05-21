import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("prefers optical transceiver labels that include status numbers", () => {
  expect(scorePhrase("SFP_TX_FAULT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("QSFP_MODSEL1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("XFP_MOD_ABS1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("topic1")).toBe(0.5)

  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "SFP-CAGE",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["SFP_TX_FAULT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SFP_TX_FAULT1")
  expect(netlist).toContain("  - U1 pin1 (SFP_TX_FAULT1)")
  expect(netlist).toContain("- pin1(SFP_TX_FAULT1): NETS(U1_SFP_TX_FAULT1)")
})
