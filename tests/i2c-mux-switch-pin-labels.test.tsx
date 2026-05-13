import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores i2c mux and switch aliases before the generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TCA9548A"
        pinLabels={{
          pin1: ["pin14", "I2C_MUX_SEL1"],
          pin2: ["pin15", "TCA9548A_INT1"],
          pin3: ["pin16", "PCA9545_RESET1"],
          pin4: ["pin17", "I2C_SWITCH_EN1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TCA9548A, soic8
     - R1: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_I2C_MUX_SEL1
      - U1 pin14 (I2C_MUX_SEL1)
      - R1 pin1

    NET: U1_TCA9548A_INT1
      - U1 pin15 (TCA9548A_INT1)
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (TCA9548A)
    - pin1(pin14, I2C_MUX_SEL1): NETS(U1_I2C_MUX_SEL1)
    - pin2(pin15, TCA9548A_INT1): NETS(U1_TCA9548A_INT1)
    - pin3(pin16, PCA9545_RESET1): NOT_CONNECTED
    - pin4(pin17, I2C_SWITCH_EN1): NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_I2C_MUX_SEL1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_TCA9548A_INT1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
