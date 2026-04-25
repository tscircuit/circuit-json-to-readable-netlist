import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("chip with many pins uses descriptive labels instead of pin14", () => {
  const circuitJson = renderCircuit(
    <board width="20mm" height="20mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="STM32F103"
        pinLabels={{
          pin1: ["VDD"],
          pin2: ["GND"],
          pin3: ["PA0", "GPIO0", "ADC0"],
          pin4: ["PA1", "GPIO1", "ADC1"],
          pin5: ["PA2", "GPIO2", "UART_TX"],
          pin6: ["PA3", "GPIO3", "UART_RX"],
          pin7: ["PB0", "SPI_SCK", "GPIO4"],
          pin8: ["PB1", "SPI_MOSI", "GPIO5"],
          pin9: ["PB2", "SPI_MISO", "GPIO6"],
          pin10: ["PB3", "GPIO7"],
          pin11: ["PB4", "GPIO8"],
          pin12: ["PC0", "I2C_SDA", "GPIO9"],
          pin13: ["PC1", "I2C_SCL", "GPIO10"],
          pin14: ["NRST"],
          pin15: ["BOOT0"],
          pin16: ["VDDA"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <trace from=".U1 .VDD" to="net.VCC" />
      <trace from=".U1 .GND" to="net.GND" />
      <trace from=".U1 .UART_TX" to=".R1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Should not contain raw "pin14" or "pin15" etc when descriptive labels exist
  expect(netlist).not.toContain("U1 pin14")
  expect(netlist).not.toContain("U1 pin3")
  expect(netlist).not.toContain("U1 pin5")

  // Should use the descriptive labels
  expect(netlist).toContain("NRST")
  expect(netlist).toContain("UART_TX")

  // Should not contain "undefined"
  expect(netlist).not.toContain("undefined")
})

it("pin labels from port_hints are preferred over generic pin numbers for chip nets", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U2"
        footprint="soic8"
        manufacturerPartNumber="MCP3204"
        pinLabels={{
          pin1: ["CH0"],
          pin2: ["CH1"],
          pin3: ["CH2"],
          pin4: ["CH3"],
          pin5: ["GND"],
          pin6: ["DOUT", "SPI_MISO"],
          pin7: ["DIN", "SPI_MOSI"],
          pin8: ["VDD"],
        }}
      />
      <chip name="U3" footprint="soic8" manufacturerPartNumber="SPI_MASTER" />
      <trace from=".U2 .DOUT" to=".U3 .pin1" />
      <trace from=".U2 .VDD" to="net.VCC" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // U2's pin6 (DOUT/SPI_MISO) should show as a descriptive name, not "pin6"
  expect(netlist).not.toContain("U2 pin6")
  expect(netlist).toContain("DOUT")
  expect(netlist).not.toContain("undefined")
})
