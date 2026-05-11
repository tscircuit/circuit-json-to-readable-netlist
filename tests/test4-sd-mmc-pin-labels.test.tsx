import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers SD/MMC signal labels over generic numbered pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ESP32"
        pinLabels={{
          pin1: ["pin14", "SD_CMD"],
          pin2: ["pin15", "SD_CLK"],
          pin3: ["pin16", "WP"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
      <trace from=".U1 .pin16" to="net.CARD_DETECT" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ESP32, soic8
     - R1: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_SD_CMD
      - U1 pin14 (SD_CMD)
      - R1 pin1

    NET: U1_SD_CLK
      - U1 pin15 (SD_CLK)
      - C1 pin1 (+)


    EMPTY NET PINS:
      - U1 pin16 (WP)

    COMPONENT_PINS:
    U1 (ESP32)
    - pin1(pin14, SD_CMD): NETS(U1_SD_CMD)
    - pin2(pin15, SD_CLK): NETS(U1_SD_CLK)
    - pin3(pin16, WP): NETS(CARD_DETECT)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SD_CMD)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_SD_CLK)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
