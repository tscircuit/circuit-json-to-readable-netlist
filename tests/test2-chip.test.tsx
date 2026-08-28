import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test2 chip", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["GND"],
          pin2: ["AGND"],
          pin3: ["GPIO1", "SCL"],
          pin4: ["GPIO2", "SDA"],
          pin5: ["GPIO3"],
          pin6: ["GPIO4", "UART_TX"],
          pin7: ["GPIO5", "UART_RX"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".R1 > .pin1" to=".C1 > .pin1" />
      <trace from=".U1 .GND" to="net.GND" />
      <trace from=".U1 .AGND" to="net.GND" />
      <trace from=".U1 .GPIO1" to="net.GND" />
      <trace from=".U1 .GPIO2" to=".R1 .pin2" />
      <trace from=".U1 .GPIO3" to="net.GPIO4" />
      <trace from=".U1 .VDD" to="net.V5" />
    </board>,
  )
  // console.log(circuitJson.filter((e) => e.type.startsWith("source_")))

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ATMEGA328P, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: C1_pos
      - R1 pin1
      - C1 pin1 (+)

    NET: GND
      - U1 GPIO1 (SCL)
      - U1 AGND
      - U1 GND

    NET: U1_SDA
      - U1 GPIO2 (SDA)
      - R1 pin2


    EMPTY NET PINS:
      - U1 GPIO3
      - U1 VDD

    COMPONENT_PINS:
    U1 (ATMEGA328P)
    - pin1(GND): NETS(GND)
    - pin2(AGND): NETS(GND)
    - pin3(GPIO1, SCL): NETS(GND)
    - pin4(GPIO2, SDA): NETS(U1_SDA)
    - pin5(GPIO3): NETS(GPIO4)
    - pin6(GPIO4, UART_TX): NOT_CONNECTED
    - pin7(GPIO5, UART_RX): NOT_CONNECTED
    - pin8(VDD): NETS(V5)

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(C1_pos)
    - pin2(cathode, neg, right): NETS(U1_SDA)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(C1_pos)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})

it("keeps digit-bearing descriptive pin labels readable", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U2"
        footprint="soic16"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["GPIO17"],
          pin15: ["GPIO18"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U2 .GPIO17" to=".R2 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U2: RP2040, soic16
     - R2: 10kΩ 0402 resistor

    NET: U2_GPIO17
      - U2 GPIO17
      - R2 pin1


    COMPONENT_PINS:
    U2 (RP2040)
    - pin1: NOT_CONNECTED
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
    - pin14(GPIO17): NETS(U2_GPIO17)
    - pin15(GPIO18): NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U2_GPIO17)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
