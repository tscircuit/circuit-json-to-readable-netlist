import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores leak and moisture aliases before the generic digit fallback", () => {
  expect(scorePhrase("LEAK_DET1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MOISTURE_OUT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("WATER_DETECT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("LIQUID_DETECT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("LEVEL_SENSE1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("FLOAT_SW1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("SOIL_MOIST1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("keeps leak and moisture aliases visible in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="LEAK-SENSE"
        pinLabels={{
          pin1: ["GND"],
          pin14: ["LEAK_DET1", "pin14"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .LEAK_DET1" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: LEAK-SENSE, soic16
     - R1: 1kΩ 0402 resistor

    NET: U1_LEAK_DET1
      - U1 LEAK_DET1
      - R1 pin1


    COMPONENT_PINS:
    U1 (LEAK-SENSE)
    - pin1(GND): NOT_CONNECTED
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
    - pin14(LEAK_DET1): NETS(U1_LEAK_DET1)
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LEAK_DET1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
