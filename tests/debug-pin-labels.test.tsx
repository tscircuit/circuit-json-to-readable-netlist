import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("includes SWD and JTAG debug aliases in readable net pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32F030F4P6"
        pinLabels={{
          pin1: ["pin1", "SWDIO", "TMS"],
          pin2: ["pin2", "SWCLK", "TCK"],
          pin3: ["pin3", "TDO"],
          pin4: ["pin4", "TDI"],
          pin5: ["pin5"],
          pin6: ["pin6"],
          pin7: ["pin7"],
          pin8: ["pin8"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .SWDIO" to=".R1 .pin1" />
      <trace from=".U1 .SWCLK" to=".R1 .pin2" />
      <trace from=".U1 .TDO" to=".C1 .pin1" />
      <trace from=".U1 .TDI" to=".C1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STM32F030F4P6, soic8
     - R1: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_SWDIO
      - U1 pin1 (SWDIO,TMS)
      - R1 pin1

    NET: U1_SWCLK
      - U1 pin2 (SWCLK,TCK)
      - R1 pin2

    NET: U1_TDO
      - U1 pin3 (TDO)
      - C1 pin1 (+)

    NET: U1_TDI
      - U1 pin4 (TDI)
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (STM32F030F4P6)
    - pin1(SWDIO, TMS): NETS(U1_SWDIO)
    - pin2(SWCLK, TCK): NETS(U1_SWCLK)
    - pin3(TDO): NETS(U1_TDO)
    - pin4(TDI): NETS(U1_TDI)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SWDIO)
    - pin2(cathode, neg, right): NETS(U1_SWCLK)

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_TDO)
    - pin2(neg, cathode, right): NETS(U1_TDI)
    "
  `)
})
