import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers descriptive port hints over generic pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["GND"],
          pin2: ["GPIO14"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .GPIO14" to=".R1 .pin1" />
    </board>,
  )

  const gpio14Port = circuitJson.find(
    (element) => element.type === "source_port" && element.name === "GPIO14",
  )

  if (!gpio14Port || gpio14Port.type !== "source_port") {
    throw new Error("expected GPIO14 source port")
  }

  gpio14Port.name = "pin14"
  gpio14Port.pin_number = 14
  gpio14Port.port_hints = ["GPIO14", "pin14", "14"]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ATMEGA328P, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_GPIO14
      - U1 GPIO14
      - R1 pin1


    COMPONENT_PINS:
    U1 (ATMEGA328P)
    - pin1(GND): NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin14(GPIO14): NETS(U1_GPIO14)

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_GPIO14)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
