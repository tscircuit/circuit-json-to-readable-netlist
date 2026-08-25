import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves FPC and FFC connector pin labels in readable net names", () => {
  expect(scorePhrase("FPC_PIN1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("FFC_LANE1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("BTB_CONN1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="soic8"
        manufacturerPartNumber="FH12-10S"
        pinLabels={{
          pin1: ["FPC_PIN1", "FPC_DET"],
          pin2: ["FFC_LANE1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".J1 .FPC_PIN1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: J1_FPC_PIN1")
  expect(netlist).toContain("  - J1 FPC_PIN1 (FPC_DET)")
  expect(netlist).not.toContain("NET: R1_pos")
})
