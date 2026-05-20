import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves Raspberry Pi HAT pin labels in readable net names", () => {
  expect(scorePhrase("RPI_GPIO17")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("PI_5V")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HAT_ID_SD")).toBeGreaterThan(scorePhrase("pin8"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="dip28"
        manufacturerPartNumber="Raspberry Pi HAT header"
        pinLabels={{
          pin1: ["RPI_GPIO17"],
          pin2: ["HAT_ID_SD"],
          pin3: ["PI_5V"],
          pin4: ["HAT_ID_SC"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="1uF" footprint="0402" name="C1" />

      <trace from=".U1 .RPI_GPIO17" to=".R1 > .pin1" />
      <trace from=".U1 .HAT_ID_SD" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RPI_GPIO17")
  expect(netlist).toContain("  - U1 RPI_GPIO17")
  expect(netlist).toContain("NET: U1_HAT_ID_SD")
  expect(netlist).toContain("  - U1 HAT_ID_SD")
})
