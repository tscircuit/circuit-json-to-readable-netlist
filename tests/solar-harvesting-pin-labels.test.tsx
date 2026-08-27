import { expect, it } from "bun:test"
import type { SourcePort } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves solar charger and MPPT aliases on generic physical pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["PVIN"],
          pin2: ["MPPT1"],
          pin3: ["VMPP"],
        }}
      />
      <resistor name="R1" resistance="100k" footprint="0402" />
      <capacitor name="C1" capacitance="1uF" footprint="0402" />
      <trace from=".U1 .PVIN" to=".R1 .pin1" />
      <trace from=".U1 .MPPT1" to=".C1 .pin1" />
    </board>,
  )

  for (const [label, replacementHints] of [
    ["PVIN", ["PVIN", "SOLAR_IN", "pin1", "1"]],
    ["MPPT1", ["MPPT1", "VMPP", "pin2", "2"]],
    ["VMPP", ["VMPP", "pin3", "3"]],
  ] as const) {
    const port = circuitJson.find(
      (element): element is SourcePort =>
        element.type === "source_port" && element.name === label,
    )
    expect(port).toBeDefined()
    port!.name = `pin${port!.pin_number}`
    port!.port_hints = [...replacementHints]
  }

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic8
     - R1: 100kΩ 0402 resistor
     - C1: 1µF 0402 capacitor

    NET: U1_PVIN
      - U1 pin1 (PVIN,SOLAR_IN)
      - R1 pin1

    NET: U1_MPPT1
      - U1 pin2 (MPPT1,VMPP)
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1
    - pin1(PVIN, SOLAR_IN): NETS(U1_PVIN)
    - pin2(MPPT1, VMPP): NETS(U1_MPPT1)
    - pin3(VMPP): NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (100kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PVIN)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1µF 0402)
    - pin1(pos, anode, left): NETS(U1_MPPT1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
