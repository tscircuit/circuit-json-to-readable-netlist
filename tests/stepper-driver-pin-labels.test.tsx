import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves stepper driver control labels in net entries", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TMC2209"
        pinLabels={{
          pin1: ["pin1", "STEP"],
          pin2: ["pin2", "DIR"],
          pin3: ["pin3", "ENA"],
          pin4: ["pin4", "FAULT"],
          pin5: ["pin5", "PUL"],
          pin6: ["pin6", "ALARM"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .pin1" to=".R1 .pin1" />
      <trace from=".U1 .pin2" to=".R2 .pin1" />
      <trace from=".U1 .pin3" to=".R3 .pin1" />
      <trace from=".U1 .pin4" to=".R4 .pin1" />
      <trace from=".U1 .pin5" to=".R5 .pin1" />
      <trace from=".U1 .pin6" to=".R6 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TMC2209, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor
     - R3: 1kΩ 0402 resistor
     - R4: 1kΩ 0402 resistor
     - R5: 1kΩ 0402 resistor
     - R6: 1kΩ 0402 resistor

    NET: U1_STEP
      - U1 pin1 (STEP)
      - R1 pin1

    NET: U1_DIR
      - U1 pin2 (DIR)
      - R2 pin1

    NET: U1_ENA
      - U1 pin3 (ENA)
      - R3 pin1

    NET: U1_FAULT
      - U1 pin4 (FAULT)
      - R4 pin1

    NET: U1_PUL
      - U1 pin5 (PUL)
      - R5 pin1

    NET: U1_ALARM
      - U1 pin6 (ALARM)
      - R6 pin1


    COMPONENT_PINS:
    U1 (TMC2209)
    - pin1(STEP): NETS(U1_STEP)
    - pin2(DIR): NETS(U1_DIR)
    - pin3(ENA): NETS(U1_ENA)
    - pin4(FAULT): NETS(U1_FAULT)
    - pin5(PUL): NETS(U1_PUL)
    - pin6(ALARM): NETS(U1_ALARM)
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_STEP)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DIR)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ENA)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_FAULT)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R5 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PUL)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R6 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ALARM)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
