import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores UWB RF-control pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="DW3000"
        pinLabels={{
          pin1: ["EXTPA1"],
          pin2: ["EXTTXE1"],
          pin3: ["EXTRXE1"],
          pin4: ["RXTX1"],
          pin5: ["TXLED1"],
          pin6: ["RXLED1"],
        }}
      />
      <resistor resistance="100" footprint="0402" name="R1" />
      <resistor resistance="100" footprint="0402" name="R2" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />

      <trace from=".U1 .EXTPA1" to=".R1 .pin1" />
      <trace from=".U1 .EXTTXE1" to=".R2 .pin1" />
      <trace from=".U1 .EXTRXE1" to=".C1 .pin1" />
      <trace from=".U1 .RXTX1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: DW3000, soic8
     - R1: 100Ω 0402 resistor
     - R2: 100Ω 0402 resistor
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor

    NET: U1_EXTPA1
      - U1 EXTPA1
      - R1 pin1

    NET: U1_EXTTXE1
      - U1 EXTTXE1
      - R2 pin1

    NET: U1_EXTRXE1
      - U1 EXTRXE1
      - C1 pin1 (+)

    NET: U1_RXTX1
      - U1 RXTX1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (DW3000)
    - pin1(EXTPA1): NETS(U1_EXTPA1)
    - pin2(EXTTXE1): NETS(U1_EXTTXE1)
    - pin3(EXTRXE1): NETS(U1_EXTRXE1)
    - pin4(RXTX1): NETS(U1_RXTX1)
    - pin5(TXLED1): NOT_CONNECTED
    - pin6(RXLED1): NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (100Ω 0402)
    - pin1(anode, pos, left): NETS(U1_EXTPA1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (100Ω 0402)
    - pin1(anode, pos, left): NETS(U1_EXTTXE1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_EXTRXE1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_RXTX1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
