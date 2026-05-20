import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves ESP32 strapping and bootloader pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ESP32-S3"
        pinLabels={{
          pin1: ["GPIO12", "MTDI"],
          pin2: ["GPIO15", "MTDO"],
          pin3: ["GPIO0", "BOOT"],
          pin4: ["GPIO3", "U0RXD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <trace from=".U1 .GPIO12" to=".R1 .pin1" />
      <trace from=".U1 .GPIO15" to=".R2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ESP32-S3, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor

    NET: U1_MTDI
      - U1 GPIO12 (MTDI)
      - R1 pin1

    NET: U1_MTDO
      - U1 GPIO15 (MTDO)
      - R2 pin1


    COMPONENT_PINS:
    U1 (ESP32-S3)
    - pin1(GPIO12, MTDI): NETS(U1_MTDI)
    - pin2(GPIO15, MTDO): NETS(U1_MTDO)
    - pin3(GPIO0, BOOT): NOT_CONNECTED
    - pin4(GPIO3, U0RXD): NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MTDI)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MTDO)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
