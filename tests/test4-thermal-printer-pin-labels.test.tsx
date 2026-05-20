import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves thermal printer pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="THERMAL-PRINTER-CTRL"
        pinLabels={{
          pin1: ["THERMAL_STB1"],
          pin2: ["PAPER_OUT1"],
          pin3: ["CUTTER_HOME1"],
          pin4: ["CASH_DRAWER1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <resistor resistance="10k" footprint="0402" name="R4" />

      <trace from=".U1 .THERMAL_STB1" to=".R1 .pin1" />
      <trace from=".U1 .PAPER_OUT1" to=".R2 .pin1" />
      <trace from=".U1 .CUTTER_HOME1" to=".R3 .pin1" />
      <trace from=".U1 .CASH_DRAWER1" to=".R4 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_THERMAL_STB1")
  expect(netlist).toContain("NET: U1_PAPER_OUT1")
  expect(netlist).toContain("NET: U1_CUTTER_HOME1")
  expect(netlist).toContain("NET: U1_CASH_DRAWER1")
  expect(netlist).toContain("U1 THERMAL_STB1")
  expect(netlist).toContain("U1 PAPER_OUT1")
  expect(netlist).toContain("U1 CUTTER_HOME1")
  expect(netlist).toContain("U1 CASH_DRAWER1")
})
