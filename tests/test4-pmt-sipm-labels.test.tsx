import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves PMT and SiPM detector readout pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Photon Detector Front End"
        pinLabels={{
          pin1: ["P1", "PMT_ANODE"],
          pin2: ["P2", "PMT_DYNODE"],
          pin3: ["P3", "SIPM_BIAS"],
          pin4: ["P4", "SIPM_OUT"],
          pin5: ["P5", "APD_BIAS"],
          pin6: ["P6", "APD_MON"],
          pin7: ["P7", "TIA_OUT"],
          pin8: ["P8", "CFD_TRIG"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Photon Detector Front End, soic8


    COMPONENT_PINS:
    U1 (Photon Detector Front End)
    - pin1(P1, PMT_ANODE): NOT_CONNECTED
    - pin2(P2, PMT_DYNODE): NOT_CONNECTED
    - pin3(P3, SIPM_BIAS): NOT_CONNECTED
    - pin4(P4, SIPM_OUT): NOT_CONNECTED
    - pin5(P5, APD_BIAS): NOT_CONNECTED
    - pin6(P6, APD_MON): NOT_CONNECTED
    - pin7(P7, TIA_OUT): NOT_CONNECTED
    - pin8(P8, CFD_TRIG): NOT_CONNECTED
    "
  `)
})
