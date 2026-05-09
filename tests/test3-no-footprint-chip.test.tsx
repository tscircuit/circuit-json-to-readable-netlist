import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
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

it("passives without footprints don't output undefined in component pins", () => {
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

it("generic pin names include useful alphanumeric hints", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "14", "GPIO0", "VBUS"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GPIO0,VBUS)")
})
