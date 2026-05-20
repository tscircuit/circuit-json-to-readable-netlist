import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores MIPI I3C pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="I3C-HUB"
        pinLabels={{
          pin1: ["I3C_SDA"],
          pin2: ["I3C_SCL"],
          pin3: ["IBI0"],
          pin4: ["HDR_DDR"],
          pin5: ["RSTDAA"],
          pin6: ["ENTDAA"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .I3C_SDA" to=".R1 > .pin1" />
      <trace from=".U1 .I3C_SCL" to=".R2 > .pin1" />
      <trace from=".U1 .IBI0" to=".R3 > .pin1" />
      <trace from=".U1 .HDR_DDR" to=".R4 > .pin1" />
      <trace from=".U1 .RSTDAA" to=".R5 > .pin1" />
      <trace from=".U1 .ENTDAA" to=".R6 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: I3C-HUB, qfn16
     - R1: 1kΩ 0402 resistor
     - R2: 2kΩ 0402 resistor
     - R3: 3kΩ 0402 resistor
     - R4: 4kΩ 0402 resistor
     - R5: 5kΩ 0402 resistor
     - R6: 6kΩ 0402 resistor

    NET: U1_I3C_SDA
      - U1 I3C_SDA
      - R1 pin1

    NET: U1_I3C_SCL
      - U1 I3C_SCL
      - R2 pin1

    NET: U1_IBI0
      - U1 IBI0
      - R3 pin1

    NET: U1_HDR_DDR
      - U1 HDR_DDR
      - R4 pin1

    NET: U1_RSTDAA
      - U1 RSTDAA
      - R5 pin1

    NET: U1_ENTDAA
      - U1 ENTDAA
      - R6 pin1


    COMPONENT_PINS:
    U1 (I3C-HUB)
    - pin1(I3C_SDA): NETS(U1_I3C_SDA)
    - pin2(I3C_SCL): NETS(U1_I3C_SCL)
    - pin3(IBI0): NETS(U1_IBI0)
    - pin4(HDR_DDR): NETS(U1_HDR_DDR)
    - pin5(RSTDAA): NETS(U1_RSTDAA)
    - pin6(ENTDAA): NETS(U1_ENTDAA)
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_I3C_SDA)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (2kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_I3C_SCL)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (3kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_IBI0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (4kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_HDR_DDR)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R5 (5kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_RSTDAA)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R6 (6kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ENTDAA)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
