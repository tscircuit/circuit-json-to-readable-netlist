import { expect, it } from "bun:test"
import type { SourcePort } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves seven-segment display driver aliases with digits", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["SEG_A"],
          pin2: ["DIG1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <trace from=".U1 .DIG1" to=".R1 .pin1" />
    </board>,
  )

  const digitPort = circuitJson.find(
    (element): element is SourcePort =>
      element.type === "source_port" && element.name === "DIG1",
  )
  expect(digitPort).toBeDefined()

  digitPort!.name = "pin2"
  digitPort!.port_hints = ["DIG1", "DIGIT1", "pin2", "2"]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_DIG1
      - U1 pin2 (DIG1,DIGIT1)
      - R1 pin1


    COMPONENT_PINS:
    U1
    - pin1(SEG_A): NOT_CONNECTED
    - pin2(DIG1, DIGIT1): NETS(U1_DIG1)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DIG1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
