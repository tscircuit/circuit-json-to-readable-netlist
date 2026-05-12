import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores HyperBus and xSPI aliases above passive labels", () => {
  expect(scorePhrase("HYPERBUS_DQ0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HYPERRAM_RWDS1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HYPERFLASH_CS1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("OSPI_DQS1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("XSPI_IO0")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves HyperBus and xSPI labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="bga64"
        manufacturerPartNumber="HYPER-MEM"
        pinLabels={{
          pin1: ["HYPERBUS_DQ0"],
          pin2: ["OSPI_DQS1"],
        }}
      />
      <resistor resistance="33" footprint="0402" name="R1" />
      <resistor resistance="33" footprint="0402" name="R2" />

      <trace from=".U1 .HYPERBUS_DQ0" to=".R1 > .pin1" />
      <trace from=".U1 .OSPI_DQS1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HYPERBUS_DQ0")
  expect(netlist).toContain("  - U1 HYPERBUS_DQ0")
  expect(netlist).toContain("- pin1(HYPERBUS_DQ0): NETS(U1_HYPERBUS_DQ0)")
  expect(netlist).toContain("NET: U1_OSPI_DQS1")
  expect(netlist).toContain("  - U1 OSPI_DQS1")
  expect(netlist).toContain("- pin2(OSPI_DQS1): NETS(U1_OSPI_DQS1)")
})
