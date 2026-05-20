import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores platform-management aliases above generic numbered labels", () => {
  expect(scorePhrase("MCTP_ALERT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("PECI_DATA1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("IPMI_IRQ1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("SGPIO_CLK1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("uses platform-management aliases instead of generic numbered pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="BMC-SIDEBAND-IC"
        pinLabels={{
          pin14: ["MCTP_ALERT1", "PECI_DATA1", "IPMI_IRQ1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .MCTP_ALERT1" to=".R1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MCTP_ALERT1")
  expect(netlist).toContain("U1 MCTP_ALERT1 (PECI_DATA1,IPMI_IRQ1)")
  expect(netlist).toContain(
    "- pin14(MCTP_ALERT1, PECI_DATA1, IPMI_IRQ1): NETS(U1_MCTP_ALERT1)",
  )
})
