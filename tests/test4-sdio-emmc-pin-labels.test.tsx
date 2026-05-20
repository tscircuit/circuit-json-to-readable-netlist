import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores SDIO and eMMC pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="soic8"
        manufacturerPartNumber="SDIO-SOCKET"
        pinLabels={{
          pin1: ["DAT0"],
          pin2: ["DAT1"],
          pin3: ["DAT2"],
          pin4: ["DAT3"],
          pin5: ["CMD"],
          pin6: ["CLK"],
          pin7: ["CD"],
          pin8: ["WP"],
        }}
      />
      <resistor resistance="47k" footprint="0402" name="R1" />
      <resistor resistance="47k" footprint="0402" name="R2" />
      <capacitor capacitance="22pF" footprint="0402" name="C1" />
      <capacitor capacitance="22pF" footprint="0402" name="C2" />

      <trace from=".J1 .DAT0" to=".R1 .pin1" />
      <trace from=".J1 .DAT1" to=".R2 .pin1" />
      <trace from=".J1 .CMD" to=".C1 .pin1" />
      <trace from=".J1 .CLK" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: SDIO-SOCKET, soic8
     - R1: 47kΩ 0402 resistor
     - R2: 47kΩ 0402 resistor
     - C1: 22pF 0402 capacitor
     - C2: 22pF 0402 capacitor

    NET: J1_DAT0
      - J1 DAT0
      - R1 pin1

    NET: J1_DAT1
      - J1 DAT1
      - R2 pin1

    NET: J1_CMD
      - J1 CMD
      - C1 pin1 (+)

    NET: J1_CLK
      - J1 CLK
      - C2 pin1 (+)


    COMPONENT_PINS:
    J1 (SDIO-SOCKET)
    - pin1(DAT0): NETS(J1_DAT0)
    - pin2(DAT1): NETS(J1_DAT1)
    - pin3(DAT2): NOT_CONNECTED
    - pin4(DAT3): NOT_CONNECTED
    - pin5(CMD): NETS(J1_CMD)
    - pin6(CLK): NETS(J1_CLK)
    - pin7(CD): NOT_CONNECTED
    - pin8(WP): NOT_CONNECTED

    R1 (47kΩ 0402)
    - pin1(anode, pos, left): NETS(J1_DAT0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (47kΩ 0402)
    - pin1(anode, pos, left): NETS(J1_DAT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (22pF 0402)
    - pin1(pos, anode, left): NETS(J1_CMD)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (22pF 0402)
    - pin1(pos, anode, left): NETS(J1_CLK)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
