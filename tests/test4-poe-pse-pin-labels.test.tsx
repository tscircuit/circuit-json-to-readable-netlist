import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves PoE and PSE controller aliases in readable netlists", () => {
  expect(scorePhrase("POE_DET1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("PSE_EN1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MPS_DET1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("T2P1")).toBeGreaterThan(scorePhrase("pin14"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="TPS2378"
        pinLabels={{
          pin14: ["POE_DET1", "PSE_EN1", "MPS_DET1", "T2P1"],
        }}
      />
      <resistor resistance="24.9k" footprint="0402" name="R1" />
      <trace from=".U1 .POE_DET1" to=".R1 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_POE_DET1")
  expect(readableNetlist).toContain("- U1 POE_DET1 (PSE_EN1,MPS_DET1,T2P1)")
  expect(readableNetlist).toContain(
    "- pin14(POE_DET1, PSE_EN1, MPS_DET1, T2P1): NETS(U1_POE_DET1)",
  )
})
