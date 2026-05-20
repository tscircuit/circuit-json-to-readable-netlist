import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores digit-bearing domain labels before numeric fallback", () => {
  for (const label of ["LIN_RX1", "MIPI_DSI_D0P1", "PMBUS_ALERT1", "SWDIO1"]) {
    expect(scorePhrase(label)).toBeGreaterThan(scorePhrase("GPIO1"))
    expect(scorePhrase(label)).toBeGreaterThan(scorePhrase("pin14"))
  }
})

it("uses domain-specific aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32F030"
        pinLabels={{
          pin1: ["GPIO1", "LIN_RX1"],
          pin2: ["GPIO2", "MIPI_DSI_D0P1"],
          pin3: ["GPIO3", "PMBUS_ALERT1"],
          pin4: ["GPIO4", "SWDIO1"],
          pin5: ["GND"],
          pin6: ["VDD"],
          pin7: ["NC"],
          pin8: ["RESET"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 .pin1" />
      <trace from=".U1 .GPIO3" to=".R3 .pin1" />
      <trace from=".U1 .GPIO4" to=".R4 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STM32F030, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor
     - R3: 1kΩ 0402 resistor
     - R4: 1kΩ 0402 resistor

    NET: U1_LIN_RX1
      - U1 GPIO1 (LIN_RX1)
      - R1 pin1

    NET: U1_MIPI_DSI_D0P1
      - U1 GPIO2 (MIPI_DSI_D0P1)
      - R2 pin1

    NET: U1_PMBUS_ALERT1
      - U1 GPIO3 (PMBUS_ALERT1)
      - R3 pin1

    NET: U1_SWDIO1
      - U1 GPIO4 (SWDIO1)
      - R4 pin1


    COMPONENT_PINS:
    U1 (STM32F030)
    - pin1(GPIO1, LIN_RX1): NETS(U1_LIN_RX1)
    - pin2(GPIO2, MIPI_DSI_D0P1): NETS(U1_MIPI_DSI_D0P1)
    - pin3(GPIO3, PMBUS_ALERT1): NETS(U1_PMBUS_ALERT1)
    - pin4(GPIO4, SWDIO1): NETS(U1_SWDIO1)
    - pin5(GND): NOT_CONNECTED
    - pin6(VDD): NOT_CONNECTED
    - pin7(NC): NOT_CONNECTED
    - pin8(RESET): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LIN_RX1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MIPI_DSI_D0P1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PMBUS_ALERT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SWDIO1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
