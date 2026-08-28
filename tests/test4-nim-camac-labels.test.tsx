import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves NIM and CAMAC instrumentation pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Nuclear Instrumentation Interface"
        pinLabels={{
          pin1: ["P1", "NIM_IN"],
          pin2: ["P2", "NIM_OUT"],
          pin3: ["P3", "CAMAC_N"],
          pin4: ["P4", "CAMAC_A"],
          pin5: ["P5", "LEMO_TRIG"],
          pin6: ["P6", "LEMO_GATE"],
          pin7: ["P7", "SCALER_GATE"],
          pin8: ["P8", "SCALER_BUSY"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Nuclear Instrumentation Interface, soic8


    COMPONENT_PINS:
    U1 (Nuclear Instrumentation Interface)
    - pin1(P1, NIM_IN): NOT_CONNECTED
    - pin2(P2, NIM_OUT): NOT_CONNECTED
    - pin3(P3, CAMAC_N): NOT_CONNECTED
    - pin4(P4, CAMAC_A): NOT_CONNECTED
    - pin5(P5, LEMO_TRIG): NOT_CONNECTED
    - pin6(P6, LEMO_GATE): NOT_CONNECTED
    - pin7(P7, SCALER_GATE): NOT_CONNECTED
    - pin8(P8, SCALER_BUSY): NOT_CONNECTED
    "
  `)
})
