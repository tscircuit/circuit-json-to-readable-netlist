import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("should display descriptive pin labels with numbers and prevent undefined in netlist", () => {
  const circuitJson = renderCircuit(
    <board width="50mm" height="50mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PICO_W"
        pinLabels={{
          pin1: ["pin1", "GP11"],
          pin2: ["pin2", "VBUS"],
        }}
      />
      <chip
        name="LED16"
        footprint="soic8"
        manufacturerPartNumber="WS2812B_2020"
        pinLabels={{
          pin3: ["DI"],
          pin4: ["VDD"],
        }}
      />
      <trace from=".U1 .GP11" to=".LED16 .DI" />
      <trace from=".U1 .VBUS" to=".LED16 .VDD" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Verify that it doesn't contain "undefined"
  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("null")

  // Verify that full descriptive pin labels are present in the nets section
  expect(netlist).toContain("- U1 pin1 (GP11)")
  expect(netlist).toContain("- LED16 DI")
  expect(netlist).toContain("- U1 pin2 (VBUS)")
  expect(netlist).toContain("- LED16 VDD")

  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PICO_W, soic8
     - LED16: WS2812B_2020, soic8

    NET: LED16_DI
      - U1 pin1 (GP11)
      - LED16 DI

    NET: LED16_VDD
      - U1 pin2 (VBUS)
      - LED16 VDD


    COMPONENT_PINS:
    U1 (PICO_W)
    - pin1(GP11): NETS(LED16_DI)
    - pin2(VBUS): NETS(LED16_VDD)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    LED16 (WS2812B_2020)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3(DI): NETS(LED16_DI)
    - pin4(VDD): NETS(LED16_VDD)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    "
  `)
})
