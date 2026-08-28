import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve DMX512 and DALI lighting-control labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="MAX485"
        pinLabels={{
          pin1: ["DMX512_DATA_P1"],
          pin2: ["DMX512_DATA_N1"],
          pin3: ["DMX_BREAK1"],
          pin4: ["RDM_DIR1"],
          pin5: ["DALI_BUS1"],
          pin6: ["DALI_TX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .DMX512_DATA_P1" to=".R1 > .pin1" />
      <trace from=".U1 .DMX512_DATA_N1" to=".R2 > .pin1" />
      <trace from=".U1 .DMX_BREAK1" to=".R3 > .pin1" />
      <trace from=".U1 .RDM_DIR1" to=".R4 > .pin1" />
      <trace from=".U1 .DALI_BUS1" to=".R5 > .pin1" />
      <trace from=".U1 .DALI_TX1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "DMX512_DATA_P1",
    "DMX512_DATA_N1",
    "DMX_BREAK1",
    "RDM_DIR1",
    "DALI_BUS1",
    "DALI_TX1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
