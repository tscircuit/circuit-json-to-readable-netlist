import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { generateNetName } from "lib/generateNetName"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("chip without footprint doesn't output undefined", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip name="LED1" manufacturerPartNumber="WS2812B_2020" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - LED1: WS2812B_2020


    COMPONENT_PINS:
    LED1 (WS2812B_2020)
    "
  `)
})

it("passives without footprint don't output undefined in pin headers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="1k" name="R1" />
      <capacitor capacitance="1nF" name="C1" />
      <trace from=".R1 > .pin1" to=".C1 > .pin1" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("R1 (1kΩ)")
  expect(netlist).toContain("C1 (1nF)")
})

it("generates a fallback net name for unnamed connected ports", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "U2",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
    },
  ] as AnyCircuitElement[]

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_1", "source_port_2"],
    }),
  ).toBe("U1_U2")
})
