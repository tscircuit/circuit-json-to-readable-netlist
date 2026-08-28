import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores PMBus and voltage-regulator telemetry pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="ISL68224"
        pinLabels={{
          pin1: ["PMBUS_ALERT"],
          pin2: ["SMBALERT1"],
          pin3: ["VR_HOT"],
          pin4: ["IMON"],
          pin5: ["PSYS"],
          pin6: ["PGOOD"],
          pin7: ["VSEL0"],
          pin8: ["VID1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />
      <resistor resistance="7k" footprint="0402" name="R7" />
      <resistor resistance="8k" footprint="0402" name="R8" />

      <trace from=".U1 .PMBUS_ALERT" to=".R1 > .pin1" />
      <trace from=".U1 .SMBALERT1" to=".R2 > .pin1" />
      <trace from=".U1 .VR_HOT" to=".R3 > .pin1" />
      <trace from=".U1 .IMON" to=".R4 > .pin1" />
      <trace from=".U1 .PSYS" to=".R5 > .pin1" />
      <trace from=".U1 .PGOOD" to=".R6 > .pin1" />
      <trace from=".U1 .VSEL0" to=".R7 > .pin1" />
      <trace from=".U1 .VID1" to=".R8 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ISL68224, qfn24
     - R1: 1kΩ 0402 resistor
     - R2: 2kΩ 0402 resistor
     - R3: 3kΩ 0402 resistor
     - R4: 4kΩ 0402 resistor
     - R5: 5kΩ 0402 resistor
     - R6: 6kΩ 0402 resistor
     - R7: 7kΩ 0402 resistor
     - R8: 8kΩ 0402 resistor

    NET: U1_PMBUS_ALERT
      - U1 PMBUS_ALERT
      - R1 pin1

    NET: U1_SMBALERT1
      - U1 SMBALERT1
      - R2 pin1

    NET: U1_VR_HOT
      - U1 VR_HOT
      - R3 pin1

    NET: U1_IMON
      - U1 IMON
      - R4 pin1

    NET: U1_PSYS
      - U1 PSYS
      - R5 pin1

    NET: U1_PGOOD
      - U1 PGOOD
      - R6 pin1

    NET: U1_VSEL0
      - U1 VSEL0
      - R7 pin1

    NET: U1_VID1
      - U1 VID1
      - R8 pin1


    COMPONENT_PINS:
    U1 (ISL68224)
    - pin1(PMBUS_ALERT): NETS(U1_PMBUS_ALERT)
    - pin2(SMBALERT1): NETS(U1_SMBALERT1)
    - pin3(VR_HOT): NETS(U1_VR_HOT)
    - pin4(IMON): NETS(U1_IMON)
    - pin5(PSYS): NETS(U1_PSYS)
    - pin6(PGOOD): NETS(U1_PGOOD)
    - pin7(VSEL0): NETS(U1_VSEL0)
    - pin8(VID1): NETS(U1_VID1)
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED
    - pin21: NOT_CONNECTED
    - pin22: NOT_CONNECTED
    - pin23: NOT_CONNECTED
    - pin24: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PMBUS_ALERT)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (2kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SMBALERT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (3kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VR_HOT)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (4kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_IMON)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R5 (5kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PSYS)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R6 (6kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PGOOD)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R7 (7kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VSEL0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R8 (8kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VID1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
