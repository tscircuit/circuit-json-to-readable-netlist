import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("only polarized parts list anode and cathode pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="20mm" height="10mm" routingDisabled>
      <resistor resistance="1k" footprint="0402" name="R1" />
      <inductor inductance="10uH" footprint="0603" name="L1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="10uF" footprint="0805" name="C2" polarized />
      <diode footprint="0603" name="D1" />
      <led footprint="0603" name="LED1" />
      <trace from=".R1 > .pin2" to=".LED1 > .anode" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1kΩ 0402 resistor
     - L1: L1, source_component
     - C1: 100nF 0402 capacitor
     - C2: 10µF 0805 capacitor
     - D1: D1, source_component
     - LED1: LED1, source_component

    NET: LED1_pos
      - R1 pin2
      - LED1 pin1 (+)


    COMPONENT_PINS:
    R1 (1kΩ 0402)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NETS(LED1_pos)

    L1
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    C2 (10µF 0805)
    - pin1(pos, anode, left): NOT_CONNECTED
    - pin2(neg, cathode, right): NOT_CONNECTED

    D1
    - pin1(pos, anode, left): NOT_CONNECTED
    - pin2(neg, cathode, right): NOT_CONNECTED

    LED1
    - pin1(anode, pos, left): NETS(LED1_pos)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
