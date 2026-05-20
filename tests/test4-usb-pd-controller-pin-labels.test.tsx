import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores USB Power Delivery controller pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="USB-PD-CONTROLLER"
        pinLabels={{
          pin1: ["USBPD_INT1"],
          pin2: ["VBUS_DET1"],
          pin3: ["FRS_TX1"],
          pin4: ["SRC_EN1"],
          pin5: ["VDD"],
          pin6: ["GND"],
          pin7: ["CC1"],
          pin8: ["CC2"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".U1 .USBPD_INT1" to=".R1 .pin1" />
      <trace from=".U1 .VBUS_DET1" to=".R2 .pin1" />
      <trace from=".U1 .FRS_TX1" to=".C1 .pin1" />
      <trace from=".U1 .SRC_EN1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: USB-PD-CONTROLLER, qfn16
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: U1_USBPD_INT1
      - U1 USBPD_INT1
      - R1 pin1

    NET: U1_VBUS_DET1
      - U1 VBUS_DET1
      - R2 pin1

    NET: U1_FRS_TX1
      - U1 FRS_TX1
      - C1 pin1 (+)

    NET: U1_SRC_EN1
      - U1 SRC_EN1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (USB-PD-CONTROLLER)
    - pin1(USBPD_INT1): NETS(U1_USBPD_INT1)
    - pin2(VBUS_DET1): NETS(U1_VBUS_DET1)
    - pin3(FRS_TX1): NETS(U1_FRS_TX1)
    - pin4(SRC_EN1): NETS(U1_SRC_EN1)
    - pin5(VDD): NOT_CONNECTED
    - pin6(GND): NOT_CONNECTED
    - pin7(CC1): NOT_CONNECTED
    - pin8(CC2): NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_USBPD_INT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VBUS_DET1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_FRS_TX1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_SRC_EN1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
