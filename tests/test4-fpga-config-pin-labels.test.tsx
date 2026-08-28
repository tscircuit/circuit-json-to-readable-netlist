import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores FPGA configuration pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="EP4CE6"
        pinLabels={{
          pin1: ["MSEL0"],
          pin2: ["MSEL1"],
          pin3: ["CFG_DATA0"],
          pin4: ["CONF_DONE"],
          pin5: ["NSTATUS"],
          pin6: ["NCONFIG"],
          pin7: ["DCLK"],
          pin8: ["ASDO"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />
      <resistor resistance="7k" footprint="0402" name="R7" />
      <resistor resistance="8k" footprint="0402" name="R8" />

      <trace from=".U1 .MSEL0" to=".R1 > .pin1" />
      <trace from=".U1 .MSEL1" to=".R2 > .pin1" />
      <trace from=".U1 .CFG_DATA0" to=".R3 > .pin1" />
      <trace from=".U1 .CONF_DONE" to=".R4 > .pin1" />
      <trace from=".U1 .NSTATUS" to=".R5 > .pin1" />
      <trace from=".U1 .NCONFIG" to=".R6 > .pin1" />
      <trace from=".U1 .DCLK" to=".R7 > .pin1" />
      <trace from=".U1 .ASDO" to=".R8 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: EP4CE6, qfn32
     - R1: 1kΩ 0402 resistor
     - R2: 2kΩ 0402 resistor
     - R3: 3kΩ 0402 resistor
     - R4: 4kΩ 0402 resistor
     - R5: 5kΩ 0402 resistor
     - R6: 6kΩ 0402 resistor
     - R7: 7kΩ 0402 resistor
     - R8: 8kΩ 0402 resistor

    NET: U1_MSEL0
      - U1 MSEL0
      - R1 pin1

    NET: U1_MSEL1
      - U1 MSEL1
      - R2 pin1

    NET: U1_CFG_DATA0
      - U1 CFG_DATA0
      - R3 pin1

    NET: U1_CONF_DONE
      - U1 CONF_DONE
      - R4 pin1

    NET: U1_NSTATUS
      - U1 NSTATUS
      - R5 pin1

    NET: U1_NCONFIG
      - U1 NCONFIG
      - R6 pin1

    NET: U1_DCLK
      - U1 DCLK
      - R7 pin1

    NET: U1_ASDO
      - U1 ASDO
      - R8 pin1


    COMPONENT_PINS:
    U1 (EP4CE6)
    - pin1(MSEL0): NETS(U1_MSEL0)
    - pin2(MSEL1): NETS(U1_MSEL1)
    - pin3(CFG_DATA0): NETS(U1_CFG_DATA0)
    - pin4(CONF_DONE): NETS(U1_CONF_DONE)
    - pin5(NSTATUS): NETS(U1_NSTATUS)
    - pin6(NCONFIG): NETS(U1_NCONFIG)
    - pin7(DCLK): NETS(U1_DCLK)
    - pin8(ASDO): NETS(U1_ASDO)
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED
    - pin21: NOT_CONNECTED
    - pin22: NOT_CONNECTED
    - pin23: NOT_CONNECTED
    - pin24: NOT_CONNECTED
    - pin25: NOT_CONNECTED
    - pin26: NOT_CONNECTED
    - pin27: NOT_CONNECTED
    - pin28: NOT_CONNECTED
    - pin29: NOT_CONNECTED
    - pin30: NOT_CONNECTED
    - pin31: NOT_CONNECTED
    - pin32: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MSEL0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (2kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_MSEL1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (3kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CFG_DATA0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (4kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CONF_DONE)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R5 (5kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_NSTATUS)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R6 (6kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_NCONFIG)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R7 (7kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DCLK)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R8 (8kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ASDO)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
