import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores known digit-bearing pin labels above generic numbered labels", () => {
  expect(scorePhrase("pin14")).toBe(0.5)
  expect(scorePhrase("GPIO14")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("UART_TX1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("keeps descriptive numbered chip pin hints in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["GPIO14", "UART_TX1"],
          pin15: ["GPIO15", "UART_RX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .GPIO14" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040, soic16
     - R1: 1kΩ 0402 resistor

    NET: U1_UART_TX1
      - U1 GPIO14 (UART_TX1)
      - R1 pin1


    COMPONENT_PINS:
    U1 (RP2040)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14(GPIO14, UART_TX1): NETS(U1_UART_TX1)
    - pin15(GPIO15, UART_RX1): NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_UART_TX1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})

it("does not print undefined in passive pin headers when footprint data is missing", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="1k" name="R1" />
      <capacitor capacitance="1nF" name="C1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("R1 (1kΩ)")
  expect(netlist).toContain("C1 (1nF)")
})
