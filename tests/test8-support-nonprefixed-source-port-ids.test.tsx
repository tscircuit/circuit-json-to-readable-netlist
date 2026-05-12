import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("handles source_port ids that do not start with source_port", () => {
  const original = renderCircuit(
    <board width="20mm" height="20mm">
      <resistor name="R1" resistance="1k" />
      <resistor name="R2" resistance="2k" />
      <trace from=".R1 > .pin1" to=".R2 > .pin1" />
    </board>,
  )

  const sourcePorts = original.filter((element: any) => element.type === "source_port")
  let rewritten = JSON.stringify(original)

  sourcePorts.forEach((port: any, index: number) => {
    rewritten = rewritten.split(port.source_port_id).join(`p${index}`)
  })

  const circuitJson = JSON.parse(rewritten)
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET:")
  expect(netlist).toContain("R1")
  expect(netlist).toContain("R2")
})
