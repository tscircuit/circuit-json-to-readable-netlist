import { expect, it } from "bun:test"
import type { SourcePort } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps short chip pin labels and omits undefined footprints", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip name="U1" footprint="soic8" pinLabels={{ pin4: ["D0"] }} />
      <resistor name="R1" resistance="1k" />
      <trace from=".U1 .D0" to=".R1 > .pin1" />
    </board>,
  )

  const d0Port = circuitJson.find(
    (element): element is SourcePort =>
      element.type === "source_port" && element.name === "D0",
  )
  expect(d0Port).toBeDefined()

  d0Port!.name = "pin4"
  d0Port!.port_hints = ["D0", "pin4", "4"]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic8
     - R1: 1kΩ resistor

    NET: R1_pos
      - U1 pin4 (D0)
      - R1 pin1


    COMPONENT_PINS:
    U1
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4(D0): NETS(R1_pos)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ)
    - pin1(anode, pos, left): NETS(R1_pos)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
