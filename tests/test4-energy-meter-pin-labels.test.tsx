import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores energy-metering aliases before generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="ADE7953"
        pinLabels={{
          pin1: ["METER_CF1"],
          pin2: ["ENERGY_PULSE1"],
          pin3: ["ADE_IRQ1"],
          pin4: ["ATM90E_WARN1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".U1 .METER_CF1" to=".R1 > .pin1" />
      <trace from=".U1 .ENERGY_PULSE1" to=".R2 > .pin1" />
      <trace from=".U1 .ADE_IRQ1" to=".R3 > .pin1" />
      <trace from=".U1 .ATM90E_WARN1" to=".R4 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_METER_CF1")
  expect(readableNetlist).toContain("NET: U1_ENERGY_PULSE1")
  expect(readableNetlist).toContain("NET: U1_ADE_IRQ1")
  expect(readableNetlist).toContain("NET: U1_ATM90E_WARN1")
  expect(readableNetlist).toContain("  - U1 METER_CF1")
  expect(readableNetlist).toContain("  - U1 ENERGY_PULSE1")
  expect(readableNetlist).toContain("  - U1 ADE_IRQ1")
  expect(readableNetlist).toContain("  - U1 ATM90E_WARN1")
  expect(readableNetlist).toContain("- pin1(METER_CF1): NETS(U1_METER_CF1)")
  expect(readableNetlist).toContain(
    "- pin2(ENERGY_PULSE1): NETS(U1_ENERGY_PULSE1)",
  )
  expect(readableNetlist).toContain("- pin3(ADE_IRQ1): NETS(U1_ADE_IRQ1)")
  expect(readableNetlist).toContain(
    "- pin4(ATM90E_WARN1): NETS(U1_ATM90E_WARN1)",
  )
})
