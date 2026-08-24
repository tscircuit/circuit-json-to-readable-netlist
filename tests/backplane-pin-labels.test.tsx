import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores VPX and FMC backplane pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="VPX_FMC_BACKPLANE"
        pinLabels={{
          pin1: ["VPX_LA01_P"],
          pin2: ["FMC_LA01_N"],
          pin3: ["CPCI_REQ1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".U1 .VPX_LA01_P" to=".C1 .pin1" />
      <trace from=".U1 .FMC_LA01_N" to=".C2 .pin1" />
      <trace from=".U1 .CPCI_REQ1" to=".C3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: VPX_FMC_BACKPLANE, qfn16
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor
     - C3: 1nF 0402 capacitor

    NET: U1_VPX_LA01_P
      - U1 VPX_LA01_P
      - C1 pin1 (+)

    NET: U1_FMC_LA01_N
      - U1 FMC_LA01_N
      - C2 pin1 (+)

    NET: U1_CPCI_REQ1
      - U1 CPCI_REQ1
      - C3 pin1 (+)


    COMPONENT_PINS:
    U1 (VPX_FMC_BACKPLANE)
    - pin1(VPX_LA01_P): NETS(U1_VPX_LA01_P)
    - pin2(FMC_LA01_N): NETS(U1_FMC_LA01_N)
    - pin3(CPCI_REQ1): NETS(U1_CPCI_REQ1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_VPX_LA01_P)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_FMC_LA01_N)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C3 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_CPCI_REQ1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
