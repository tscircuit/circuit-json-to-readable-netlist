import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("renders named single-pin source nets as nets", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["VDD"],
        }}
      />
      <trace from=".U1 .VDD" to="net.V5" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).toContain("NET: V5\n  - U1 VDD")
  expect(netlist).not.toContain("EMPTY NET PINS:\n  - U1 VDD")
})
