import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps quantum-control labels with channel numbers in readable net names", () => {
  expect(scorePhrase("QUBIT_READOUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("FLUX_BIAS1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="QCTRL-4"
        pinLabels={{
          pin1: ["QUBIT_READOUT1"],
          pin2: ["FLUX_BIAS1"],
          pin3: ["SQUID_LOOP1"],
          pin4: ["JOSEPHSON_BIAS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />

      <trace from=".U1 .QUBIT_READOUT1" to=".R1 .pin1" />
      <trace from=".U1 .FLUX_BIAS1" to=".R2 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_QUBIT_READOUT1")
  expect(readableNetlist).toContain("NET: U1_FLUX_BIAS1")
  expect(readableNetlist).toContain("- U1 QUBIT_READOUT1")
  expect(readableNetlist).toContain("- U1 FLUX_BIAS1")
  expect(readableNetlist).not.toContain("NET: R1_pos")
  expect(readableNetlist).not.toContain("NET: R2_pos")
})
