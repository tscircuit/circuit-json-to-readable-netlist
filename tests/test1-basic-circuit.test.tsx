import { renderCircuit } from "tests/fixtures/render-circuit"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { it, expect } from "bun:test"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test1 should render a basic circuit", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm">
      <resistor resistance="1k" footprint="0402" name="R1" schX={3} pcbX={3} />
      <capacitor
        capacitance="1nF"
        footprint="0402"
        name="C1"
        schX={-3}
        pcbX={-3}
      />
      <trace from=".R1 > .pin1" to=".C1 > .pin1" />
    </board>,
  )
  // console.log(circuitJson.filter((e) => e.type.startsWith("source_")))

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
"COMPONENTS:
 - R1: 1kΩ 0402 resistor
 - C1: 1nF 0402 capacitor

NET: C1_pos
  - R1 pin1
  - C1 pin1 (+)
"
`)
})
