import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores LPC eSPI and TPM platform-management pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="TPM9670"
        pinLabels={{
          pin1: ["pin14", "LPC_AD0"],
          pin2: ["pin15", "ESPI_CLK"],
          pin3: ["pin16", "TPM_PIRQ"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .LPC_AD0" to=".R1 > .pin1" />
      <trace from=".U1 .ESPI_CLK" to=".R1 > .pin2" />
      <trace from=".U1 .TPM_PIRQ" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_LPC_AD0")
  expect(netlist).toContain("  - U1 pin14 (LPC_AD0)")
  expect(netlist).toContain("- pin1(pin14, LPC_AD0): NETS(U1_LPC_AD0)")

  expect(netlist).toContain("NET: U1_ESPI_CLK")
  expect(netlist).toContain("  - U1 pin15 (ESPI_CLK)")

  expect(netlist).toContain("NET: U1_TPM_PIRQ")
  expect(netlist).toContain("  - U1 pin16 (TPM_PIRQ)")
  expect(netlist).toContain("- pin3(pin16, TPM_PIRQ): NETS(U1_TPM_PIRQ)")
})
