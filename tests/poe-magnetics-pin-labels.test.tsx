import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores PoE and Ethernet magnetics pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="POE_MAG_IF"
        pinLabels={{
          pin1: ["POE_VP1"],
          pin2: ["PSE_OUT1"],
          pin3: ["MAG_CT1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".U1 .POE_VP1" to=".C1 .pin1" />
      <trace from=".U1 .PSE_OUT1" to=".C2 .pin1" />
      <trace from=".U1 .MAG_CT1" to=".C3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: POE_MAG_IF, soic8
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor
     - C3: 1nF 0402 capacitor

    NET: U1_POE_VP1
      - U1 POE_VP1
      - C1 pin1 (+)

    NET: U1_PSE_OUT1
      - U1 PSE_OUT1
      - C2 pin1 (+)

    NET: U1_MAG_CT1
      - U1 MAG_CT1
      - C3 pin1 (+)


    COMPONENT_PINS:
    U1 (POE_MAG_IF)
    - pin1(POE_VP1): NETS(U1_POE_VP1)
    - pin2(PSE_OUT1): NETS(U1_PSE_OUT1)
    - pin3(MAG_CT1): NETS(U1_MAG_CT1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_POE_VP1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_PSE_OUT1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C3 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_MAG_CT1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
