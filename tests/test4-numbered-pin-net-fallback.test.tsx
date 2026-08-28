import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("generates a net name for source ports that only have pin numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip name="U1" footprint="soic2" />
      <chip name="U2" footprint="soic2" />
      <trace from=".U1 > .pin1" to=".U2 > .pin1" />
    </board>,
  ).map((element) => {
    if (element.type !== "source_port") return element
    const { name, port_hints, ...portWithOnlyPinNumber } = element
    return portWithOnlyPinNumber
  })

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson as any),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic2
     - U2: soic2

    NET: U1_pin1
      - U1 Pin1
      - U2 Pin1


    COMPONENT_PINS:
    U1
    - pin1: NETS(U1_pin1)
    - pin2: NOT_CONNECTED

    U2
    - pin1: NETS(U1_pin1)
    - pin2: NOT_CONNECTED
    "
  `)
})
