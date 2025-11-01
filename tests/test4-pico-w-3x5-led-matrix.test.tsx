import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("should handle chip with GP pins and no footprint", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        manufacturerPartNumber="RP2040"
        schX={0}
        pcbX={0}
        pinLabels={{
          pin1: ["GP0"],
          pin2: ["GP1"],
          pin3: ["GND"],
          pin4: ["RUN"],
        }}
      />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040


    COMPONENT_PINS:
    U1 (RP2040)
    - pin1(GP0): NOT_CONNECTED
    - pin2(GP1): NOT_CONNECTED
    - pin3(GND): NOT_CONNECTED
    - pin4(RUN): NOT_CONNECTED
    "
  `)
})
