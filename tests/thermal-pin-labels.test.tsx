import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves temperature and thermal-management pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic14"
        manufacturerPartNumber="TMP117"
        pinLabels={{
          pin14: ["pin14", "TEMP_ALERT1", "THERM_WARN"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .TEMP_ALERT1" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TMP117, soic14
     - R1: 10kΩ 0402 resistor

    NET: U1_TEMP_ALERT1
      - U1 pin14 (TEMP_ALERT1,THERM_WARN)
      - R1 pin1


    COMPONENT_PINS:
    U1 (TMP117)
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
    - pin14(TEMP_ALERT1, THERM_WARN): NETS(U1_TEMP_ALERT1)

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_TEMP_ALERT1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
