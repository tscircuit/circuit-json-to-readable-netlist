import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores SIM UICC and ISO7816 smartcard pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="SMARTCARD-IF"
        pinLabels={{
          pin1: ["pin14", "SIM_IO1"],
          pin2: ["pin15", "UICC_CLK1"],
          pin3: ["pin16", "ISO7816_RST1"],
          pin4: ["pin17", "SMARTCARD_DET1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .SIM_IO1" to=".R1 > .pin1" />
      <trace from=".U1 .UICC_CLK1" to=".R1 > .pin2" />
      <trace from=".U1 .ISO7816_RST1" to=".C1 > .pin1" />
      <trace from=".U1 .SMARTCARD_DET1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SIM_IO1")
  expect(netlist).toContain("  - U1 pin14 (SIM_IO1)")
  expect(netlist).toContain("- pin1(pin14, SIM_IO1): NETS(U1_SIM_IO1)")

  expect(netlist).toContain("NET: U1_UICC_CLK1")
  expect(netlist).toContain("  - U1 pin15 (UICC_CLK1)")

  expect(netlist).toContain("NET: U1_ISO7816_RST1")
  expect(netlist).toContain("  - U1 pin16 (ISO7816_RST1)")

  expect(netlist).toContain("NET: U1_SMARTCARD_DET1")
  expect(netlist).toContain("  - U1 pin17 (SMARTCARD_DET1)")
  expect(netlist).toContain(
    "- pin4(pin17, SMARTCARD_DET1): NETS(U1_SMARTCARD_DET1)",
  )
})
