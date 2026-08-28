import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("preserves optical transport pin aliases in readable netlists", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_framer",
      name: "U1",
      manufacturer_part_number: "OTN framer",
    },
    {
      type: "source_port",
      source_port_id: "source_port_framer_cpri_rx",
      source_component_id: "source_component_framer",
      name: "pin14",
      pin_number: 14,
      port_hints: ["CPRI_RX0"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_r1",
      source_component_id: "source_component_r1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_cpri_rx",
      connected_source_port_ids: [
        "source_port_framer_cpri_rx",
        "source_port_r1_1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CPRI_RX0")
  expect(netlist).toContain("  - U1 pin14 (CPRI_RX0)")
  expect(netlist).toContain("- pin14(CPRI_RX0): NETS(U1_CPRI_RX0)")
})

it("scores optical transport aliases before the generic digit fallback", () => {
  expect(scorePhrase("CPRI_RX0")).toBeGreaterThan(1)
  expect(scorePhrase("OTU2_FRAME_SYNC")).toBeGreaterThan(1)
  expect(scorePhrase("SDH_AIS1")).toBeGreaterThan(1)
  expect(scorePhrase("SONET_LOF1")).toBeGreaterThan(1)
})
