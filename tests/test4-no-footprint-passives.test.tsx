import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("passives without footprints don't output undefined in component pin headers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="1k" name="R1" schX={3} pcbX={3} />
      <capacitor capacitance="1nF" name="C1" schX={-3} pcbX={-3} />
      <trace from=".R1 > .pin1" to=".C1 > .pin1" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1kΩ resistor
     - C1: 1nF capacitor

    NET: C1_pos
      - R1 pin1
      - C1 pin1 (+)


    COMPONENT_PINS:
    R1 (1kΩ)
    - pin1(anode, pos, left): NETS(C1_pos)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1nF)
    - pin1(pos, anode, left): NETS(C1_pos)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
