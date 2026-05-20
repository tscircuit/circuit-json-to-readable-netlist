import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores optical motion sensor pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="OPTICAL-MOTION-SENSOR"
        pinLabels={{
          pin1: ["MOTION1"],
          pin2: ["SQUAL1"],
          pin3: ["NCS1"],
          pin4: ["NRESET1"],
          pin5: ["SHUTTER1"],
          pin6: ["FRAME1"],
          pin7: ["VDD"],
          pin8: ["GND"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .MOTION1" to=".R1 .pin1" />
      <trace from=".U1 .SQUAL1" to=".R2 .pin1" />
      <trace from=".U1 .NCS1" to=".R3 .pin1" />
      <trace from=".U1 .NRESET1" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: OPTICAL-MOTION-SENSOR, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - R3: 1kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_MOTION1
      - U1 MOTION1
      - R1 pin1

    NET: U1_SQUAL1
      - U1 SQUAL1
      - R2 pin1

    NET: U1_NCS1
      - U1 NCS1
      - R3 pin1

    NET: U1_NRESET1
      - U1 NRESET1
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (OPTICAL-MOTION-SENSOR)
    - pin1(MOTION1): NETS(U1_MOTION1)
    - pin2(SQUAL1): NETS(U1_SQUAL1)
    - pin3(NCS1): NETS(U1_NCS1)
    - pin4(NRESET1): NETS(U1_NRESET1)
    - pin5(SHUTTER1): NOT_CONNECTED
    - pin6(FRAME1): NOT_CONNECTED
    - pin7(VDD): NOT_CONNECTED
    - pin8(GND): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MOTION1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SQUAL1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_NCS1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_NRESET1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
