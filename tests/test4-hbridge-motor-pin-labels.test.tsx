import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores numbered H-bridge motor driver pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TB6612FNG"
        pinLabels={{
          pin1: ["AIN1"],
          pin2: ["BIN1"],
          pin3: ["PWMA1"],
          pin4: ["STBY1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .AIN1" to=".R1 > .pin1" />
      <trace from=".U1 .BIN1" to=".R1 > .pin2" />
      <trace from=".U1 .PWMA1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_AIN1")
  expect(netlist).toContain("NET: U1_BIN1")
  expect(netlist).toContain("NET: U1_PWMA1")
  expect(netlist).toContain("- pin1(AIN1): NETS(U1_AIN1)")
  expect(netlist).toContain("- pin2(BIN1): NETS(U1_BIN1)")
  expect(netlist).toContain("- pin3(PWMA1): NETS(U1_PWMA1)")
})
