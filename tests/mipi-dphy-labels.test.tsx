import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores digit-bearing MIPI D-PHY labels before numeric fallback", () => {
  expect(scorePhrase("MIPI_DSI_D0P1")).toBeGreaterThan(scorePhrase("GPIO1"))
  expect(scorePhrase("MIPI_CSI_CLK_N1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("DPHY_LANE1_P")).toBeGreaterThan(scorePhrase("pin14"))
})

it("uses MIPI D-PHY aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SN65DSI83"
        pinLabels={{
          pin1: ["GPIO1", "MIPI_DSI_D0P1"],
          pin2: ["GPIO2", "MIPI_DSI_D0N1"],
          pin3: ["GPIO3", "MIPI_CSI_CLK_P1"],
          pin4: ["GPIO4", "MIPI_CSI_CLK_N1"],
          pin5: ["GND"],
          pin6: ["VDD"],
          pin7: ["NC"],
          pin8: ["RESET"],
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
     - U1: SN65DSI83, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor

    NET: U1_MIPI_DSI_D0P1
      - U1 GPIO1 (MIPI_DSI_D0P1)
      - R1 pin1

    NET: U1_MIPI_DSI_D0N1
      - U1 GPIO2 (MIPI_DSI_D0N1)
      - R2 pin1


    COMPONENT_PINS:
    U1 (SN65DSI83)
    - pin1(GPIO1, MIPI_DSI_D0P1): NETS(U1_MIPI_DSI_D0P1)
    - pin2(GPIO2, MIPI_DSI_D0N1): NETS(U1_MIPI_DSI_D0N1)
    - pin3(GPIO3, MIPI_CSI_CLK_P1): NOT_CONNECTED
    - pin4(GPIO4, MIPI_CSI_CLK_N1): NOT_CONNECTED
    - pin5(GND): NOT_CONNECTED
    - pin6(VDD): NOT_CONNECTED
    - pin7(NC): NOT_CONNECTED
    - pin8(RESET): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MIPI_DSI_D0P1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MIPI_DSI_D0N1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
