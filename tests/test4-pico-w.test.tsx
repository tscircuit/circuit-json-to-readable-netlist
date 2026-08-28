import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("should render full pin labels for chip pins containing numbers", () => {
  const circuitJson = renderCircuit(
    <board width="50mm" height="50mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="Pico-W"
        pinLabels={{
          pin1: ["pin1", "GP14"],
          pin2: ["pin2", "3V3"],
          pin3: ["GPIO1", "SCL"],
          pin4: ["GPIO2", "SDA"],
          pin5: ["GPIO3"],
          pin6: ["GPIO4", "UART_TX"],
          pin7: ["GPIO5", "UART_RX"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="10k" name="R1" footprint="0805" />
      <trace from=".U1 .GP14" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  console.log("NETLIST OUTPUT:")
  console.log(netlist)
  expect(netlist).toContain("GP14")
})
