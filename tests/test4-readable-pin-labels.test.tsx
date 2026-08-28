import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses full pin labels when a port name is only a physical pin number", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic20"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["GPIO10"],
        }}
      />
      <resistor resistance="1k" name="R1" />
      <trace from=".U1 .GPIO10" to=".R1 > .pin1" />
    </board>,
  )

  const gpio10Port = circuitJson.find(
    (element) => element.type === "source_port" && element.name === "GPIO10",
  )
  if (gpio10Port?.type === "source_port") {
    gpio10Port.name = `pin${gpio10Port.pin_number}`
  }

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("U1 GPIO10")
  expect(netlist).not.toContain("U1 pin14")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040, soic20
     - R1: 1kΩ resistor

    NET: U1_GPIO10
      - U1 GPIO10
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
    - pin14(GPIO10): NETS(U1_GPIO10)
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED

    R1 (1kΩ)
    - pin1(anode, pos, left): NETS(U1_GPIO10)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
