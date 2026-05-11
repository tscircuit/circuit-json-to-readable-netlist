import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves NFC and RFID contactless-reader pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PN532"
        pinLabels={{
          pin1: ["GPIO1", "NFC_IRQ"],
          pin2: ["GPIO2", "RFID_FIELD"],
          pin3: ["GPIO3", "ISO14443_TX"],
        }}
      />
      <resistor resistance="33Ω" name="R1" />
      <resistor resistance="33Ω" name="R2" />
      <resistor resistance="33Ω" name="R3" />

      <trace from=".U1 .GPIO1" to=".R1 > .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 > .pin1" />
      <trace from=".U1 .GPIO3" to=".R3 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PN532, soic8
     - R1: 33Ω resistor
     - R2: 33Ω resistor
     - R3: 33Ω resistor

    NET: U1_NFC_IRQ
      - U1 GPIO1 (NFC_IRQ)
      - R1 pin1

    NET: U1_RFID_FIELD
      - U1 GPIO2 (RFID_FIELD)
      - R2 pin1

    NET: U1_ISO14443_TX
      - U1 GPIO3 (ISO14443_TX)
      - R3 pin1


    COMPONENT_PINS:
    U1 (PN532)
    - pin1(GPIO1, NFC_IRQ): NETS(U1_NFC_IRQ)
    - pin2(GPIO2, RFID_FIELD): NETS(U1_RFID_FIELD)
    - pin3(GPIO3, ISO14443_TX): NETS(U1_ISO14443_TX)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_NFC_IRQ)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_RFID_FIELD)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_ISO14443_TX)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
