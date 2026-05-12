import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves barcode scanner aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="ScannerModule"
        pinLabels={{
          pin14: ["pin14", "BARCODE_TRIG"],
          pin15: ["pin15", "QR_DECODE"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />

      <trace from=".U1 .BARCODE_TRIG" to=".R1 .pin1" />
      <trace from=".U1 .QR_DECODE" to=".R2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BARCODE_TRIG")
  expect(netlist).toContain("  - U1 pin14 (BARCODE_TRIG)")
  expect(netlist).toContain("NET: U1_QR_DECODE")
  expect(netlist).toContain("  - U1 pin15 (QR_DECODE)")
  expect(scorePhrase("SCAN_GOOD")).toBeGreaterThan(1)
  expect(scorePhrase("LASER_EN")).toBeGreaterThan(1)
})
