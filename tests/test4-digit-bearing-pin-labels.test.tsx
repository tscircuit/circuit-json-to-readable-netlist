import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers known digit-bearing chip pin labels over passive aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="MCU"
        pinLabels={{
          pin1: ["GPIO1"],
          pin2: ["UART_TX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .UART_TX1" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_GPIO1
      - U1 GPIO1
      - R1 pin1

    NET: U1_UART_TX1
      - U1 UART_TX1
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(GPIO1): NETS(U1_GPIO1)
    - pin2(UART_TX1): NETS(U1_UART_TX1)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_GPIO1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_UART_TX1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
