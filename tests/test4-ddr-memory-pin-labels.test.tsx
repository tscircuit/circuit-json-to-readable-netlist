import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test4 ddr memory pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="MEMCTRL"
        pinLabels={{
          pin1: ["GND"],
          pin2: ["VDD"],
          pin3: ["DDR_DQ0"],
          pin4: ["DDR_DQS0P"],
          pin5: ["DDR_DQS0N"],
          pin6: ["DDR_A14"],
          pin7: ["DDR_BA0"],
          pin8: ["DDR_CK_P"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .DDR_DQ0" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MEMCTRL, soic8
     - R1: 10kΩ 0402 resistor

    NET: U1_DDR_DQ0
      - U1 DDR_DQ0
      - R1 pin1


    COMPONENT_PINS:
    U1 (MEMCTRL)
    - pin1(GND): NOT_CONNECTED
    - pin2(VDD): NOT_CONNECTED
    - pin3(DDR_DQ0): NETS(U1_DDR_DQ0)
    - pin4(DDR_DQS0P): NOT_CONNECTED
    - pin5(DDR_DQS0N): NOT_CONNECTED
    - pin6(DDR_A14): NOT_CONNECTED
    - pin7(DDR_BA0): NOT_CONNECTED
    - pin8(DDR_CK_P): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DDR_DQ0)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
