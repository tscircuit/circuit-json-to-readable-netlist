import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores numbered RTC backup-domain pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="DS3231M"
        pinLabels={{
          pin1: ["VBAT1"],
          pin2: ["RTC_INTB1"],
          pin3: ["CLKOUT1"],
          pin4: ["SQW1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .VBAT1" to=".R1 > .pin1" />
      <trace from=".U1 .RTC_INTB1" to=".R1 > .pin2" />
      <trace from=".U1 .CLKOUT1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_VBAT1")
  expect(netlist).toContain("NET: U1_RTC_INTB1")
  expect(netlist).toContain("NET: U1_CLKOUT1")
  expect(netlist).toContain("- pin1(VBAT1): NETS(U1_VBAT1)")
  expect(netlist).toContain("- pin2(RTC_INTB1): NETS(U1_RTC_INTB1)")
  expect(netlist).toContain("- pin3(CLKOUT1): NETS(U1_CLKOUT1)")
})
