import { expect, it } from "bun:test"
import { generateNetName } from "lib/generateNetName"
import { scorePhrase } from "lib/scorePhrase"

it("scores chiplet interconnect labels before numeric fallback", () => {
  expect(scorePhrase("UCIE_LANE0")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("AIB_TX0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("BOW_RX1")).toBeGreaterThan(scorePhrase("neg"))
  expect(scorePhrase("D2D_CLK1")).toBeGreaterThan(1)
})

it("uses UCIe chiplet labels in generated net names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "R1",
      ftype: "simple_resistor",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["UCIE_LANE0", "D2D_CLK1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "right"],
    },
  ] as any[]

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_0", "source_port_1"],
    }),
  ).toBe("U1_UCIE_LANE0")
})
