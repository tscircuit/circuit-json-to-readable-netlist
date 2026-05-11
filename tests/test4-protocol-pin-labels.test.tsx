import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores known protocol aliases before generic digit fallback", () => {
  expect(scorePhrase("PCIE_TXP0")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("PCIE_RXN0")).toBeGreaterThan(scorePhrase("pin15"))
  expect(scorePhrase("PERST_N")).toBeGreaterThan(scorePhrase("pin16"))
  expect(scorePhrase("CLKREQ_N")).toBeGreaterThan(scorePhrase("pin17"))
})

it("keeps PCIe lane aliases readable on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="TEST-PCIe"
        pinLabels={{
          pin14: ["pin14", "PCIE_TXP0"],
          pin15: ["pin15", "PCIE_RXN0"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .PCIE_TXP0" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TEST-PCIe, soic16
     - R1: 1kΩ 0402 resistor

    NET: U1_PCIE_TXP0
      - U1 pin14 (PCIE_TXP0)
      - R1 pin1


    COMPONENT_PINS:
    U1 (TEST-PCIe)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14(PCIE_TXP0): NETS(U1_PCIE_TXP0)
    - pin15(PCIE_RXN0): NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PCIE_TXP0)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
