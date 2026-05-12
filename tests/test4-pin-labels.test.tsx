import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test4 chip with rich pin labels uses labels, not pinN, in COMPONENT_PINS", () => {
  // Reproduces tscircuit/circuit-json-to-readable-netlist#4
  // The Pico W has 40 pins where each pin has a meaningful label such as
  // GP0, GP14, etc. The previous output showed `pin14` rather than `GP14`.
  const circuitJson = renderCircuit(
    <board width="20mm" height="20mm" routingDisabled>
      <chip
        name="U1"
        footprint="dip40"
        manufacturerPartNumber="RP2040_PICO_W"
        pinLabels={{
          pin1: ["GP0", "UART0_TX"],
          pin2: ["GP1", "UART0_RX"],
          pin14: ["GP10"],
          pin19: ["GP14"],
          pin36: ["3V3_OUT"],
          pin38: ["GND"],
        }}
      />
      <trace from=".U1 .GP14" to="net.LED_DATA" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // 1. Output must never contain literal "undefined"
  expect(netlist).not.toContain("undefined")

  // 2. The COMPONENT_PINS section must show the real label (GP14) not pinN
  expect(netlist).toContain("GP14")
  expect(netlist).not.toMatch(/^- pin19(/m)

  // 3. The pin we wired up must be listed by its label in the NET section
  expect(netlist).toMatch(/U1 GP14/)
})
