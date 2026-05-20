import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores RTC clock alarm and backup pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="RTC-CTRL"
        pinLabels={{
          pin1: ["pin14", "RTC_INT1"],
          pin2: ["pin15", "RTC_SQW1"],
          pin3: ["pin16", "RTC_32KOUT1"],
          pin4: ["pin17", "PCF8563_ALARM1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .RTC_INT1" to=".R1 > .pin1" />
      <trace from=".U1 .RTC_SQW1" to=".R1 > .pin2" />
      <trace from=".U1 .RTC_32KOUT1" to=".C1 > .pin1" />
      <trace from=".U1 .PCF8563_ALARM1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RTC_INT1")
  expect(netlist).toContain("  - U1 pin14 (RTC_INT1)")
  expect(netlist).toContain("- pin1(pin14, RTC_INT1): NETS(U1_RTC_INT1)")

  expect(netlist).toContain("NET: U1_RTC_SQW1")
  expect(netlist).toContain("  - U1 pin15 (RTC_SQW1)")

  expect(netlist).toContain("NET: U1_RTC_32KOUT1")
  expect(netlist).toContain("  - U1 pin16 (RTC_32KOUT1)")

  expect(netlist).toContain("NET: U1_PCF8563_ALARM1")
  expect(netlist).toContain("  - U1 pin17 (PCF8563_ALARM1)")
  expect(netlist).toContain(
    "- pin4(pin17, PCF8563_ALARM1): NETS(U1_PCF8563_ALARM1)",
  )
})
