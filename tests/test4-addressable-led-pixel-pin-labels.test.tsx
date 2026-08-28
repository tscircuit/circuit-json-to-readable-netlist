import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores addressable LED pixel pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ESP32-C3"
        pinLabels={{
          pin1: ["WS2812_DIN1"],
          pin2: ["WS2812_DOUT1"],
          pin3: ["NEOPIXEL_DATA1"],
          pin4: ["APA102_CI1"],
          pin5: ["DOTSTAR_DI1"],
          pin6: ["SK6812_DATA1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .WS2812_DIN1" to=".R1 > .pin1" />
      <trace from=".U1 .WS2812_DOUT1" to=".R2 > .pin1" />
      <trace from=".U1 .NEOPIXEL_DATA1" to=".R3 > .pin1" />
      <trace from=".U1 .APA102_CI1" to=".R4 > .pin1" />
      <trace from=".U1 .DOTSTAR_DI1" to=".R5 > .pin1" />
      <trace from=".U1 .SK6812_DATA1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_WS2812_DIN1")
  expect(readableNetlist).toContain("NET: U1_WS2812_DOUT1")
  expect(readableNetlist).toContain("NET: U1_NEOPIXEL_DATA1")
  expect(readableNetlist).toContain("NET: U1_APA102_CI1")
  expect(readableNetlist).toContain("NET: U1_DOTSTAR_DI1")
  expect(readableNetlist).toContain("NET: U1_SK6812_DATA1")
  expect(readableNetlist).toContain("- pin1(WS2812_DIN1): NETS(U1_WS2812_DIN1)")
  expect(readableNetlist).toContain(
    "- pin2(WS2812_DOUT1): NETS(U1_WS2812_DOUT1)",
  )
  expect(readableNetlist).toContain(
    "- pin3(NEOPIXEL_DATA1): NETS(U1_NEOPIXEL_DATA1)",
  )
  expect(readableNetlist).toContain("- pin4(APA102_CI1): NETS(U1_APA102_CI1)")
  expect(readableNetlist).toContain("- pin5(DOTSTAR_DI1): NETS(U1_DOTSTAR_DI1)")
  expect(readableNetlist).toContain(
    "- pin6(SK6812_DATA1): NETS(U1_SK6812_DATA1)",
  )
})
