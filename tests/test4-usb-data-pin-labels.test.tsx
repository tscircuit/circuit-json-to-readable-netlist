import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("includes USB data aliases for generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["pin1", "USB_DP"],
          pin2: ["pin2", "USB_DM"],
        }}
      />
      <resistor resistance="22Ω" footprint="0402" name="R1" />
      <resistor resistance="22Ω" footprint="0402" name="R2" />

      <trace from=".U1 .USB_DP" to=".R1 > .pin1" />
      <trace from=".U1 .USB_DM" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("U1 pin1 (USB_DP)")
  expect(netlist).toContain("U1 pin2 (USB_DM)")
  expect(netlist).toContain("NET: U1_USB_DP")
  expect(netlist).toContain("NET: U1_USB_DM")
})
