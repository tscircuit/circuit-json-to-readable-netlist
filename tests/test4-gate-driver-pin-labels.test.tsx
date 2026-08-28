import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("prefers isolated gate driver aliases over generic passive polarity hints", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        pinLabels={{
          pin14: ["DESAT1"],
          pin15: ["MILLER_CLAMP1"],
          pin16: ["GATE_HS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .DESAT1" to=".R1 .pin1" />
      <trace from=".U1 .MILLER_CLAMP1" to=".R1 .pin2" />
      <trace from=".U1 .GATE_HS1" to=".C1 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_DESAT1")
  expect(readableNetlist).toContain("NET: U1_MILLER_CLAMP1")
  expect(readableNetlist).toContain("NET: U1_GATE_HS1")
  expect(readableNetlist).not.toContain("NET: R1_pos")
  expect(readableNetlist).not.toContain("NET: R1_neg")
  expect(readableNetlist).not.toContain("NET: C1_pos")
})
