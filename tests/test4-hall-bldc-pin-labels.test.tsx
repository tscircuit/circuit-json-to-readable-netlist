import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores numbered Hall and BLDC feedback pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="DRV10983"
        pinLabels={{
          pin1: ["HALL_U1"],
          pin2: ["HALL_V1"],
          pin3: ["BLDC_TACH1"],
          pin4: ["FG1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .HALL_U1" to=".R1 > .pin1" />
      <trace from=".U1 .HALL_V1" to=".R1 > .pin2" />
      <trace from=".U1 .BLDC_TACH1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HALL_U1")
  expect(netlist).toContain("NET: U1_HALL_V1")
  expect(netlist).toContain("NET: U1_BLDC_TACH1")
  expect(netlist).toContain("- pin1(HALL_U1): NETS(U1_HALL_U1)")
  expect(netlist).toContain("- pin2(HALL_V1): NETS(U1_HALL_V1)")
  expect(netlist).toContain("- pin3(BLDC_TACH1): NETS(U1_BLDC_TACH1)")
})
