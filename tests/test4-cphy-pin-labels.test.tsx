import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers MIPI C-PHY lane labels over generic numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="IMX219"
        pinLabels={{
          pin1: ["GPIO0", "CPHY_LANE0_A"],
          pin2: ["GPIO1", "CPHY_LANE0_B"],
          pin3: ["GPIO2", "CPHY_TRIO1_C"],
          pin4: ["GND"],
          pin5: ["VDD"],
          pin6: ["GPIO5"],
          pin7: ["GPIO6"],
          pin8: ["GPIO7"],
        }}
      />
      <resistor resistance="100Ω" footprint="0402" name="R1" />
      <resistor resistance="100Ω" footprint="0402" name="R2" />
      <resistor resistance="100Ω" footprint="0402" name="R3" />

      <trace from=".U1 .CPHY_LANE0_A" to=".R1 .pin1" />
      <trace from=".U1 .CPHY_LANE0_B" to=".R2 .pin1" />
      <trace from=".U1 .CPHY_TRIO1_C" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: IMX219, soic8
     - R1: 100Ω 0402 resistor
     - R2: 100Ω 0402 resistor
     - R3: 100Ω 0402 resistor

    NET: U1_CPHY_LANE0_A
      - U1 GPIO0 (CPHY_LANE0_A)
      - R1 pin1

    NET: U1_CPHY_LANE0_B
      - U1 GPIO1 (CPHY_LANE0_B)
      - R2 pin1

    NET: U1_CPHY_TRIO1_C
      - U1 GPIO2 (CPHY_TRIO1_C)
      - R3 pin1


    COMPONENT_PINS:
    U1 (IMX219)
    - pin1(GPIO0, CPHY_LANE0_A): NETS(U1_CPHY_LANE0_A)
    - pin2(GPIO1, CPHY_LANE0_B): NETS(U1_CPHY_LANE0_B)
    - pin3(GPIO2, CPHY_TRIO1_C): NETS(U1_CPHY_TRIO1_C)
    - pin4(GND): NOT_CONNECTED
    - pin5(VDD): NOT_CONNECTED
    - pin6(GPIO5): NOT_CONNECTED
    - pin7(GPIO6): NOT_CONNECTED
    - pin8(GPIO7): NOT_CONNECTED

    R1 (100Ω 0402)
    - pin1(anode, pos, left): NETS(U1_CPHY_LANE0_A)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (100Ω 0402)
    - pin1(anode, pos, left): NETS(U1_CPHY_LANE0_B)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (100Ω 0402)
    - pin1(anode, pos, left): NETS(U1_CPHY_TRIO1_C)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
