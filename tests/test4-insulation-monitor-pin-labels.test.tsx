import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores insulation monitor pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="IMD-MONITOR"
        pinLabels={{
          pin1: ["IMD_TEST1"],
          pin2: ["RISO_ALARM1"],
          pin3: ["GFCI_TRIP1"],
          pin4: ["LEAKAGE_SENSE1"],
          pin5: ["VDD"],
          pin6: ["GND"],
          pin7: ["GPIO1"],
          pin8: ["GPIO2"],
        }}
      />
      <resistor resistance="100k" footprint="0402" name="R1" />
      <resistor resistance="100k" footprint="0402" name="R2" />
      <capacitor capacitance="10nF" footprint="0402" name="C1" />
      <capacitor capacitance="10nF" footprint="0402" name="C2" />

      <trace from=".U1 .IMD_TEST1" to=".R1 .pin1" />
      <trace from=".U1 .RISO_ALARM1" to=".R2 .pin1" />
      <trace from=".U1 .GFCI_TRIP1" to=".C1 .pin1" />
      <trace from=".U1 .LEAKAGE_SENSE1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: IMD-MONITOR, soic8
     - R1: 100kΩ 0402 resistor
     - R2: 100kΩ 0402 resistor
     - C1: 10nF 0402 capacitor
     - C2: 10nF 0402 capacitor

    NET: U1_IMD_TEST1
      - U1 IMD_TEST1
      - R1 pin1

    NET: U1_RISO_ALARM1
      - U1 RISO_ALARM1
      - R2 pin1

    NET: U1_GFCI_TRIP1
      - U1 GFCI_TRIP1
      - C1 pin1 (+)

    NET: U1_LEAKAGE_SENSE1
      - U1 LEAKAGE_SENSE1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (IMD-MONITOR)
    - pin1(IMD_TEST1): NETS(U1_IMD_TEST1)
    - pin2(RISO_ALARM1): NETS(U1_RISO_ALARM1)
    - pin3(GFCI_TRIP1): NETS(U1_GFCI_TRIP1)
    - pin4(LEAKAGE_SENSE1): NETS(U1_LEAKAGE_SENSE1)
    - pin5(VDD): NOT_CONNECTED
    - pin6(GND): NOT_CONNECTED
    - pin7(GPIO1): NOT_CONNECTED
    - pin8(GPIO2): NOT_CONNECTED

    R1 (100kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_IMD_TEST1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (100kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_RISO_ALARM1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (10nF 0402)
    - pin1(pos, anode, left): NETS(U1_GFCI_TRIP1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (10nF 0402)
    - pin1(pos, anode, left): NETS(U1_LEAKAGE_SENSE1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
