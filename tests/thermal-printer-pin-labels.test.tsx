import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves thermal printer controller pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="THERMAL-PRINTER-CTRL"
        pinLabels={{
          pin1: ["pin14", "PAPER_OUT1"],
          pin2: ["pin15", "HEAD_STB1"],
          pin3: ["pin16", "CUTTER_HOME1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".R2 .pin1" />
      <trace from=".U1 .pin16" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: THERMAL-PRINTER-CTRL, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor
     - R3: 1kΩ 0402 resistor

    NET: U1_PAPER_OUT1
      - U1 pin14 (PAPER_OUT1)
      - R1 pin1

    NET: U1_HEAD_STB1
      - U1 pin15 (HEAD_STB1)
      - R2 pin1

    NET: U1_CUTTER_HOME1
      - U1 pin16 (CUTTER_HOME1)
      - R3 pin1


    COMPONENT_PINS:
    U1 (THERMAL-PRINTER-CTRL)
    - pin1(pin14, PAPER_OUT1): NETS(U1_PAPER_OUT1)
    - pin2(pin15, HEAD_STB1): NETS(U1_HEAD_STB1)
    - pin3(pin16, CUTTER_HOME1): NETS(U1_CUTTER_HOME1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PAPER_OUT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_HEAD_STB1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CUTTER_HOME1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
