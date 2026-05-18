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
    - GND(pin1): NETS(GND)
    - AGND(pin2): NETS(GND)
    - GPIO1(pin3, SCL): NETS(GND)
    - GPIO2(pin4, SDA): NETS(U1_SDA)
    - GPIO3(pin5): NETS(GPIO4)
    - GPIO4(pin6, UART_TX): NOT_CONNECTED
    - GPIO5(pin7, UART_RX): NOT_CONNECTED
    - VDD(pin8): NETS(V5)

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(C1_pos)
    - pin2(cathode, neg, right): NETS(U1_SDA)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(C1_pos)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})

it("prioritizes MCU debug aliases over pin numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32G030F4P"
        pinLabels={{
          pin1: ["SWDIO"],
          pin2: ["SWCLK"],
          pin3: ["TMS"],
          pin4: ["TCK"],
          pin5: ["TDI"],
          pin6: ["TDO"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .SWDIO" to=".R1 .pin1" />
      <trace from=".U1 .SWCLK" to=".R2 .pin1" />
      <trace from=".U1 .TMS" to=".R3 .pin1" />
      <trace from=".U1 .TCK" to=".R4 .pin1" />
      <trace from=".U1 .TDI" to=".R5 .pin1" />
      <trace from=".U1 .TDO" to=".R6 .pin1" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  const debugAliasByPin = {
    SWDIO: 1,
    SWCLK: 2,
    TMS: 3,
    TCK: 4,
    TDI: 5,
    TDO: 6,
  }

  for (const alias of Object.keys(debugAliasByPin)) {
    expect(netlist).toContain(`NET: ${alias}`)
    expect(netlist).toMatch(new RegExp(`^  - U1 .*\\b${alias}\\b`, "m"))
  }

  for (const pin of Object.values(debugAliasByPin)) {
    expect(netlist).not.toContain(`U1_pin${pin}`)
  }
})
