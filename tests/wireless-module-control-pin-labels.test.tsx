import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores wireless module control aliases before the generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="CYW43439"
        pinLabels={{
          pin1: ["pin14", "WL_REG_ON1"],
          pin2: ["pin15", "HOST_WAKE1"],
          pin3: ["pin16", "BT_REG_ON1"],
          pin4: ["pin17", "DEV_WAKE1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: CYW43439, soic8
     - R1: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_WL_REG_ON1
      - U1 pin14 (WL_REG_ON1)
      - R1 pin1

    NET: U1_HOST_WAKE1
      - U1 pin15 (HOST_WAKE1)
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (CYW43439)
    - pin1(pin14, WL_REG_ON1): NETS(U1_WL_REG_ON1)
    - pin2(pin15, HOST_WAKE1): NETS(U1_HOST_WAKE1)
    - pin3(pin16, BT_REG_ON1): NOT_CONNECTED
    - pin4(pin17, DEV_WAKE1): NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_WL_REG_ON1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_HOST_WAKE1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
