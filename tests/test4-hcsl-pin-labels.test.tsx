import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps HCSL clock labels with lane numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="CLOCK_GEN"
        pinLabels={{
          pin1: ["GPIO8", "HCSL_CLK1_P"],
          pin2: ["GPIO9", "HCSL_CLK1_N"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow2"
        manufacturerPartNumber="PCIE_REFCLK"
        pinLabels={{
          pin1: ["HCSL_CLK1_P"],
          pin2: ["HCSL_CLK1_N"],
        }}
      />
      <trace from=".U1 .HCSL_CLK1_P" to=".J1 .HCSL_CLK1_P" />
      <trace from=".U1 .HCSL_CLK1_N" to=".J1 .HCSL_CLK1_N" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: CLOCK_GEN, soic8
     - J1: PCIE_REFCLK, pinrow2

    NET: U1_HCSL_CLK1_P
      - U1 GPIO8 (HCSL_CLK1_P)
      - J1 HCSL_CLK1_P

    NET: U1_HCSL_CLK1_N
      - U1 GPIO9 (HCSL_CLK1_N)
      - J1 HCSL_CLK1_N


    COMPONENT_PINS:
    U1 (CLOCK_GEN)
    - pin1(GPIO8, HCSL_CLK1_P): NETS(U1_HCSL_CLK1_P)
    - pin2(GPIO9, HCSL_CLK1_N): NETS(U1_HCSL_CLK1_N)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    J1 (PCIE_REFCLK)
    - pin1(HCSL_CLK1_P): NETS(U1_HCSL_CLK1_P)
    - pin2(HCSL_CLK1_N): NETS(U1_HCSL_CLK1_N)
    "
  `)
})
