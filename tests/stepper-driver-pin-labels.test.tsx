import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves stepper driver control pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TMC2209"
        pinLabels={{
          pin1: ["STEP1"],
          pin2: ["DIR1"],
          pin3: ["MS1"],
          pin4: ["MS2"],
          pin5: ["FAULT1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .STEP1" to=".R1 > .pin1" />
      <trace from=".U1 .DIR1" to=".C1 > .pin1" />
      <trace from=".U1 .MS1" to=".R1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_STEP1")
  expect(netlist).toContain("  - U1 STEP1")
  expect(netlist).toContain("- pin1(STEP1): NETS(U1_STEP1)")
  expect(netlist).toContain("NET: U1_DIR1")
  expect(netlist).toContain("  - U1 DIR1")
  expect(netlist).toContain("- pin2(DIR1): NETS(U1_DIR1)")
  expect(netlist).toContain("NET: U1_MS1")
  expect(netlist).toContain("  - U1 MS1")
  expect(netlist).toContain("- pin3(MS1): NETS(U1_MS1)")
})
