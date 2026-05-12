import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "../lib"

it("preserves PLL and clock-generator pin labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
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
      port_hints: ["PLL_LOCK1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      port_hints: ["CLKGEN_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      pin_number: 16,
      port_hints: ["FREQ_SEL1"],
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

  expect(readableNetlist).toContain("NET: U1_PLL_LOCK1")
  expect(readableNetlist).toContain("NET: U1_CLKGEN_OUT1")
  expect(readableNetlist).toContain("NET: U1_FREQ_SEL1")
  expect(readableNetlist).toContain("- U1 Pin14 (PLL_LOCK1)")
  expect(readableNetlist).toContain("- U1 Pin15 (CLKGEN_OUT1)")
  expect(readableNetlist).toContain("- U1 Pin16 (FREQ_SEL1)")
  expect(readableNetlist).toContain("- pin14(PLL_LOCK1): NETS(U1_PLL_LOCK1)")
  expect(readableNetlist).toContain(
    "- pin15(CLKGEN_OUT1): NETS(U1_CLKGEN_OUT1)",
  )
  expect(readableNetlist).toContain("- pin16(FREQ_SEL1): NETS(U1_FREQ_SEL1)")
})
