import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("preserves broadcast radio tuner pin aliases in readable netlists", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_tuner",
      name: "U1",
      manufacturer_part_number: "FM/RDS tuner",
    },
    {
      type: "source_port",
      source_port_id: "source_port_tuner_rds_clk",
      source_component_id: "source_component_tuner",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RDS_CLK1"],
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
      source_trace_id: "source_trace_rds_clk",
      connected_source_port_ids: [
        "source_port_tuner_rds_clk",
        "source_port_r1_1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RDS_CLK1")
  expect(netlist).toContain("  - U1 pin14 (RDS_CLK1)")
  expect(netlist).toContain("- pin14(RDS_CLK1): NETS(U1_RDS_CLK1)")
})

it("scores radio tuner aliases before the generic digit fallback", () => {
  expect(scorePhrase("RDS_CLK1")).toBeGreaterThan(1)
  expect(scorePhrase("FM_TUNER_LOCK1")).toBeGreaterThan(1)
  expect(scorePhrase("STEREO_IND1")).toBeGreaterThan(1)
  expect(scorePhrase("IF_AGC1")).toBeGreaterThan(1)
})
