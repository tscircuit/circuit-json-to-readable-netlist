import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps GPIB instrument-bus aliases for generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="IEEE488-CTRL"
        pinLabels={{
          pin1: ["pin1", "GPIB_DIO1"],
          pin2: ["pin2", "IEEE488_ATN1"],
          pin3: ["pin3", "HPIB_SRQ1"],
          pin4: ["pin4", "GPIB_EOI1"],
        }}
      />
      <resistor resistance="10k" footprint="0603" name="R1" />
      <resistor resistance="10k" footprint="0603" name="R2" />

      <trace from=".U1 .GPIB_DIO1" to=".R1 > .pin1" />
      <trace from=".U1 .IEEE488_ATN1" to=".R1 > .pin2" />
      <trace from=".U1 .HPIB_SRQ1" to=".R2 > .pin1" />
      <trace from=".U1 .GPIB_EOI1" to=".R2 > .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: IEEE488-CTRL, soic16
     - R1: 10kΩ 0603 resistor
     - R2: 10kΩ 0603 resistor

    NET: U1_GPIB_DIO1
      - U1 pin1 (GPIB_DIO1)
      - R1 pin1

    NET: U1_IEEE488_ATN1
      - U1 pin2 (IEEE488_ATN1)
      - R1 pin2

    NET: U1_HPIB_SRQ1
      - U1 pin3 (HPIB_SRQ1)
      - R2 pin1

    NET: U1_GPIB_EOI1
      - U1 pin4 (GPIB_EOI1)
      - R2 pin2


    COMPONENT_PINS:
    U1 (IEEE488-CTRL)
    - pin1(GPIB_DIO1): NETS(U1_GPIB_DIO1)
    - pin2(IEEE488_ATN1): NETS(U1_IEEE488_ATN1)
    - pin3(HPIB_SRQ1): NETS(U1_HPIB_SRQ1)
    - pin4(GPIB_EOI1): NETS(U1_GPIB_EOI1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    R1 (10kΩ 0603)
    - pin1(anode, pos, left): NETS(U1_GPIB_DIO1)
    - pin2(cathode, neg, right): NETS(U1_IEEE488_ATN1)

    R2 (10kΩ 0603)
    - pin1(anode, pos, left): NETS(U1_HPIB_SRQ1)
    - pin2(cathode, neg, right): NETS(U1_GPIB_EOI1)
    "
  `)
})
