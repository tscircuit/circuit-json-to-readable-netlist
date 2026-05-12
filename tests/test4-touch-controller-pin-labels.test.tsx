import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores numbered capacitive touch controller pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="FT6236"
        pinLabels={{
          pin1: ["CTP_INT1"],
          pin2: ["TOUCH_RESET1"],
          pin3: ["TOUCH_WAKE1"],
          pin4: ["VDD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .CTP_INT1" to=".R1 > .pin1" />
      <trace from=".U1 .TOUCH_RESET1" to=".R1 > .pin2" />
      <trace from=".U1 .TOUCH_WAKE1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CTP_INT1")
  expect(netlist).toContain("NET: U1_TOUCH_RESET1")
  expect(netlist).toContain("NET: U1_TOUCH_WAKE1")
  expect(netlist).toContain("- pin1(CTP_INT1): NETS(U1_CTP_INT1)")
  expect(netlist).toContain("- pin2(TOUCH_RESET1): NETS(U1_TOUCH_RESET1)")
  expect(netlist).toContain("- pin3(TOUCH_WAKE1): NETS(U1_TOUCH_WAKE1)")
})
