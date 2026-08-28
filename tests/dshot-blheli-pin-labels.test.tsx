import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves DShot and BLHeli ESC labels on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ESC_MCU"
        pinLabels={{
          pin1: ["pin1", "DSHOT1"],
          pin2: ["pin2", "BLHELI_TELEM1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .pin1" to=".R1 .pin1" />
      <trace from=".U1 .pin2" to=".R1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ESC_MCU, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_DSHOT1
      - U1 pin1 (DSHOT1)
      - R1 pin1

    NET: U1_BLHELI_TELEM1
      - U1 pin2 (BLHELI_TELEM1)
      - R1 pin2


    COMPONENT_PINS:
    U1 (ESC_MCU)
    - pin1(DSHOT1): NETS(U1_DSHOT1)
    - pin2(BLHELI_TELEM1): NETS(U1_BLHELI_TELEM1)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DSHOT1)
    - pin2(cathode, neg, right): NETS(U1_BLHELI_TELEM1)
    "
  `)
})
