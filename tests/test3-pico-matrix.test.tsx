import { renderCircuit } from "tests/fixtures/render-circuit"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { it, expect } from "bun:test"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test3 pico matrix", () => {
  const circuitJson = renderCircuit(
    <board width="55mm" height="52mm">
      <chip
        name="U1"
        manufacturerPartNumber="PICO_W"
        pinLabels={{
          pin1: ["GP6_SPI0SCK_I2C1SDA"],
          pin2: ["GND1"],
          pin3: ["GND2"],
          pin4: ["VBUS"],
        }}
      />
      <chip
        name="LED1"
        manufacturerPartNumber="WS2812B_2020"
        pinLabels={{
          pin1: ["DI"],
          pin2: ["VDD"],
          pin3: ["GND"],
          pin4: ["DO"],
        }}
      />
      <trace from=".U1 .GP6_SPI0SCK_I2C1SDA" to=".LED1 .DI" />
      <trace from=".U1 .GND1" to=".LED1 .GND" />
      <trace from=".U1 .GND2" to="net.GND" />
      <trace from=".LED1 .VDD" to="net.V5" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
"COMPONENTS:
 - U1: PICO_W microcontroller
 - LED1: WS2812B_2020 RGB LED

NET: LED1_DI
  - [UNRESOLVED_PORT: source_trace_0]
  - U1 GP6_SPI0SCK_I2C1SDA
  - LED1 DI

NET: LED1_GND
  - [UNRESOLVED_PORT: source_trace_1]
  - U1 GND1
  - LED1 GND


EMPTY NET PINS:
  - U1 GND2
  - LED1 VDD"
`)
})
