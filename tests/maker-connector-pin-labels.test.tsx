import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves maker connector aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin1: ["pin14", "QWIIC_SDA"],
          pin2: ["pin15", "STEMMA_QT_SCL"],
          pin3: ["pin16", "GROVE_SIG1"],
          pin4: ["pin17", "MIKROBUS_INT"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".R1 .pin2" />
      <trace from=".U1 .pin16" to=".C1 .pin1" />
      <trace from=".U1 .pin17" to=".C1 .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_QWIIC_SDA")
  expect(netlist).toContain("  - U1 pin14 (QWIIC_SDA)")
  expect(netlist).toContain("NET: U1_STEMMA_QT_SCL")
  expect(netlist).toContain("  - U1 pin15 (STEMMA_QT_SCL)")
  expect(netlist).toContain("NET: U1_GROVE_SIG1")
  expect(netlist).toContain("  - U1 pin16 (GROVE_SIG1)")
  expect(netlist).toContain("NET: U1_MIKROBUS_INT")
  expect(netlist).toContain("  - U1 pin17 (MIKROBUS_INT)")
})
