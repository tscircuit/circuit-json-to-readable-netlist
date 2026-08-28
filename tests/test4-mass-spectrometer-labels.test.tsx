import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves mass spectrometer detector and ion source pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Mass Spectrometer Interface"
        pinLabels={{
          pin1: ["P1", "MCP_BIAS"],
          pin2: ["P2", "MCP_OUT"],
          pin3: ["P3", "TOF_START"],
          pin4: ["P4", "TOF_STOP"],
          pin5: ["P5", "FARADAY_CUP"],
          pin6: ["P6", "FILAMENT_DRV"],
          pin7: ["P7", "QUAD_RF"],
          pin8: ["P8", "QUAD_DC"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Mass Spectrometer Interface, soic8


    COMPONENT_PINS:
    U1 (Mass Spectrometer Interface)
    - pin1(P1, MCP_BIAS): NOT_CONNECTED
    - pin2(P2, MCP_OUT): NOT_CONNECTED
    - pin3(P3, TOF_START): NOT_CONNECTED
    - pin4(P4, TOF_STOP): NOT_CONNECTED
    - pin5(P5, FARADAY_CUP): NOT_CONNECTED
    - pin6(P6, FILAMENT_DRV): NOT_CONNECTED
    - pin7(P7, QUAD_RF): NOT_CONNECTED
    - pin8(P8, QUAD_DC): NOT_CONNECTED
    "
  `)
})
