import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores camera flash driver pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LED-FLASH-DRIVER"
        pinLabels={{
          pin1: ["FLASH1"],
          pin2: ["TORCH1"],
          pin3: ["STROBE1"],
          pin4: ["TXMASK1"],
          pin5: ["FLASHEN1"],
          pin6: ["IFLASH1"],
          pin7: ["ITORCH1"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="1uF" footprint="0402" name="C1" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .FLASH1" to=".R1 .pin1" />
      <trace from=".U1 .TORCH1" to=".R2 .pin1" />
      <trace from=".U1 .STROBE1" to=".C1 .pin1" />
      <trace from=".U1 .TXMASK1" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: LED-FLASH-DRIVER, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 1µF 0402 capacitor
     - R3: 1kΩ 0402 resistor

    NET: U1_FLASH1
      - U1 FLASH1
      - R1 pin1

    NET: U1_TORCH1
      - U1 TORCH1
      - R2 pin1

    NET: U1_STROBE1
      - U1 STROBE1
      - C1 pin1 (+)

    NET: U1_TXMASK1
      - U1 TXMASK1
      - R3 pin1


    COMPONENT_PINS:
    U1 (LED-FLASH-DRIVER)
    - pin1(FLASH1): NETS(U1_FLASH1)
    - pin2(TORCH1): NETS(U1_TORCH1)
    - pin3(STROBE1): NETS(U1_STROBE1)
    - pin4(TXMASK1): NETS(U1_TXMASK1)
    - pin5(FLASHEN1): NOT_CONNECTED
    - pin6(IFLASH1): NOT_CONNECTED
    - pin7(ITORCH1): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_FLASH1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_TORCH1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1µF 0402)
    - pin1(pos, anode, left): NETS(U1_STROBE1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_TXMASK1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
