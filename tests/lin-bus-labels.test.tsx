import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores digit-bearing LIN bus labels before numeric fallback", () => {
  expect(scorePhrase("LIN_RX1")).toBeGreaterThan(scorePhrase("GPIO1"))
  expect(scorePhrase("LIN_TX1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("LIN_WAKE1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("uses LIN bus aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TJA1021"
        pinLabels={{
          pin1: ["GPIO1", "LIN_RX1"],
          pin2: ["GPIO2", "LIN_TX1"],
          pin3: ["GPIO3", "LIN_EN1"],
          pin4: ["GPIO4", "LIN_WAKE1"],
          pin5: ["GND"],
          pin6: ["VDD"],
          pin7: ["NC"],
          pin8: ["LIN"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TJA1021, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor

    NET: U1_LIN_RX1
      - U1 GPIO1 (LIN_RX1)
      - R1 pin1

    NET: U1_LIN_TX1
      - U1 GPIO2 (LIN_TX1)
      - R2 pin1


    COMPONENT_PINS:
    U1 (TJA1021)
    - pin1(GPIO1, LIN_RX1): NETS(U1_LIN_RX1)
    - pin2(GPIO2, LIN_TX1): NETS(U1_LIN_TX1)
    - pin3(GPIO3, LIN_EN1): NOT_CONNECTED
    - pin4(GPIO4, LIN_WAKE1): NOT_CONNECTED
    - pin5(GND): NOT_CONNECTED
    - pin6(VDD): NOT_CONNECTED
    - pin7(NC): NOT_CONNECTED
    - pin8(LIN): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LIN_RX1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LIN_TX1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
