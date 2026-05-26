import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("includes descriptive labels for numbered chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        pinLabels={{
          pin14: ["SPI_SCK", "GPIO10"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .GPIO10" to=".R1 .pin1" />
    </board>,
  )

  const pin14 = circuitJson.find(
    (element) => element.type === "source_port" && element.pin_number === 14,
  )
  if (pin14?.type === "source_port") {
    pin14.name = "pin14"
  }

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic16
     - R1: 1kΩ 0402 resistor

    NET: U1_SPI_SCK
      - U1 pin14 (GPIO10,SPI_SCK)
      - R1 pin1


    COMPONENT_PINS:
    U1
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
    - pin14(GPIO10, SPI_SCK): NETS(U1_SPI_SCK)
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SPI_SCK)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
