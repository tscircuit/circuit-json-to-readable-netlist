import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores isoSPI battery stack pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn48"
        manufacturerPartNumber="LTC6811"
        pinLabels={{
          pin1: ["ISOSPI_P1"],
          pin2: ["ISOSPI_N1"],
          pin3: ["LTC6811_SDOA"],
          pin4: ["LTC6811_SDIA"],
          pin5: ["SDOA1"],
          pin6: ["SDIA1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .ISOSPI_P1" to=".R1 > .pin1" />
      <trace from=".U1 .ISOSPI_N1" to=".R2 > .pin1" />
      <trace from=".U1 .LTC6811_SDOA" to=".R3 > .pin1" />
      <trace from=".U1 .LTC6811_SDIA" to=".R4 > .pin1" />
      <trace from=".U1 .SDOA1" to=".R5 > .pin1" />
      <trace from=".U1 .SDIA1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_ISOSPI_P1")
  expect(readableNetlist).toContain("NET: U1_ISOSPI_N1")
  expect(readableNetlist).toContain("NET: U1_LTC6811_SDOA")
  expect(readableNetlist).toContain("NET: U1_LTC6811_SDIA")
  expect(readableNetlist).toContain("NET: U1_SDOA1")
  expect(readableNetlist).toContain("NET: U1_SDIA1")
  expect(readableNetlist).toContain("- pin1(ISOSPI_P1): NETS(U1_ISOSPI_P1)")
  expect(readableNetlist).toContain("- pin2(ISOSPI_N1): NETS(U1_ISOSPI_N1)")
  expect(readableNetlist).toContain(
    "- pin3(LTC6811_SDOA): NETS(U1_LTC6811_SDOA)",
  )
  expect(readableNetlist).toContain(
    "- pin4(LTC6811_SDIA): NETS(U1_LTC6811_SDIA)",
  )
})
