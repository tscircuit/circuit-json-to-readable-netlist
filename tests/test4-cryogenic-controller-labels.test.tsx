import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves cryogenic temperature controller pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Cryogenic Temperature Controller"
        pinLabels={{
          pin1: ["P1", "CRYO_EXC"],
          pin2: ["P2", "CRYO_SENSE"],
          pin3: ["P3", "CERNOX_HI"],
          pin4: ["P4", "CERNOX_LO"],
          pin5: ["P5", "RUOX_HI"],
          pin6: ["P6", "RUOX_LO"],
          pin7: ["P7", "MIXCH_HEATER"],
          pin8: ["P8", "STILL_HEATER"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Cryogenic Temperature Controller, soic8


    COMPONENT_PINS:
    U1 (Cryogenic Temperature Controller)
    - pin1(P1, CRYO_EXC): NOT_CONNECTED
    - pin2(P2, CRYO_SENSE): NOT_CONNECTED
    - pin3(P3, CERNOX_HI): NOT_CONNECTED
    - pin4(P4, CERNOX_LO): NOT_CONNECTED
    - pin5(P5, RUOX_HI): NOT_CONNECTED
    - pin6(P6, RUOX_LO): NOT_CONNECTED
    - pin7(P7, MIXCH_HEATER): NOT_CONNECTED
    - pin8(P8, STILL_HEATER): NOT_CONNECTED
    "
  `)
})
