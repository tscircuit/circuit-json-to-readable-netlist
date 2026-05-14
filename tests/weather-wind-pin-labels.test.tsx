import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores weather-station wind sensor pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="WEATHER-AFE"
        pinLabels={{
          pin9: ["WIND_SPEED1"],
          pin10: ["WIND_DIR1"],
          pin11: ["ANEMOMETER1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="20k" footprint="0402" name="R2" />
      <resistor resistance="30k" footprint="0402" name="R3" />

      <trace from=".U1 .WIND_SPEED1" to=".R1 .pin1" />
      <trace from=".U1 .WIND_DIR1" to=".R2 .pin1" />
      <trace from=".U1 .ANEMOMETER1" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: WEATHER-AFE, qfn16
     - R1: 10kΩ 0402 resistor
     - R2: 20kΩ 0402 resistor
     - R3: 30kΩ 0402 resistor

    NET: U1_WIND_SPEED1
      - U1 WIND_SPEED1
      - R1 pin1

    NET: U1_WIND_DIR1
      - U1 WIND_DIR1
      - R2 pin1

    NET: U1_ANEMOMETER1
      - U1 ANEMOMETER1
      - R3 pin1


    COMPONENT_PINS:
    U1 (WEATHER-AFE)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9(WIND_SPEED1): NETS(U1_WIND_SPEED1)
    - pin10(WIND_DIR1): NETS(U1_WIND_DIR1)
    - pin11(ANEMOMETER1): NETS(U1_ANEMOMETER1)
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_WIND_SPEED1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (20kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_WIND_DIR1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (30kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ANEMOMETER1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
