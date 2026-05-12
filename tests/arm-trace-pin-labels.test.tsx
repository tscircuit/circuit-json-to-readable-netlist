import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores ARM trace aliases before the generic digit fallback", () => {
  expect(scorePhrase("TRACECLK")).toBeGreaterThan(1)
  expect(scorePhrase("TRACED0")).toBeGreaterThan(1)
  expect(scorePhrase("TRACE_D1")).toBeGreaterThan(1)
  expect(scorePhrase("TPIU_TRACE")).toBeGreaterThan(1)
  expect(scorePhrase("pin2")).toBe(0.5)
})

it("preserves ARM trace aliases in readable net names and pin entries", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TRACE-MCU"
        pinLabels={{
          pin1: ["pin1", "TRACECLK"],
          pin2: ["pin2", "TRACED0"],
          pin3: ["pin3", "TPIU_TRACE"],
        }}
      />
      <resistor resistance="1k" name="R1" />

      <trace from=".U1 .pin1" to=".R1 .pin1" />
      <trace from=".U1 .pin2" to=".R1 .pin2" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_TRACECLK")
  expect(readableNetlist).toContain("NET: U1_TRACED0")
  expect(readableNetlist).toContain("  - U1 pin1 (TRACECLK)")
  expect(readableNetlist).toContain("  - U1 pin2 (TRACED0)")
  expect(readableNetlist).not.toContain("NET: R1_neg")
})
