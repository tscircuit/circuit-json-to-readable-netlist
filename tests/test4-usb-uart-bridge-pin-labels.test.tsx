import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores USB serial low-power wake pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="USB-UART-BRIDGE"
        pinLabels={{
          pin1: ["SIWU1"],
          pin2: ["SLEEP1"],
          pin3: ["SUSPEND1"],
          pin4: ["SUSPEND_N1"],
          pin5: ["WAKEUP1"],
          pin6: ["SUSPENDN1"],
          pin7: ["WAKEUP2"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .SIWU1" to=".R1 .pin1" />
      <trace from=".U1 .SLEEP1" to=".R2 .pin1" />
      <trace from=".U1 .SUSPEND1" to=".C1 .pin1" />
      <trace from=".U1 .WAKEUP1" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: USB-UART-BRIDGE, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - R3: 1kΩ 0402 resistor

    NET: U1_SIWU1
      - U1 SIWU1
      - R1 pin1

    NET: U1_SLEEP1
      - U1 SLEEP1
      - R2 pin1

    NET: U1_SUSPEND1
      - U1 SUSPEND1
      - C1 pin1 (+)

    NET: U1_WAKEUP1
      - U1 WAKEUP1
      - R3 pin1


    COMPONENT_PINS:
    U1 (USB-UART-BRIDGE)
    - pin1(SIWU1): NETS(U1_SIWU1)
    - pin2(SLEEP1): NETS(U1_SLEEP1)
    - pin3(SUSPEND1): NETS(U1_SUSPEND1)
    - pin4(SUSPEND_N1): NOT_CONNECTED
    - pin5(WAKEUP1): NETS(U1_WAKEUP1)
    - pin6(SUSPENDN1): NOT_CONNECTED
    - pin7(WAKEUP2): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SIWU1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SLEEP1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_SUSPEND1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_WAKEUP1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
