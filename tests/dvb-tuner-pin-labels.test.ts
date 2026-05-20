import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("preserves DVB tuner pin aliases in readable netlists", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_tuner",
      name: "U1",
      manufacturer_part_number: "DVB-S2 tuner",
    },
    {
      type: "source_port",
      source_port_id: "source_port_tuner_tsclk",
      source_component_id: "source_component_tuner",
      name: "pin14",
      pin_number: 14,
      port_hints: ["DVB_TS_CLK1"],
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
      source_trace_id: "source_trace_dvb_tsclk",
      connected_source_port_ids: [
        "source_port_tuner_tsclk",
        "source_port_r1_1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DVB_TS_CLK1")
  expect(netlist).toContain("  - U1 pin14 (DVB_TS_CLK1)")
  expect(netlist).toContain("- pin14(DVB_TS_CLK1): NETS(U1_DVB_TS_CLK1)")
})

it("scores satellite tuner aliases before the generic digit fallback", () => {
  expect(scorePhrase("DVB_TS_CLK1")).toBeGreaterThan(1)
  expect(scorePhrase("LNB_EN1")).toBeGreaterThan(1)
  expect(scorePhrase("DISEQC_TX1")).toBeGreaterThan(1)
})
