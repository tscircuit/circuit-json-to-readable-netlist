import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve CXPI body bus labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="BD41030FJ"
        pinLabels={{
          pin1: ["CXPI_BUS1"],
          pin2: ["CXPI_TX1"],
          pin3: ["CXPI_RX1"],
          pin4: ["CXPI_WAKE1"],
          pin5: ["CXPI_SLP1"],
          pin6: ["CXPI_FAULT1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .CXPI_BUS1" to=".R1 > .pin1" />
      <trace from=".U1 .CXPI_TX1" to=".R2 > .pin1" />
      <trace from=".U1 .CXPI_RX1" to=".R3 > .pin1" />
      <trace from=".U1 .CXPI_WAKE1" to=".R4 > .pin1" />
      <trace from=".U1 .CXPI_SLP1" to=".R5 > .pin1" />
      <trace from=".U1 .CXPI_FAULT1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "CXPI_BUS1",
    "CXPI_TX1",
    "CXPI_RX1",
    "CXPI_WAKE1",
    "CXPI_SLP1",
    "CXPI_FAULT1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
