import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves instrumentation chassis pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Instrumentation Chassis Interface"
        pinLabels={{
          pin1: ["P1", "PXI_TRIG"],
          pin2: ["P2", "PXI_STAR"],
          pin3: ["P3", "PXIE_REFCLK"],
          pin4: ["P4", "PXIE_SYNC"],
          pin5: ["P5", "VXI_CLK"],
          pin6: ["P6", "VXI_MODID"],
          pin7: ["P7", "LXI_TRIG"],
          pin8: ["P8", "LXI_SYNC"],
        }}
      />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: Instrumentation Chassis Interface, soic8


    COMPONENT_PINS:
    U1 (Instrumentation Chassis Interface)
    - pin1(P1, PXI_TRIG): NOT_CONNECTED
    - pin2(P2, PXI_STAR): NOT_CONNECTED
    - pin3(P3, PXIE_REFCLK): NOT_CONNECTED
    - pin4(P4, PXIE_SYNC): NOT_CONNECTED
    - pin5(P5, VXI_CLK): NOT_CONNECTED
    - pin6(P6, VXI_MODID): NOT_CONNECTED
    - pin7(P7, LXI_TRIG): NOT_CONNECTED
    - pin8(P8, LXI_SYNC): NOT_CONNECTED
    "
  `)
})
