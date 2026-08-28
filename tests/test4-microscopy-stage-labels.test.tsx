import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves microscopy stage-control pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Microscope Stage Controller"
        pinLabels={{
          pin1: ["P1", "GALVO_X"],
          pin2: ["P2", "GALVO_Y"],
          pin3: ["P3", "PIEZO_X"],
          pin4: ["P4", "PIEZO_Y"],
          pin5: ["P5", "STAGE_HOME"],
          pin6: ["P6", "STAGE_LIMIT"],
          pin7: ["P7", "SHUTTER_TRIG"],
          pin8: ["P8", "SHUTTER_BUSY"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Microscope Stage Controller, soic8


    COMPONENT_PINS:
    U1 (Microscope Stage Controller)
    - pin1(P1, GALVO_X): NOT_CONNECTED
    - pin2(P2, GALVO_Y): NOT_CONNECTED
    - pin3(P3, PIEZO_X): NOT_CONNECTED
    - pin4(P4, PIEZO_Y): NOT_CONNECTED
    - pin5(P5, STAGE_HOME): NOT_CONNECTED
    - pin6(P6, STAGE_LIMIT): NOT_CONNECTED
    - pin7(P7, SHUTTER_TRIG): NOT_CONNECTED
    - pin8(P8, SHUTTER_BUSY): NOT_CONNECTED
    "
  `)
})
