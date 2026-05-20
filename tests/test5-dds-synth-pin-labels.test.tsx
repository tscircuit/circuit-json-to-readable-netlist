import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores DDS synthesizer pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="msop10"
        manufacturerPartNumber="AD9833"
        pinLabels={{
          pin1: ["IOUT1"],
          pin2: ["IOUT2"],
          pin3: ["REFCLK1"],
          pin4: ["FQ_UD"],
          pin5: ["W_CLK"],
          pin6: ["FSYNC"],
          pin7: ["MCLK"],
          pin8: ["DACOUT1"],
          pin9: ["RESET"],
          pin10: ["SLEEP"],
        }}
      />
      <resistor resistance="200" footprint="0402" name="R1" />
      <resistor resistance="200" footprint="0402" name="R2" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />

      <trace from=".U1 .IOUT1" to=".R1 .pin1" />
      <trace from=".U1 .IOUT2" to=".R2 .pin1" />
      <trace from=".U1 .REFCLK1" to=".C1 .pin1" />
      <trace from=".U1 .DACOUT1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AD9833, msop10
     - R1: 200Ω 0402 resistor
     - R2: 200Ω 0402 resistor
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor

    NET: U1_IOUT1
      - U1 IOUT1
      - R1 pin1

    NET: U1_IOUT2
      - U1 IOUT2
      - R2 pin1

    NET: U1_REFCLK1
      - U1 REFCLK1
      - C1 pin1 (+)

    NET: U1_DACOUT1
      - U1 DACOUT1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (AD9833)
    - pin1(IOUT1): NETS(U1_IOUT1)
    - pin2(IOUT2): NETS(U1_IOUT2)
    - pin3(REFCLK1): NETS(U1_REFCLK1)
    - pin4(FQ_UD): NOT_CONNECTED
    - pin5(W_CLK): NOT_CONNECTED
    - pin6(FSYNC): NOT_CONNECTED
    - pin7(MCLK): NOT_CONNECTED
    - pin8(DACOUT1): NETS(U1_DACOUT1)
    - pin9(RESET): NOT_CONNECTED
    - pin10(SLEEP): NOT_CONNECTED

    R1 (200Ω 0402)
    - pin1(anode, pos, left): NETS(U1_IOUT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (200Ω 0402)
    - pin1(anode, pos, left): NETS(U1_IOUT2)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_REFCLK1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_DACOUT1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
