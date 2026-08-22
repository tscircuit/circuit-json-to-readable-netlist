import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses readable chip pin labels before generic pin numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["PICO_GPIO10", "SCLK", "SPI0_SCK"],
        }}
      />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain(
    "- PICO_GPIO10(pin14, SCLK, SPI0_SCK): NOT_CONNECTED",
  )
  expect(netlist).not.toContain("- pin14(PICO_GPIO10")
})
