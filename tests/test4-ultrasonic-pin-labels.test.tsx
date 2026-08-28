import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers ultrasonic sensor aliases over passive labels", () => {
  expect(scorePhrase("ULTRASONIC_ECHO1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("TRIG1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HC-SR04"
        pinLabels={{
          pin1: ["VCC"],
          pin2: ["TRIG1"],
          pin3: ["ULTRASONIC_ECHO1"],
          pin4: ["GND"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .TRIG1" to=".R1 > .pin1" />
      <trace from=".U1 .ULTRASONIC_ECHO1" to=".R1 > .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: HC-SR04, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_TRIG1
      - U1 TRIG1
      - R1 pin1

    NET: U1_ULTRASONIC_ECHO1
      - U1 ULTRASONIC_ECHO1
      - R1 pin2


    COMPONENT_PINS:
    U1 (HC-SR04)
    - pin1(VCC): NOT_CONNECTED
    - pin2(TRIG1): NETS(U1_TRIG1)
    - pin3(ULTRASONIC_ECHO1): NETS(U1_ULTRASONIC_ECHO1)
    - pin4(GND): NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_TRIG1)
    - pin2(cathode, neg, right): NETS(U1_ULTRASONIC_ECHO1)
    "
  `)
})
