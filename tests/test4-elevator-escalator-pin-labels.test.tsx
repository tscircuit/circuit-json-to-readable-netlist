import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves elevator controller pin labels with digits", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ELEVATOR_CTRL"
        pinLabels={{
          pin1: ["ELEVATOR_CAR1"],
          pin2: ["HALL_CALL1"],
          pin3: ["ESCALATOR_STEP1"],
          pin4: ["HANDRAIL_SPEED1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .ELEVATOR_CAR1" to=".R1 .pin1" />
      <trace from=".U1 .HALL_CALL1" to=".C1 .pin1" />
      <trace from=".U1 .ESCALATOR_STEP1" to=".R1 .pin2" />
      <trace from=".U1 .HANDRAIL_SPEED1" to=".C1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ELEVATOR_CTRL, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_ELEVATOR_CAR1
      - U1 ELEVATOR_CAR1
      - R1 pin1

    NET: U1_HALL_CALL1
      - U1 HALL_CALL1
      - C1 pin1 (+)

    NET: U1_ESCALATOR_STEP1
      - U1 ESCALATOR_STEP1
      - R1 pin2

    NET: U1_HANDRAIL_SPEED1
      - U1 HANDRAIL_SPEED1
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (ELEVATOR_CTRL)
    - pin1(ELEVATOR_CAR1): NETS(U1_ELEVATOR_CAR1)
    - pin2(HALL_CALL1): NETS(U1_HALL_CALL1)
    - pin3(ESCALATOR_STEP1): NETS(U1_ESCALATOR_STEP1)
    - pin4(HANDRAIL_SPEED1): NETS(U1_HANDRAIL_SPEED1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ELEVATOR_CAR1)
    - pin2(cathode, neg, right): NETS(U1_ESCALATOR_STEP1)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_HALL_CALL1)
    - pin2(neg, cathode, right): NETS(U1_HANDRAIL_SPEED1)
    "
  `)
})

it("scores elevator and escalator labels before numeric fallback", () => {
  for (const label of [
    "ELEVATOR_CAR1",
    "ESCALATOR_STEP1",
    "HALL_CALL1",
    "FLOOR_CALL1",
    "CAR_CALL1",
    "HANDRAIL_SPEED1",
  ]) {
    expect(scorePhrase(label)).toBeGreaterThan(scorePhrase("pin1"))
    expect(scorePhrase(label)).toBeGreaterThan(scorePhrase("pos"))
  }
})
