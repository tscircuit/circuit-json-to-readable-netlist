import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores oscillator aliases before the generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32"
        pinLabels={{
          pin1: ["pin14", "XTAL_IN"],
          pin2: ["pin15", "XTAL_OUT"],
          pin3: ["pin16", "OSC_IN"],
          pin4: ["pin17", "OSC_OUT"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="18pF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STM32, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 18pF 0402 capacitor

    NET: U1_XTAL_IN
      - U1 pin14 (XTAL_IN)
      - R1 pin1

    NET: U1_XTAL_OUT
      - U1 pin15 (XTAL_OUT)
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (STM32)
    - pin1(pin14, XTAL_IN): NETS(U1_XTAL_IN)
    - pin2(pin15, XTAL_OUT): NETS(U1_XTAL_OUT)
    - pin3(pin16, OSC_IN): NOT_CONNECTED
    - pin4(pin17, OSC_OUT): NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_XTAL_IN)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (18pF 0402)
    - pin1(pos, anode, left): NETS(U1_XTAL_OUT)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
