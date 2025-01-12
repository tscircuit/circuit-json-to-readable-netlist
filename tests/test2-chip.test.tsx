import { renderCircuit } from "tests/fixtures/render-circuit"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { it, expect } from "bun:test"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test2 chip", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm">
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
  - [UNRESOLVED_PORT: source_trace_0]
  - R1 pin1
  - C1 pin1 (+)

NET: GND
  - [UNRESOLVED_PORT: source_trace_3]
  - U1 GPIO1 (SCL)
  - [UNRESOLVED_PORT: source_trace_2]
  - U1 AGND
  - [UNRESOLVED_PORT: source_trace_1]
  - U1 GND
  - [UNRESOLVED_PORT: source_net_0]

NET: U1_SDA
  - [UNRESOLVED_PORT: source_trace_4]
  - U1 GPIO2 (SDA)
  - R1 pin2


EMPTY NET PINS:
  - U1 GPIO3
  - U1 VDD"
`)
})
