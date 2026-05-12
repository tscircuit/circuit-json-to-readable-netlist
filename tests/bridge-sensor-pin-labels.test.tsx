import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores bridge sensor aliases before the generic digit fallback", () => {
  expect(scorePhrase("LOAD_CELL_EXC1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("STRAIN_SIGP1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("WHEATSTONE_BRIDGE1")).toBeGreaterThan(
    scorePhrase("pin14"),
  )
})

it("keeps bridge sensor aliases visible in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="BRIDGE-ADC"
        pinLabels={{
          pin1: ["GND"],
          pin14: ["STRAIN_SIGP1", "pin14"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .STRAIN_SIGP1" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: BRIDGE-ADC, soic16
     - R1: 1kΩ 0402 resistor

    NET: U1_STRAIN_SIGP1
      - U1 STRAIN_SIGP1
      - R1 pin1


    COMPONENT_PINS:
    U1 (BRIDGE-ADC)
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
    - pin14(STRAIN_SIGP1): NETS(U1_STRAIN_SIGP1)
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_STRAIN_SIGP1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
