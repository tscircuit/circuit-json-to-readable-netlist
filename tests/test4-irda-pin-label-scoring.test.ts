import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { generateNetName } from "lib/generateNetName"
import { scorePhrase } from "lib/scorePhrase"

it("scores IrDA and infrared control labels before numeric fallback", () => {
  expect(scorePhrase("IRDA_RX1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("U1_IRDA_RX1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("IR_BLASTER1")).toBeGreaterThan(scorePhrase("pin15"))
})

it("uses IrDA pin labels when generating readable net names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "IRDA_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2"],
    },
  ] satisfies AnyCircuitElement[]

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_0", "source_port_1"],
    }),
  ).toBe("U1_IRDA_RX1")
})

it("keeps IrDA labels visible in the readable netlist output", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 10_000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "IRDA_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] satisfies AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IRDA_RX1")
  expect(netlist).toContain("  - U1 pin14 (IRDA_RX1)")
  expect(netlist).toContain("- pin14(IRDA_RX1): NETS(U1_IRDA_RX1)")
})
