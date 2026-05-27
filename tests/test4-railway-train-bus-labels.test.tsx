import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves railway train-bus pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Train Backbone Gateway"
        pinLabels={{
          pin1: ["P1", "TCN_SYNC"],
          pin2: ["P2", "TCN_REF"],
          pin3: ["P3", "WTB_A"],
          pin4: ["P4", "WTB_B"],
          pin5: ["P5", "TRDP_TX"],
          pin6: ["P6", "TRDP_RX"],
          pin7: ["P7", "ETB_LINK"],
          pin8: ["P8", "ECN_LINK"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Train Backbone Gateway, soic8


    COMPONENT_PINS:
    U1 (Train Backbone Gateway)
    - pin1(P1, TCN_SYNC): NOT_CONNECTED
    - pin2(P2, TCN_REF): NOT_CONNECTED
    - pin3(P3, WTB_A): NOT_CONNECTED
    - pin4(P4, WTB_B): NOT_CONNECTED
    - pin5(P5, TRDP_TX): NOT_CONNECTED
    - pin6(P6, TRDP_RX): NOT_CONNECTED
    - pin7(P7, ETB_LINK): NOT_CONNECTED
    - pin8(P8, ECN_LINK): NOT_CONNECTED
    "
  `)
})
