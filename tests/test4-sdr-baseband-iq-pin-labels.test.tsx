import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores SDR baseband I/Q pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="AD9361"
        pinLabels={{
          pin1: ["SDR_I1"],
          pin2: ["BASEBAND_Q1"],
          pin3: ["IQ_SEL1"],
          pin4: ["Q_OUT1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .SDR_I1" to=".R1 .pin1" />
      <trace from=".U1 .BASEBAND_Q1" to=".C1 .pin1" />
      <trace from=".U1 .IQ_SEL1" to=".R1 .pin2" />
      <trace from=".U1 .Q_OUT1" to=".C1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AD9361, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_SDR_I1
      - U1 SDR_I1
      - R1 pin1

    NET: U1_BASEBAND_Q1
      - U1 BASEBAND_Q1
      - C1 pin1 (+)

    NET: U1_IQ_SEL1
      - U1 IQ_SEL1
      - R1 pin2

    NET: U1_Q_OUT1
      - U1 Q_OUT1
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (AD9361)
    - pin1(SDR_I1): NETS(U1_SDR_I1)
    - pin2(BASEBAND_Q1): NETS(U1_BASEBAND_Q1)
    - pin3(IQ_SEL1): NETS(U1_IQ_SEL1)
    - pin4(Q_OUT1): NETS(U1_Q_OUT1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SDR_I1)
    - pin2(cathode, neg, right): NETS(U1_IQ_SEL1)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_BASEBAND_Q1)
    - pin2(neg, cathode, right): NETS(U1_Q_OUT1)
    "
  `)
})
