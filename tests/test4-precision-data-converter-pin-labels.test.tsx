import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores precision data-converter aliases before generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="ADS8688"
        pinLabels={{
          pin1: ["ADC_DRDY1"],
          pin2: ["CNVST1"],
          pin3: ["DAC_LDAC1"],
          pin4: ["AIN0P"],
          pin5: ["REFP1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />

      <trace from=".U1 .ADC_DRDY1" to=".R1 > .pin1" />
      <trace from=".U1 .CNVST1" to=".R2 > .pin1" />
      <trace from=".U1 .DAC_LDAC1" to=".R3 > .pin1" />
      <trace from=".U1 .AIN0P" to=".R4 > .pin1" />
      <trace from=".U1 .REFP1" to=".R5 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_ADC_DRDY1")
  expect(readableNetlist).toContain("NET: U1_CNVST1")
  expect(readableNetlist).toContain("NET: U1_DAC_LDAC1")
  expect(readableNetlist).toContain("NET: U1_AIN0P")
  expect(readableNetlist).toContain("NET: U1_REFP1")
  expect(readableNetlist).toContain("  - U1 ADC_DRDY1")
  expect(readableNetlist).toContain("  - U1 CNVST1")
  expect(readableNetlist).toContain("  - U1 DAC_LDAC1")
  expect(readableNetlist).toContain("  - U1 AIN0P")
  expect(readableNetlist).toContain("  - U1 REFP1")
  expect(readableNetlist).toContain("- pin1(ADC_DRDY1): NETS(U1_ADC_DRDY1)")
  expect(readableNetlist).toContain("- pin2(CNVST1): NETS(U1_CNVST1)")
  expect(readableNetlist).toContain("- pin3(DAC_LDAC1): NETS(U1_DAC_LDAC1)")
  expect(readableNetlist).toContain("- pin4(AIN0P): NETS(U1_AIN0P)")
  expect(readableNetlist).toContain("- pin5(REFP1): NETS(U1_REFP1)")
})
