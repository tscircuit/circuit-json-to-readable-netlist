import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores digit-bearing JTAG and SWD labels before numeric fallback", () => {
  expect(scorePhrase("SWDIO1")).toBeGreaterThan(scorePhrase("GPIO1"))
  expect(scorePhrase("SWCLK1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("JTAG_TMS1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("uses JTAG and SWD aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32F030"
        pinLabels={{
          pin1: ["GPIO1", "SWDIO1"],
          pin2: ["GPIO2", "SWCLK1"],
          pin3: ["GPIO3", "JTAG_TMS1"],
          pin4: ["GPIO4", "JTAG_TCK1"],
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
     - U1: STM32F030, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor

    NET: U1_SWDIO1
      - U1 GPIO1 (SWDIO1)
      - R1 pin1

    NET: U1_SWCLK1
      - U1 GPIO2 (SWCLK1)
      - R2 pin1


    COMPONENT_PINS:
    U1 (STM32F030)
    - pin1(GPIO1, SWDIO1): NETS(U1_SWDIO1)
    - pin2(GPIO2, SWCLK1): NETS(U1_SWCLK1)
    - pin3(GPIO3, JTAG_TMS1): NOT_CONNECTED
    - pin4(GPIO4, JTAG_TCK1): NOT_CONNECTED
    - pin5(GND): NOT_CONNECTED
    - pin6(VDD): NOT_CONNECTED
    - pin7(NC): NOT_CONNECTED
    - pin8(RESET): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SWDIO1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SWCLK1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
