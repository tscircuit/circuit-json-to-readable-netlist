import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves biomedical sensor pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="BIO1"
        footprint="qfn32"
        manufacturerPartNumber="MAX86150"
        pinLabels={{
          pin11: ["pin11", "ECG_RA"],
          pin12: ["pin12", "PPG_LED1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".BIO1 .pin11" to=".R1 .pin1" />
      <trace from=".BIO1 .pin12" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: BIO1_ECG_RA")
  expect(netlist).toContain("NET: BIO1_PPG_LED1")
  expect(netlist).toContain("BIO1 pin11 (ECG_RA)")
  expect(netlist).toContain("BIO1 pin12 (PPG_LED1)")
})
