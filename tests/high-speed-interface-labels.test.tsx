import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves digit-bearing high-speed interface labels in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="USB2514B"
        pinLabels={{
          pin1: ["USB2_DP"],
          pin2: ["PCIE_RX1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .USB2_DP" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: USB2514B, soic8
     - R1: 10kΩ 0402 resistor

    NET: U1_USB2_DP
      - U1 USB2_DP
      - R1 pin1


    COMPONENT_PINS:
    U1 (USB2514B)
    - pin1(USB2_DP): NETS(U1_USB2_DP)
    - pin2(PCIE_RX1): NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_USB2_DP)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
