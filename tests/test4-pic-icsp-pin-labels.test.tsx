import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores PIC ICSP programming pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PIC16F18313"
        pinLabels={{
          pin1: ["ICSPDAT1"],
          pin2: ["ICSPCLK1"],
          pin3: ["PGC1"],
          pin4: ["PGD1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .ICSPDAT1" to=".R1 .pin1" />
      <trace from=".U1 .ICSPCLK1" to=".C1 .pin1" />
      <trace from=".U1 .PGC1" to=".R1 .pin2" />
      <trace from=".U1 .PGD1" to=".C1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PIC16F18313, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_ICSPDAT1
      - U1 ICSPDAT1
      - R1 pin1

    NET: U1_ICSPCLK1
      - U1 ICSPCLK1
      - C1 pin1 (+)

    NET: U1_PGC1
      - U1 PGC1
      - R1 pin2

    NET: U1_PGD1
      - U1 PGD1
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (PIC16F18313)
    - pin1(ICSPDAT1): NETS(U1_ICSPDAT1)
    - pin2(ICSPCLK1): NETS(U1_ICSPCLK1)
    - pin3(PGC1): NETS(U1_PGC1)
    - pin4(PGD1): NETS(U1_PGD1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ICSPDAT1)
    - pin2(cathode, neg, right): NETS(U1_PGC1)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_ICSPCLK1)
    - pin2(neg, cathode, right): NETS(U1_PGD1)
    "
  `)
})
